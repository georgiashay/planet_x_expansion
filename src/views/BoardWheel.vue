<template>
  <ion-page>
    <session-header v-if="store.state.isSession"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.gameReady && store.state.isSession">
        <div id="title_container">
          <h3>Current Board</h3>
        </div>
        <canvas id="boardCanvas" height="3000" width="3000"/>
        <h4>Current Scores</h4>
        <scores/>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/session/gamemenu'">Return to Game Menu</ion-nav-link>
        </div>
      </div>
    </ion-content>
    <game-footer/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import PlayerColors from "@/mixins/PlayerColors.ts";
import Scores from "@/components/Scores.vue";
import { initialToSpaceObject } from "@/constants.ts";

export default defineComponent({
  name: 'BoardWheel',
  components: {
    IonContent,
    IonPage,
    IonNavLink,
    GameFooter,
    SessionHeader,
    Scores
  },
  mixins: [PlayerColors],
  data() {
    const store = useStore();
    return {
      store
    }
  },
  computed: {
    session: function(): any {
      return this.store.state.session;
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
        sectorMap[sector][players[i].arrival-1] = players[i].num;
      }
      return sectorMap;
    },
    theorySlots: function(): Array<Array<Array<any>>> {
      const sectors = Array.from(Array(this.store.state.gameType.sectors)).map(() => Array.from(Array(4)).map(() => []));
      for (let i = 0; i < this.store.getters.visibleTheories.length; i++) {
        const theory = this.store.getters.visibleTheories[i];
        sectors[theory.sector][theory.boardProgress].push(theory);
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
      // pegLoc = boardRadius - pegRadius - 2 * pegRadius * paddingFactor
      const tanAngle = Math.tan(rawPegAngle/2);
      const pegRadius = (tanAngle * boardRadius)/(1 + tanAngle + 2 * tanAngle * paddingFactor);

      return {
        radius: pegRadius,
        pegAngle: rawPegAngle
      }
    },
    pegSizeTwoRows: function(boardRadius: number, paddingFactor: number, numPegs: number) {
      const innerPegs = Math.floor(numPegs/2);
      const outerPegs = Math.ceil(numPegs/2);

      let rawPegAngle;
      if (numPegs % 2 === 1) {
        rawPegAngle = this.sectorAngle/(outerPegs * (1 + paddingFactor) + paddingFactor);
      } else {
        rawPegAngle = this.sectorAngle/(outerPegs * (1 + paddingFactor) + 1/2 + 3*paddingFactor/2)
      }

      // Solving system
      // pegRadius = Math.tan(rawPegRangle/2) * pegLoc
      // pegLoc = boardRadius - 3 * pegRadius - (2 + Math.sqrt(2)) * pegRadius * paddingFactor
      const tanAngle = Math.tan(rawPegAngle/2);
      const pegRadius = (tanAngle * boardRadius)/(1 + 3 * tanAngle + (2 + Math.sqrt(2)) * tanAngle * paddingFactor);

      return {
        radius: pegRadius,
        pegAngle: rawPegAngle
      };
    },
    pegLocations: function(boardRadius: number, pegRadius: number, paddingFactor: number, numPlayers: number, space: number) {
      const sectorAngle = 2 * Math.PI/this.store.state.gameType.sectors;
      let pegPadding = 2 * pegRadius * paddingFactor;
      let outerPegLoc = boardRadius - pegPadding - pegRadius;
      const outerPaddingAngle = 2 * Math.atan2(pegPadding/4, boardRadius - pegPadding - pegRadius);
      const pegAngle = 2 * Math.atan2((2*pegRadius + pegPadding)/2, outerPegLoc);

      const maxPegsAtSize = Math.floor((sectorAngle - 2 * outerPaddingAngle)/pegAngle);
      const pegsOnRow = Math.max(maxPegsAtSize, 4);

      const pegRowInfo = this.pegSize(boardRadius, paddingFactor, pegsOnRow);

      if (numPlayers <= pegsOnRow) {
        pegRadius = pegRowInfo.radius;
        pegRadius = Math.min(pegRadius, space/(2 + 4*paddingFactor));

        pegPadding = 2 * pegRadius * paddingFactor;
        outerPegLoc = boardRadius - pegRadius - pegPadding;

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
        outerPegLoc = boardRadius - pegRadius - pegPadding;

        const innerPegLoc = boardRadius - 3 * pegRadius - (1 + Math.sqrt(2)/2) * pegPadding;

        const locations = [];

        for (let i = 0; i < numPlayers; i++) {
          const radius = (i % 2 === 0) ? outerPegLoc : innerPegLoc;
          locations.push({
            angle: offset + i * intervalAngle,
            radius,
            size: pegRadius
          });
        }

        return locations;
      }
    },
    pegLocationsOld: function(boardRadius: number, pegRadius: number, pegPadding: number, numPlayers: number): any {
      const sectorAngle = 2 * Math.PI/this.store.state.gameType.sectors;

      const topPaddingAngle = 2*Math.atan2(pegPadding/2, boardRadius - pegPadding - pegRadius);
      const divAngle = (sectorAngle - 2 * topPaddingAngle)/(numPlayers + 1);

      const angle = (sectorAngle - 2 * topPaddingAngle)/numPlayers;
      const offset = topPaddingAngle + angle/2;

      let rows = 1;
      let foundRows = false;
      const locations = Array.from(Array(numPlayers));

      while (!foundRows) {
        let totalPegs = 0;
        const pegNums = [];
        let pegLoc = boardRadius - pegPadding - pegRadius;

        for (let r = 0; r < rows; r++) {
          const paddingAngle = 4*Math.atan2(pegPadding/4, pegLoc);
          const extra = (numPlayers % rows) > (rows - 1 - r);
          const rowAngle = divAngle * ((rows-1)+ +extra);
          const angleLeft = sectorAngle - paddingAngle - rowAngle;

          const pegAngle = 2*Math.atan2((2*pegRadius + pegPadding)/2, pegLoc);
          const numPegs = Math.floor(angleLeft/pegAngle);

          pegNums.push(numPegs);
          totalPegs += numPegs;
          pegLoc -= (2*pegRadius + pegPadding);
        }

        if (totalPegs >= numPlayers || pegNums[pegNums.length-1] === 0) {
          foundRows = true;
          let newPegNums;

          if (pegNums[pegNums.length-1] === 0) {
            newPegNums = pegNums;
          } else {
            newPegNums = Array.from(Array(rows)).map(() => 0);
            console.log("initial", newPegNums)
            let pn = rows - 1;
            while(newPegNums.reduce((a: number, b: number) => a + b, 0) < numPlayers) {
              const pegs = pegNums[pn];
              for (let j = 0; j < rows; j++) {
                if (pegNums[j] >= pegs) {
                  newPegNums[j] = pegs;
                }
              }
              pn--;
            }

            console.log("evening", newPegNums);

            let totalPegs = newPegNums.reduce((a: number, b: number) => a + b, 0);

            console.log("extra pegs", totalPegs - numPlayers);

            while (totalPegs > numPlayers) {
              for (let i = rows - 1; i >= 0; i--) {
                newPegNums[i]--;
                totalPegs--;
              }
            }
            // for (let i = rows - 1; i >= rows - extraPegs; i--) {
            //   newPegNums[i]--;
            // }

            console.log("remove extra", newPegNums);
          }

          const indices = newPegNums.map(() => []);
          const pegsCopy = newPegNums.slice();
          let idx = 0;
          let r = 0;
          while (idx < newPegNums.reduce((a: number, b: number) => a + b, 0)) {
            if (r > pegsCopy.length) {
              r = 0;
            }
            if (pegsCopy[r] > 0) {
              pegsCopy[r]--;
              indices[r].push(idx);
              idx++;
              r++;
            } else {
              r = 0;
            }
          }

          for (let r = 0; r < rows; r++) {
            for (let p = 0; p < newPegNums[r]; p++) {
              const i = indices[r][p];
              locations[i] = {
                angle: offset + angle * i,
                radius: boardRadius - pegPadding - pegRadius - r * (2*pegRadius + pegPadding)
              };
            }
          }
        } else {
          rows++;
        }
      }

      return locations;
    },
    computeCanvas: async function() {
      const canvas = document.getElementById("boardCanvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      ctx.resetTransform();
      ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(this.store.state.seasonView.angle);

      ctx.lineWidth = 4;

      const sectorAngle = 2 * Math.PI/this.store.state.gameType.sectors;
      const skyAngle = sectorAngle * this.store.state.session.currentSector;

      const boardRadius = 1400;
      const outerRadius = 1500;
      const textRadius = (boardRadius + outerRadius)/2;
      const textHeight = 100;

      const iconSize = 80;
      const theoryRadius = 300;
      const conferenceRadius = theoryRadius + iconSize;

      const startTokenRadius = conferenceRadius + 175;
      const maxTokenWidth = Math.floor(2 * Math.tan(sectorAngle/2) * startTokenRadius);
      const maxTokenHeight = Math.floor((boardRadius - startTokenRadius)/4);
      const tokenSize = Math.min(125, 0.8*maxTokenWidth, 0.75*maxTokenHeight);
      const tokenEdgePadding = 250;
      const tokenIncrement = (boardRadius - startTokenRadius - tokenSize - tokenEdgePadding)/3;

      ctx.beginPath();
      ctx.fillStyle = "#222428";
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = "#575757";
      ctx.arc(0, 0, boardRadius, skyAngle, skyAngle + Math.PI);
      ctx.fill();

      for (let i = 0; i < this.store.state.gameType.sectors; i++) {
        // Sector line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const x = outerRadius * Math.cos(i * sectorAngle);
        const y = outerRadius * Math.sin(i * sectorAngle);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "white";
        ctx.stroke();

        // Sector number label
        ctx.save();

        ctx.font = textHeight + "px serif";
        ctx.rotate(Math.PI/2 + (sectorAngle/2 + i * sectorAngle));

        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.fillText("" + (i+1), 0, -(textRadius-textHeight*0.08));

        ctx.restore();

        // Theory token slots
        for (let j = 0; j < 4; j++) {
          const progress = 3 - j;
          const radius = startTokenRadius + j * tokenIncrement;
          ctx.save();

          ctx.rotate(-Math.PI/2 + (sectorAngle/2 + i * sectorAngle));

          ctx.beginPath();
          ctx.strokeStyle = "white";
          ctx.rect(-tokenSize/2, radius, tokenSize, tokenSize);
          ctx.stroke();

          if (this.theorySlots[i][progress].length > 0) {
            const gradient = ctx.createLinearGradient(-tokenSize/2, radius, tokenSize/2, radius+tokenSize);
            const part = 1/(this.theorySlots[i][progress].length);
            for (let k = 0; k < this.theorySlots[i][progress].length; k++) {
              const theory = this.theorySlots[i][progress][k];
              const playerNum = this.store.getters.playerMap[theory.playerID].num;
              const color = this.playerColor(playerNum);

              gradient.addColorStop(k*part, color);
              gradient.addColorStop((k+1)*part, color);
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(-tokenSize/2, radius, tokenSize, tokenSize);

            if (progress === 3) {
              ctx.fillStyle = "black";
              ctx.fillRect(-tokenSize*0.75/2, radius+tokenSize*0.25/2, tokenSize*0.75, tokenSize*0.75);

              const img = new Image();
              img.src = initialToSpaceObject[this.store.state.game.board.objects[i].initial].icon;

              await new Promise((resolve, reject) => {
                img.onload = function() {
                  ctx.drawImage(img, -tokenSize*0.75/2, radius+tokenSize*0.25/2, tokenSize*0.75, tokenSize*0.75);
                  resolve();
                }
              });
            }
          } else {
            if (progress === 0) {
              ctx.beginPath();
              ctx.moveTo(0, radius+tokenSize*0.25);
              ctx.lineTo(0, radius+tokenSize*0.75);
              ctx.moveTo(-tokenSize*0.25, radius+tokenSize*0.5);
              ctx.lineTo(tokenSize*0.25, radius+tokenSize*0.5);
              ctx.stroke();
            } else if (progress === 3) {
              ctx.beginPath();
              ctx.arc(0, radius+tokenSize*0.5, tokenSize*0.25, Math.PI/6, 11*Math.PI/6);
              ctx.stroke();

              ctx.save();

              const x = Math.cos(Math.PI/6) * tokenSize * 0.25;
              const y = Math.sin(Math.PI/6) * tokenSize * 0.25;
              ctx.translate(x, radius+tokenSize*0.5+y);

              const arrowLength = tokenSize * 0.2;

              ctx.beginPath();
              ctx.moveTo(0,0);
              ctx.lineTo(0, arrowLength);
              ctx.moveTo(0, 0);
              ctx.lineTo(-arrowLength, 0);
              ctx.stroke();

              ctx.restore();
            }
          }

          ctx.restore();
        }
      }

      const pegRadius = 100;
      const paddingFactor = 0.2;

      const pegLocs = this.pegLocations(boardRadius, pegRadius, paddingFactor, this.store.state.session.players.length, tokenEdgePadding);

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

        ctx.font = "60px serif";
        ctx.rotate(Math.PI/2 + (angle));

        const img = new Image();
        img.src = "/assets/theory.svg";

        await new Promise((resolve, reject) => {
          img.onload = function() {
            ctx.drawImage(img, -iconSize/2, -theoryRadius-iconSize, iconSize, iconSize);
            resolve();
          }
        });

        ctx.restore();
      }

      for (let i = 0; i < this.store.state.gameType.conferences.length; i++) {
        const sector = this.store.state.gameType.conferences[i];
        const angle = sectorAngle/2 + sector * sectorAngle;

        let radius = theoryRadius;

        if (sector % theoryInterval === theoryInterval-1) {
          radius = conferenceRadius;
        }

        ctx.save();

        ctx.font = "60px serif";
        ctx.rotate(Math.PI/2 + (angle));
        ctx.textAlign = "center";
        ctx.fillStyle = "yellow";
        ctx.textBaseline = "bottom";
        ctx.fillText("X" + String.fromCharCode(i+8321), 0, -radius);

        ctx.restore();
      }
    }
  },
  watch: {
    session: function() {
      this.computeCanvas();
    }
  },
  mounted() {
    this.computeCanvas();
  }
});
</script>

<style scoped>
#container {
  padding: 20px;
}

#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
  margin-top: 5%;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
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
}
</style>
