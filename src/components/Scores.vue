<template>
  <table id="score_table">
    <tr>
      <th class="empty_header" :colspan="anyKickAllowed + showHourglassColumn + showDisconnectedColumn" v-if="anyKickAllowed || showHourglassColumn || showDisconnectedColumn"/>
      <th class="player_header">Player</th>
      <th
        v-for="(header, index) in scoreHeaders"
        :key="index"
        class="score_icon_header"
        >
        <ion-icon :src="header[1]"/><sub>({{points[index]}})</sub>
      </th>
      <th class="total_header">
        Total
      </th>
    </tr>
    <tr
      v-for="(row, index) in scoreTable"
      :key="index"
       :style="players[index][1]">
      <td
        :class="players[index][2].id == store.state.playerID ? [] : store.getters.kickedPlayerState(players[index][2].id) ? ['kick_cell', 'kicked'] : ['kick_cell', 'unkicked']"
        @click="kickPlayer(index)"
        v-if="anyKickAllowed">
        <ion-icon src="/assets/kick.svg" v-if="kickAllowed(players[index][2].id)"/>
      </td>
      <td class = "hourglass_cell" v-if="showHourglassColumn">
        <ion-icon v-if="store.state.session.actions.find((action) => action.playerID === players[index][2].id)" :src="hourglassOutline"></ion-icon>
      </td>
      <td class="disconnected_cell" v-if="showDisconnectedColumn">
        <ion-icon v-if="!players[index][2].connected" :src="cloudOfflineOutline"></ion-icon>
      </td>
      <td class="player_cell">
        {{players[index][0]}}
      </td>
      <td
        v-for="(value, j) in row"
        :key="j"
        class="player_points_cell">
        {{ value }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { IonIcon, alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import PlayerColors from "@/mixins/PlayerColors.ts";
import { initialToSectorElement, GOAL_OBJECT, EMPTY_OBJECT } from "@/constants.ts";
import { cloudOfflineOutline, hourglassOutline } from "ionicons/icons";

export default defineComponent({
  name: 'Scores',
  components: {
    IonIcon
  },
  mixins: [PlayerColors],
  data() {
    const store = useStore();
    return {
      store,
      cloudOfflineOutline,
      hourglassOutline
    }
  },
  computed: {
    scoreHeaders: function(): Array<Array<string>> {
      const headers = [["first", "/assets/first.svg"]];
      for (const obj of this.store.state.gameType.pointsOrder) {
        if (obj !== GOAL_OBJECT.initial && obj !== EMPTY_OBJECT.initial) {
          const key = obj;
          const icon = initialToSectorElement[obj].icon;
          headers.push([key, icon]);
        }
      }
      headers.push([GOAL_OBJECT.initial, GOAL_OBJECT.icon]);
      return headers;
    },
    points: function(): Array<number | string> {
      const points = [];
      for (const [key] of this.scoreHeaders) {
        if (key === "first") {
          points.push(1);
        } else if(key === GOAL_OBJECT.initial) {
          points.push("2-10");
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
          if (key === "first" || key === GOAL_OBJECT.initial) {
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
        return ["P" + player.num + ": " + player.name, this.playerStyle(player.color), player];
      });
    },
    anyKickAllowed: function(): boolean {
      return this.players.some((row) => this.kickAllowed(row[2].id));
    },
    showHourglassColumn: function(): boolean {
      return this.players.length > 1 && this.store.state.session.actions.length > 0;
    },
    showDisconnectedColumn: function(): boolean {
      return this.players.some((row) => !row[2].connected);
    }
  },
  methods: {
    kickAllowed: function(playerID: any): boolean {
      if (playerID === this.store.state.playerID) {
        return false;
      } else if (this.store.state.session.currentAction.actionType === "LAST_ACTION") {
        return this.store.state.session.actions.some((action: any) => action.playerID === playerID);
      } else if (this.store.state.session.currentAction.actionType === "END_GAME") {
        return false;
      } else {
        return true;
      }
    },
    kickPlayer: async function(index: number) {
      const player = this.players[index][2];

      if (!this.kickAllowed(player.id)) {
        return;
      }

      if (!this.store.state.session.kickVotes.some((kickVote: any) => kickVote.kickPlayerID === player.id)) {
        const alert = await alertController.create({
          cssClass: 'custom-alert',
          header: 'Kick ' + player.name,
          message: 'Are you sure you want start a vote to kick ' + player.name + '?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            }, {
              text: 'Yes',
              role: 'okay'
            }
          ]
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
        if (role === "okay") {
          this.store.dispatch("toggleKickPlayer", player.id);
        }
      } else {
        this.store.dispatch("toggleKickPlayer", player.id);
      }
    }
  }
});
</script>

<style scoped>
#score_table {
  width: 100%;
  max-width: 75vh;
  background-color: var(--ion-color-light);
  color: var(--ion-color-light-contrast);
  border: 2px solid var(--ion-color-light-contrast);
}

#score_table .player_cell, .player_points_cell {
  border: 2px solid var(--ion-color-light-contrast);
  outline: 3px solid var(--player-color);
  outline-offset: -4px;
  padding: 3px;
  text-align: center;
  font-size: 1em;
  color: var(--ion-color-light-contrast);
}

#score_table .kick_cell {
  padding: 3px;
  text-align: center;
}

#score_table .kick_cell.unkicked:hover {
  color: black;
  background-color: red;
}

#score_table .kick_cell.kicked {
  color: white;
  background-color: darkred;
}

#score_table .kick_cell.kicked:hover {
  color: white;
  background-color: green;
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

.score_icon_header {
  white-space: nowrap;
  overflow: hidden;
}
</style>
