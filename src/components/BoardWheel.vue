<template>
  <centered-container id="container" v-if="store.getters.gameReady && store.state.isSession">
    <div id="title_container">
      <h3>Current Board</h3>
    </div>
    <canvas ref="boardCanvas" id="boardCanvas" height="3504" width="3504"/>
    <h4 id="current_scores">Current Scores</h4>
    <div id="scores_container">
      <scores/>
    </div>
    <div id="cancel_container" v-if="!matchMedia.md">
      <ion-nav-link :router-link="'/session/gamemenu'">Return to Game Menu</ion-nav-link>
    </div>
  </centered-container>
</template>

<script lang="ts">
import { IonNavLink, menuController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import PlayerColors from "@/mixins/PlayerColors.ts";
import Scores from "@/components/Scores.vue";
import { initialToSpaceObject, GOAL_OBJECT } from "@/constants.ts";
import DarkMode from "@/mixins/DarkMode.ts";
import { useMatchMedia } from '@cwist/vue-match-media';
import CenteredContainer from "@/components/CenteredContainer.vue";

export default defineComponent({
  name: 'BoardWheel',
  components: {
    IonNavLink,
    Scores,
    CenteredContainer
  },
  mixins: [PlayerColors, DarkMode],
  data() {
    const store = useStore();
    return {
      store,
      matchMedia: useMatchMedia(),
      theoryImage: undefined,
      objectImages: undefined
    }
  },
  computed: {
    gameType: function(): any {
      return this.store.state.gameType;
    },
    session: function(): any {
      return this.store.state.session;
    },
    seasonView: function(): any {
      return this.store.state.seasonView;
    },
    playerSectors: function(): {[sector: number]: Array<number | null>} {
      const sectorMap: {[sector: number]: Array<number | null>} = {};
      const players = this.store.state.session.players.slice().sort((a: any, b: any) => a.arrival - b.arrival);
      for (let i = 0; i < players.length; i++) {
        const sector: number = players[i].sector as number;
        if (sectorMap[sector] === undefined) {
          sectorMap[sector] = [];
        }
        while (sectorMap[sector].length < players[i].arrival) {
          sectorMap[sector].push(null);
        }
        sectorMap[sector][players[i].arrival-1] = players[i].color;
      }
      for (const sector in sectorMap) {
        sectorMap[sector] = sectorMap[sector].filter((player: any) => player !== null);
      }
      return sectorMap;
    },
    theorySlots: function(): Array<Array<Array<any>>> {
      const sectors = Array.from(Array(this.store.state.gameType.sectors)).map(() => Array.from(Array(4)).map(() => []));
      for (let i = 0; i < this.store.getters.visibleTheories.length; i++) {
        const theory = this.store.getters.visibleTheories[i];
        sectors[theory.sector][theory.progress].push(theory);
      }
      return sectors;
    },
    sectorAngle: function(): number {
      return 2 * Math.PI/this.store.state.gameType.sectors;
    }
  },
  methods: {
    pegSize: function(boardRadius: number, paddingFactor: number, numPegs: number) {
      const rawPegAngle = this.sectorAngle/(numPegs * (1 + paddingFactor) + paddingFactor);
      // Solving system
      // pegRadius = Math.tan(rawPegRangle/2) * pegLoc
      // pegLoc = boardRadius + pegRadius + 2 * pegRadius * paddingFactor
      const tanAngle = Math.tan(rawPegAngle/2);
      const pegRadius = (tanAngle * boardRadius)/(1 - tanAngle - 2 * tanAngle * paddingFactor);

      return {
        radius: pegRadius,
        pegAngle: rawPegAngle
      }
    },
    pegSizeTwoRows: function(boardRadius: number, paddingFactor: number, numPegs: number) {
      const outerPegs = Math.ceil(numPegs/2);

      let rawPegAngle;
      if (numPegs % 2 === 1) {
        rawPegAngle = this.sectorAngle/(outerPegs * (1 + paddingFactor) + paddingFactor);
      } else {
        rawPegAngle = this.sectorAngle/(outerPegs * (1 + paddingFactor) + 1/2 + 3*paddingFactor/2)
      }

      // Solving system
      // pegRadius = Math.tan(rawPegRangle/2) * pegLoc
      // pegLoc = boardRadius + 3 * pegRadius + (2 + Math.sqrt(2)) * pegRadius * paddingFactor
      const tanAngle = Math.tan(rawPegAngle/2);
      const pegRadius = (tanAngle * boardRadius)/(1 - 3 * tanAngle - (2 + Math.sqrt(2)) * tanAngle * paddingFactor);

      return {
        radius: pegRadius,
        pegAngle: rawPegAngle
      };
    },
    pegLocations: function(boardRadius: number, pegRadius: number, paddingFactor: number, numPlayers: number, space: number) {
      const sectorAngle = 2 * Math.PI/this.store.state.gameType.sectors;
      pegRadius = Math.min(pegRadius, space/(2 + 4*paddingFactor));
      let pegPadding = 2 * pegRadius * paddingFactor;
      let outerPegLoc = boardRadius + space/2;
      // let outerPegLoc = boardRadius + pegPadding + pegRadius;
      const outerPaddingAngle = 2 * Math.atan2(pegPadding/4, outerPegLoc);
      const pegAngle = 2 * Math.atan2((2*pegRadius + pegPadding)/2, outerPegLoc);

      const maxPegsAtSize = Math.floor((sectorAngle - 2 * outerPaddingAngle)/pegAngle);
      const pegsOnRow = Math.max(maxPegsAtSize, 4);

      const pegRowInfo = this.pegSize(boardRadius, paddingFactor, pegsOnRow);

      if (numPlayers <= pegsOnRow) {
        pegRadius = pegRowInfo.radius;
        pegRadius = Math.min(pegRadius, space/(2 + 4*paddingFactor));

        pegPadding = 2 * pegRadius * paddingFactor;
        // outerPegLoc = boardRadius + pegRadius + pegPadding;

        const rawPegAngle = 2 * Math.atan2(pegRadius, outerPegLoc);
        const leftoverAngle = sectorAngle - numPlayers * rawPegAngle;
        const evenPaddingAngle = leftoverAngle/(numPlayers + 1);
        const evenIntervalAngle = rawPegAngle + evenPaddingAngle;
        const evenEdgeAngle = evenPaddingAngle + rawPegAngle/2;

        const locations = [];

        for (let i = 0; i < numPlayers; i++) {
            locations.push({
              angle: evenEdgeAngle + i * evenIntervalAngle,
              radius: outerPegLoc,
              size: pegRadius
            });
        }
        return locations;
      } else {
        const pegInfo = this.pegSizeTwoRows(boardRadius, paddingFactor, numPlayers);
        pegRadius = pegInfo.radius;
        pegRadius = Math.min(pegRadius, space/(4 + 4 * paddingFactor + Math.sqrt(2) * paddingFactor), pegRowInfo.radius);

        const rawPegAngle = pegInfo.pegAngle;
        const intervalAngle = rawPegAngle * (1/2 + paddingFactor/2);
        const offset = rawPegAngle * (1/2 + paddingFactor);

        pegPadding = 2 * pegRadius * paddingFactor;
        const innerPegLoc = boardRadius + pegRadius + pegPadding;

        outerPegLoc = boardRadius + space - pegRadius - pegPadding;

        const locations = [];

        for (let i = 0; i < numPlayers; i++) {
          const radius = (i % 2 === 0) ? innerPegLoc : outerPegLoc;
          locations.push({
            angle: offset + i * intervalAngle,
            radius,
            size: pegRadius
          });
        }

        return locations;
      }
    },
    getCSSVariable: function(varName: string) {
      return getComputedStyle(document.body).getPropertyValue(varName);
    },
    computeCanvas: async function() {
      if (!this.store.getters.gameReady || !this.store.state.isSession) {
        return;
      }

      await this.$nextTick();
      const canvas = this.$refs.boardCanvas as HTMLCanvasElement;
      if (canvas === null) {
        return;
      }
      const ctx = canvas.getContext("2d");
      ctx.resetTransform();
      ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
      ctx.translate(canvas.width/2, canvas.height/2);
      if (this.store.state.seasonView !== undefined) {
        ctx.rotate(this.store.state.seasonView.angle);
      }

      ctx.lineWidth = 8;

      const sectorAngle = 2 * Math.PI/this.store.state.gameType.sectors;
      const skyAngle = sectorAngle * this.store.state.session.currentSector;

      const boardRadius = 1400;
      const outerRadius = 1600;
      const trackRadius = 1750;
      const trackSpace = trackRadius - outerRadius;
      const textRadius = (boardRadius + outerRadius)/2;
      const textHeight = 150;

      const startTokenRadius = 700;
      const maxTokenWidth = Math.floor(2 * Math.tan(sectorAngle/2) * startTokenRadius);
      const maxTokenHeight = Math.floor((boardRadius - startTokenRadius)/4);
      const tokenSize = Math.min(136, 0.8*maxTokenWidth, 0.8*maxTokenHeight);

      const tokenEdgePadding = 32;
      const tokenIncrement = (boardRadius - startTokenRadius - tokenSize - tokenEdgePadding)/3;

      const innerRadius = startTokenRadius - tokenEdgePadding;
      const sunRadius = 100;

      let iconSize = 200;
      const tanRatio = 2 * Math.tan(this.sectorAngle/2);
      const maxIconWidth = (tanRatio * innerRadius)/(1 + tanRatio);
      iconSize = Math.min(iconSize, maxIconWidth*0.9);

      const theoryRadius = innerRadius - 10 - iconSize;
      const conferenceRadius = theoryRadius - iconSize;

      const lightColor = this.getCSSVariable("--ion-color-light");
      const darkColor = this.getCSSVariable("--ion-color-light-contrast");

      const skyColor = this.isDarkMode ? "#585858" : lightColor;
      const baseColor = this.isDarkMode ? lightColor : "silver";

      ctx.beginPath();
      ctx.fillStyle = baseColor;
      ctx.arc(0, 0, trackRadius, 0, 2*Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = skyColor;
      ctx.arc(0, 0, trackRadius, skyAngle, skyAngle + Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, innerRadius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, trackRadius, 0, 2*Math.PI);
      ctx.stroke();

      for (let i = 0; i < this.store.state.gameType.sectors; i++) {
        // Sector line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const x = trackRadius * Math.cos(i * sectorAngle);
        const y = trackRadius * Math.sin(i * sectorAngle);
        ctx.lineTo(x, y);
        ctx.strokeStyle = darkColor;
        ctx.stroke();

        // Sector number label
        ctx.save();

        ctx.rotate(Math.PI/2 + (sectorAngle/2 + i * sectorAngle));

        ctx.font = textHeight + "px Roboto";
        ctx.textAlign = "center";
        ctx.fillStyle = darkColor;
        ctx.textBaseline = "middle";
        ctx.fillText("" + (i+1), 0, -(textRadius-textHeight*0.1));

        ctx.restore();

        // Theory token slots
        for (let j = 0; j < 4; j++) {
          const progress = 3 - j;
          const radius = startTokenRadius + j * tokenIncrement;
          ctx.save();

          ctx.rotate(Math.PI/2 + (sectorAngle/2 + i * sectorAngle));

          ctx.beginPath();
          ctx.strokeStyle = darkColor;
          ctx.rect(-tokenSize/2, -radius-tokenSize, tokenSize, tokenSize);
          ctx.stroke();

          if (this.theorySlots[i][progress].length > 0) {
            const gradient = ctx.createLinearGradient(-tokenSize/2, -radius-tokenSize, tokenSize/2, -radius);
            const part = 1/(this.theorySlots[i][progress].length);
            for (let k = 0; k < this.theorySlots[i][progress].length; k++) {
              const theory = this.theorySlots[i][progress][k];
              const colorNum = this.store.getters.playerMap[theory.playerID].color;
              const color = this.playerColor(colorNum);

              gradient.addColorStop(k*part, color);
              gradient.addColorStop((k+1)*part, color);
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(-tokenSize/2, -radius-tokenSize, tokenSize, tokenSize);

            if (this.theorySlots[i][progress][0].revealed) {
              if (this.store.getters.skySectors.indexOf(i) >= 0) {
                ctx.fillStyle = skyColor;
              } else {
                ctx.fillStyle = baseColor;
              }
              ctx.fillRect(-tokenSize*0.75/2, -radius-tokenSize*0.25/2-tokenSize*0.75, tokenSize*0.75, tokenSize*0.75);

              ctx.drawImage(this.objectImages[this.store.state.game.board.objects[i].initial], -tokenSize*0.75/2, -radius-tokenSize*0.25/2-tokenSize*0.75, tokenSize*0.75, tokenSize*0.75);
            }
          } else {
            if (progress === 0) {
              ctx.beginPath();
              ctx.moveTo(0, -radius-tokenSize*0.25);
              ctx.lineTo(0, -radius-tokenSize*0.75);
              ctx.moveTo(-tokenSize*0.25, -radius-tokenSize*0.5);
              ctx.lineTo(tokenSize*0.25, -radius-tokenSize*0.5);
              ctx.stroke();
            } else if (progress === 3) {
              ctx.beginPath();
              ctx.arc(0, -radius-tokenSize*0.5, tokenSize*0.25, -5*Math.PI/6, 5*Math.PI/6);
              ctx.stroke();

              ctx.save();

              const x = Math.cos(Math.PI/6) * tokenSize * 0.25;
              const y = Math.sin(Math.PI/6) * tokenSize * 0.25;
              ctx.translate(-x, -radius-tokenSize*0.5-y);

              const arrowLength = tokenSize * 0.2;

              ctx.beginPath();
              ctx.moveTo(0, ctx.lineWidth/2);
              ctx.lineTo(0, -arrowLength);
              ctx.moveTo(-ctx.lineWidth/2, 0);
              ctx.lineTo(arrowLength, 0);
              ctx.stroke();

              ctx.restore();
            }
          }

          ctx.restore();
        }
      }

      ctx.beginPath();
      ctx.fillStyle = skyColor;
      ctx.arc(0, 0, sunRadius, 0, 2*Math.PI);
      ctx.fill();

      const pegRadius = 100;
      const paddingFactor = 0.2;

      const pegLocs = this.pegLocations(outerRadius, pegRadius, paddingFactor, this.store.state.session.players.length, trackSpace);

      for (const [sectorStr, players] of Object.entries(this.playerSectors)) {
        const sector: number = parseInt(sectorStr);
        for (let i = 0; i < players.length; i++) {
          if (players[i] !== null && pegLocs[i] !== undefined) {
            const { angle, radius, size } = pegLocs[i];
            const myAngle = sector * sectorAngle + angle;
            const x = radius * Math.cos(myAngle);
            const y = radius * Math.sin(myAngle);

            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2*Math.PI);
            ctx.fillStyle = this.playerColor(players[i]);
            ctx.fill();
          }
        }
      }

      const theoryInterval = this.store.state.gameType.theoryPhaseInterval;
      for (let i = theoryInterval - 1; i < this.store.state.gameType.sectors; i += theoryInterval) {
        const angle = sectorAngle/2 + i * sectorAngle;

        ctx.save();

        ctx.rotate(Math.PI/2 + (angle));
        ctx.drawImage(this.theoryImage, -iconSize/2, -theoryRadius-iconSize, iconSize, iconSize);

        ctx.restore();
      }

      for (let i = 0; i < this.store.state.gameType.conferences.length; i++) {
        const sector = this.store.state.gameType.conferences[i];
        const angle = sectorAngle/2 + sector * sectorAngle;

        let radius = theoryRadius;

        if (sector % theoryInterval === theoryInterval-1) {
          radius = conferenceRadius;
        }

        radius += iconSize/2;

        ctx.save();

        ctx.font = (iconSize*0.7) + "px Roboto Slab";
        ctx.rotate(Math.PI/2 + (angle));
        ctx.textAlign = "center";
        ctx.fillStyle = this.getCSSVariable("--ion-color-light-contrast");
        ctx.textBaseline = "middle";
        ctx.fillText(GOAL_OBJECT.initial + String.fromCharCode(i+8321), 0, -radius);

        ctx.restore();
      }
    },
    loadSVGWithColor: async function(path: string, color: string) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", path, true);

      const imageData: string = await new Promise((resolve, reject) => {
        xhr.onload = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              let theoryFile = xhr.responseText;
              theoryFile = theoryFile.replaceAll("currentColor", color);
              resolve(theoryFile);
            } else {
              reject(xhr.statusText);
            }
          }
        };

        xhr.send(null);
      });

      const img = new Image();
      img.src = "data:image/svg+xml;base64,"+btoa(imageData);

      await new Promise((resolve, reject) => {
        img.onload = function() {
          resolve();
        }
        img.onerror = function(e) {
          reject(e);
        }
      });

      return img;
    },
    collectImages: async function() {
      this.theoryImage = await this.loadSVGWithColor("/assets/theory.svg", this.getCSSVariable("--ion-color-light-contrast"));

      const imagePromises = this.store.state.gameType.logicSheetOrder.map((initial: string) => {
        const object = initialToSpaceObject[initial];
        return this.loadSVGWithColor(object.icon, this.getCSSVariable("--ion-color-light-contrast"));
      });

      const imagesArray = await Promise.all(imagePromises);
      const imagesMap: {[initial: string]: any} = {};
      for (let i = 0; i < this.store.state.gameType.logicSheetOrder.length; i++) {
        const objectInitial: string = this.store.state.gameType.logicSheetOrder[i];

        imagesMap[objectInitial] = imagesArray[i];
      }

      this.objectImages = imagesMap;
    }
  },
  watch: {
    session: function() {
      if (this.store.state.isSession) {
        this.computeCanvas();
      }
    },
    seasonView: function() {
      if (this.store.state.isSession) {
        this.computeCanvas();
      }
    },
    gameType: function() {
      this.collectImages();
    },
    isDarkMode: async function() {
      if (this.store.state.isSession) {
        await this.collectImages();
        this.computeCanvas();
      }
    }
  },
  async mounted() {
    if (this.matchMedia.md && !this.matchMedia.lg && this.store.state.startingFacts === undefined) {
      const menu = await menuController.get("menu");
      await menu.open(false);
    }
    await this.collectImages();
    this.computeCanvas();
  }
});
</script>

<style scoped>
#container {
  --container-padding: 10px;
}

#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
}

#title_container h3 {
  margin-top: 10px;
  margin-bottom: 10px;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

#canvas-container {
  width: 100%;
}

#boardCanvas {
  padding-left: 0;
  padding-right: 0;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100%;
  height: 100%;
  max-width: 50vh;
  max-height: 50vh;
}

#scores_container table {
  margin-left: auto;
  margin-right: auto;
}

#current_scores {
  text-align: center;
}
</style>
