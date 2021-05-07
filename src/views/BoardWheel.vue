<template>
  <ion-page>
    <session-header v-if="store.state.isSession"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.gameReady && store.state.isSession">
        <div id="title_container">
          <h3>Current Board</h3>
        </div>
        <canvas id="boardCanvas" height="3000" width="3000"/>
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

export default defineComponent({
  name: 'BoardWheel',
  components: {
    IonContent,
    IonPage,
    IonNavLink,
    GameFooter,
    SessionHeader
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
    }
  },
  methods: {
    pegLocations: function(boardRadius: number, pegRadius: number, pegPadding: number, numPlayers: number): any {
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

            const extraPegs = newPegNums.reduce((a: number, b: number) => a + b, 0) - numPlayers;

            for (let i = rows - 1; i >= rows - extraPegs; i--) {
              newPegNums[i]--;
            }
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
    computeCanvas: function() {
      const canvas = document.getElementById("boardCanvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

      ctx.lineWidth = 4;

      const boardRadius = 1400;
      const outerRadius = 1500;
      const textRadius = (boardRadius + outerRadius)/2;
      const textHeight = 100;

      const iconSize = 100;
      const theoryRadius = 700;
      const conferenceRadius = 800;

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

      const sectorAngle = 2 * Math.PI/this.store.state.gameType.sectors;

      const skyAngle = sectorAngle * this.store.state.session.currentSector;

      ctx.beginPath();
      ctx.fillStyle = "#575757";
      ctx.arc(0, 0, boardRadius, skyAngle, skyAngle + Math.PI);
      ctx.fill();

      for (let i = 0; i < this.store.state.gameType.sectors; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const x = outerRadius * Math.cos(i * sectorAngle);
        const y = outerRadius * Math.sin(i * sectorAngle);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.save();

        ctx.font = textHeight + "px serif";
        ctx.rotate(Math.PI/2 + (sectorAngle/2 + i * sectorAngle));
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.fillText("" + (i+1), 0, -(textRadius));

        ctx.restore();
      }

      const maxPegRadius = Math.floor(Math.tan(sectorAngle/5)*(boardRadius-60)/2);
      const pegRadius = Math.min(50, maxPegRadius);
      const pegPadding = Math.floor(pegRadius/4);

      const pegLocs = this.pegLocations(boardRadius, pegRadius, pegPadding, this.store.state.session.players.length);

      for (const [sectorStr, players] of Object.entries(this.playerSectors)) {
        const sector: number = parseInt(sectorStr);
        for (let i = 0; i < players.length; i++) {
          if (players[i] !== null && pegLocs[i] !== undefined) {
            const { angle, radius } = pegLocs[i];
            const myAngle = sector * sectorAngle + angle;
            const x = radius * Math.cos(myAngle);
            const y = radius * Math.sin(myAngle);

            ctx.beginPath();
            ctx.arc(x, y, pegRadius, 0, 2*Math.PI);
            ctx.fillStyle = this.playerColor(players[i]);
            ctx.fill();
          }
        }
      }

      const theoryInterval = this.store.state.gameType.theoryPhaseInterval;
      for (let i = theoryInterval - 1; i < this.store.state.gameType.sectors; i += theoryInterval) {
        const angle = sectorAngle/2 + i * sectorAngle;

        ctx.save();

        ctx.font = "75px serif";
        ctx.rotate(Math.PI/2 + (angle));
        ctx.textAlign = "center";
        ctx.fillStyle = "cyan";
        ctx.textBaseline = "middle";
        ctx.fillText("T", 0, -(theoryRadius));

        ctx.beginPath();
        ctx.strokeStyle = "cyan";
        ctx.rect(-40, -theoryRadius-50, 80, 100);
        ctx.stroke();

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

        ctx.font = "75px serif";
        ctx.rotate(Math.PI/2 + (angle));
        ctx.textAlign = "center";
        ctx.fillStyle = "yellow";
        ctx.textBaseline = "middle";
        ctx.fillText("C", 0, -radius);

        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.rect(-40, -radius-50, 80, 100);
        ctx.stroke();

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
    const canvas = document.getElementById("boardCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width/2, canvas.height/2);
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
  margin-top: 25%;
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
