<template>
  <table id="score_table">
    <tr>
      <th>Player</th>
      <th
        v-for="(header, index) in scoreHeaders"
        :key="index"
        >
        <ion-icon :src="header[1]"/>
        <sub>({{points[index]}})</sub>
      </th>
      <th>
        Total
      </th>
    </tr>
    <!-- <tr id="points_row">
      <td>Points</td>
      <td
        v-for="(points, index) in pointsRow"
        :key="index"
        >
        {{points}}
      </td>
      <td></td>
    </tr> -->
    <tr
      v-for="(row, index) in scoreTable"
      :key="index"
       :style="players[index][1]">
      <td class="player_cell">
        {{players[index][0]}}
      </td>
      <td
        v-for="(value, j) in row"
        :key="j">
        {{ value }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import PlayerColors from "@/mixins/PlayerColors.ts";
import { initialToSpaceObject, SpaceObject } from "@/constants.ts";

export default defineComponent({
  name: 'Scores',
  components: {
    IonIcon
  },
  mixins: [PlayerColors],
  data() {
    const store = useStore();
    return {
      store
    }
  },
  computed: {
    scoreHeaders: function(): Array<Array<string>> {
      const headers = [["first", "/assets/first.svg"]];
      for (const obj in this.store.state.gameType.numObjects) {
        if (obj !== "X" && obj !== "E") {
          const key = obj;
          const icon = initialToSpaceObject[obj].icon;
          headers.push([key, icon]);
        }
      }
      headers.push(["planetX", SpaceObject.PLANET_X.icon]);
      return headers;
    },
    points: function(): Array<number | string> {
      const points = [];
      for (const [key] of this.scoreHeaders) {
        if (key === "first") {
          points.push(1);
        } else if(key === "planetX") {
          points.push("2-8");
        } else if (key in this.store.state.gameType.points) {
          points.push(this.store.state.gameType.points[key]);
        } else {
          points.push("");
        }
      }
      return points;
    },
    scoreTable: function(): Array<Array<string | number>> {
      const table = [];
      for (const score of this.store.state.session.scores) {
        const row = [];
        for (const [key] of this.scoreHeaders) {
          if (key === "first" || key === "planetX") {
            row.push(score[key]);
          } else {
            row.push(score.objects[key]);
          }
        }
        row.push(score.total);
        table.push(row);
      }
      return table;
    },
    players: function(): Array<Array<any>> {
      return this.store.state.session.scores.map((score: any) => {
        const player = this.store.getters.playerMap[score.playerID];
        return ["P" + player.num + ": " + player.name, this.playerStyle(player.num)];
      });
    }
  }
});
</script>

<style scoped>
#score_table {
  width: 100%;
  max-width: 50vh;
  background-color: var(--ion-color-light);
  color: var(--ion-color-light-contrast);
  border: 2px solid white;
}

#score_table td {
  border: 2px solid var(--ion-color-light-contrast);
  outline: 3px solid var(--player-color);
  outline-offset: -4px;
  padding: 3px;
  text-align: center;
  font-size: 1em;
  color: var(--ion-color-light-contrast);
}

#score_table th {
  border: 2px solid var(--ion-color-light-contrast);
  padding: 3px;
  font-size: 1em;
}

#score_table th sub {
  font-size: 0.5em;
}

#score_table th ion-icon {
  font-size: 1.2em;
  --color: var(--ion-color-light-contrast);
}

.player_cell {
  border-color: var(--player-color);
  color: white;
}
</style>
