import { useStore } from "vuex";
import { initialToSpaceObject } from "@/constants.ts";
import { defineComponent } from 'vue';

export default defineComponent({
  data: function() {
    const recentActions: Array<any> = [];
    return {
      recentActions,
      store: useStore()
    }
  },
  computed: {
    fullHistory: function(): Array<any> {
      if (!this.store.state.isSession) {
        return this.store.state.history;
      } else {
        return this.store.getters.fullHistory;
      }
    },
    kickedPlayers: function(): Array<any> {
      if (!this.store.state.isSession) {
        return [];
      } else {
        return this.store.state.session.kickedPlayers;
      }
    }
  },
  methods: {
    addMessages(messages: Array<{ message: string}>) {
      for (let i = 0; i < messages.length; i++) {
        setTimeout(() => {
          this.recentActions.push(messages[i]);
        }, i * 1500);
        setTimeout(() => {
          const j = this.recentActions.indexOf(messages[i]);
          this.recentActions.splice(j, 1);
        }, i * 1500 + 4000);
      }
    }
  },
  watch: {
    fullHistory(newHistory: Array<any>, oldHistory: Array<any>) {
      if (!this.store.state.isSession) {
        return;
      }
      let recentHistory = newHistory.slice(oldHistory.length);
      recentHistory = recentHistory.filter((action: any) => {
        return action.playerID === undefined || action.playerID !== this.store.state.playerID;
      });
      recentHistory = recentHistory.filter((action: any) => {
        return action.actionType !== "THEORY_REVEAL" && action.actionType !== "CONFERENCE";
      });
      recentHistory = recentHistory.map((action: any) => {
        let message;
        if (action.actionType === "SURVEY") {
          message = action.playerName + " surveyed for " + initialToSpaceObject[action.spaceObject.initial].plural + " in sectors " + action.sectors.map((s: number) => s+1).join("-");
        } else if (action.actionType === "TARGET") {
          message = action.playerName + " targeted sector " + (action.sector + 1);
        } else if (action.actionType === "RESEARCH") {
          message = action.playerName + " researched " + this.store.state.game.research[action.index].categoryName;
        } else if (action.actionType === "LOCATE_PLANET_X") {
          if (action.successful) {
            message = action.playerName + " found Planet X";
          } else {
            message = action.playerName + " did not find Planet X";
          }
        } else if (action.actionType === "THEORY") {
          message = action.playerName + " submitted theories";
        } else if (action.actionType === "WINNER") {
          message = action.text;
        }
        return { message };
      });

      this.addMessages(recentHistory);
    },
    kickedPlayers(newKicked: Array<any>, oldKicked: Array<any>) {
      if (!this.store.state.session) {
        return;
      }

      let recentlyKicked = newKicked.slice(oldKicked.length);
      recentlyKicked = recentlyKicked.map((player: any) => {
        return {
          message: player.name + " was kicked from the game"
        }
      });

      this.addMessages(recentlyKicked);
    }
  }
});
