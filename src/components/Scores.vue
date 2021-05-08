<template>
  <div>
    <table id="score_table">
      <tr>
        <th>Player</th>
        <th
          v-for="(header, index) in scoreHeaders"
          :key="index"
          >
          <ion-icon :src="header[1]"/>
        </th>
        <th>
          Total
        </th>
      </tr>
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
  </div>
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
    scoreHeaders: function(): Array<[string, string]> {
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
    scoreTable: function(): Array<Array<string | num>> {
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
    players: function(): Array<[string, any]> {
      return this.store.state.session.scores.map((score) => {
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
  background-color: var(--ion-color-dark);
  border: 2px solid white;
}

#score_table td {
  border: 2px solid white;
  outline: 3px solid var(--player-color);
  outline-offset: -4px;
  padding: 3px;
  text-align: center;
  font-size: 3vw;
}

#score_table th {
  border: 2px solid white;
  padding: 3px;
  font-size: 3vw;
}

#score_table th ion-icon {
  font-size: 5vw;
}

#score_table table td {
  border: none;
}

.player_cell {
  border-color: var(--player-color);
  color: white;
}
</style>
