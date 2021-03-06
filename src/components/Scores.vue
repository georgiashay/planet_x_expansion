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
       :style="playerStyle(players[index].color)">
      <td
        :class="players[index].id == store.state.playerID ? [] : store.getters.kickedPlayerState(players[index].id) ? ['kick_cell', 'kicked'] : ['kick_cell', 'unkicked']"
        @click="kickPlayer(index)"
        v-if="anyKickAllowed">
        <ion-icon src="/assets/kick.svg" v-if="kickAllowed(players[index].id)"/>
      </td>
      <td class = "hourglass_cell" v-if="showHourglassColumn">
        <ion-icon v-if="store.state.session.actions.find((action) => action.playerID === players[index].id)" :src="hourglassOutline"></ion-icon>
      </td>
      <td class="disconnected_cell" v-if="showDisconnectedColumn">
        <ion-icon v-if="!players[index].connected" :src="cloudOfflineOutline"></ion-icon>
      </td>
      <td class="player_cell">
        P{{players[index].num}}: {{players[index].name}}
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
      // [key to scores object, url to icon]
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
      // Number of points for each object
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
      // Grid of different point values for each player
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
    players: function(): Array<any> {
      return this.store.state.session.scores.map((score: any) => {
        return this.store.getters.playerMap[score.playerID];
      });
    },
    anyKickAllowed: function(): boolean {
      return this.players.some((row) => this.kickAllowed(row.id));
    },
    showHourglassColumn: function(): boolean {
      return this.players.length > 1 && this.store.state.session.actions.length > 0;
    },
    showDisconnectedColumn: function(): boolean {
      return this.players.some((row) => !row.connected);
    }
  },
  methods: {
    kickAllowed: function(playerID: any): boolean {
      if (playerID === this.store.state.playerID) {
        // Can't kick yoursel
        return false;
      } else if (this.store.state.session.currentAction.actionType === "LAST_ACTION") {
        // If on last action, can only kick players who haven't completed it
        return this.store.state.session.actions.some((action: any) => action.playerID === playerID);
      } else if (this.store.state.session.currentAction.actionType === "END_GAME") {
        // Can't kick players after the game is over
        return false;
      } else {
        return true;
      }
    },
    kickPlayer: async function(index: number) {
      const player = this.players[index];

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
