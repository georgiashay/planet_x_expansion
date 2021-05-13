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
        return action.actionType !== "THEORY_REVEAL";
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
      for (let i = 0; i < recentHistory.length; i++) {
        setTimeout(() => {
          this.recentActions.push(recentHistory[i]);
        }, i * 1500);
        setTimeout(() => {
          const j = this.recentActions.indexOf(recentHistory[i]);
          this.recentActions.splice(j, 1);
        }, i * 1500 + 4000);
      }
    }
  }
});
