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
      const sectorMap = {};
      const players = this.store.state.session.players.slice().sort((a: any, b: any) => a.arrival - b.arrival);
      for (let i = 0; i < players.length; i++) {
        const sector = players[i].sector;
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
    pegLocations: function(boardRadius, pegRadius, pegPadding, numPlayers): any {
      const sectorAngle = 2 * Math.PI/this.store.state.gameType.sectors;

      const topPaddingAngle = 2*Math.atan2(pegPadding/4, boardRadius - pegPadding - pegRadius);
      const angle = (sectorAngle - topPaddingAngle)/(numPlayers + 1);

      let rows = 1;
      let foundRows = false;
      const locations = [];

      while (!foundRows) {
        let totalPegs = 0;
        const pegNums = [];
        let pegLoc = boardRadius - pegPadding - pegRadius;

        for (let r = 0; r < rows; r++) {
          const paddingAngle = 4*Math.atan2(pegPadding/4, pegLoc);
          const extra = (numPlayers % rows) > (rows - 1 - r);
          const rowAngle = angle * ((rows-1)+extra);
          const angleLeft = sectorAngle - paddingAngle - rowAngle;

          const pegAngle = 2*Math.atan2((2*pegRadius + pegPadding)/2, pegLoc);
          const numPegs = Math.floor(angleLeft/pegAngle);

          pegNums.push(numPegs);
          totalPegs += numPegs;

          pegLoc -= (2*pegRadius + pegPadding);
        }

        if (totalPegs >= numPlayers) {
          foundRows = true;
          const extraPegs = totalPegs - numPlayers;
          const eachExtra = Math.ceil(extraPegs/rows);
          const newPegNums = pegNums.map((np: number, i: number) => np - eachExtra + (i < (extraPegs % rows)));

          for (let r = 0; r < rows; r++) {
            for (let p = 0; p < newPegNums[r]; p++) {
              const i = p * rows + r;
              locations.push({
                angle: topPaddingAngle + angle * (i+1),
                radius: boardRadius - pegPadding - pegRadius - r * (2*pegRadius + pegPadding)
              });
            }
          }
        } else {
          rows++;
        }
      }

      return locations;
    },
    computeCanvas: function() {
      this.pegLocations(1400, 50, 10, 8);
      const canvas = document.getElementById("boardCanvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

      ctx.lineWidth = 4;

      const boardRadius = 1400;

      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI);
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
        const x = boardRadius * Math.cos(i * sectorAngle);
        const y = boardRadius * Math.sin(i * sectorAngle);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "white";
        ctx.stroke();
      }

      const pegRadius = 50;
      const pegPadding = 10;
      const pegLocs = this.pegLocations(boardRadius, pegRadius, pegPadding, this.store.state.session.players.length);

      for (const [sector, players] of Object.entries(this.playerSectors)) {
        for (let i = 0; i < players.length; i++) {
          if (players[i] !== null) {
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
  background-color: var(--ion-color-dark);
  width: 100%;
  height: 100%;
}
</style>
