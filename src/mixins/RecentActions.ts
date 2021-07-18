import { useStore } from "vuex";
import { initialToSectorElement, GOAL_OBJECT, SECTOR_NAME } from "@/constants.ts";
import { defineComponent } from 'vue';

class SpacedMessageTimer {
  space: number;
  timeVisible: number;
  queue: Array<{ message: string }>;
  messages: Array<{ message: string }>;
  timeout: undefined | number;

  constructor(space: number, timeVisible: number, messages: Array<{ message: string }> =[]) {
    this.space = space;
    this.timeVisible = timeVisible;
    this.queue = [];
    this.messages = messages;
    this.timeout = undefined;
  }

  push(message: string) {
    const msg = { message };
    if (this.timeout === undefined) {
      this.messages.push(msg);
      setTimeout(() => {
        const i = this.messages.indexOf(msg);
        this.messages.splice(i, 1);
      }, this.timeVisible);
      this.timeout = setTimeout(() => {
        this.take();
      }, this.space);
    } else {
      this.queue.push(msg);
    }
  }

  take() {
    if (this.queue.length === 0) {
      this.timeout = undefined;
    } else {
      const [msg] = this.queue.splice(0, 1);
      this.messages.push(msg);
      setTimeout(() => {
        const i = this.messages.indexOf(msg);
        this.messages.splice(i, 1);
      }, this.timeVisible);
      this.timeout = setTimeout(() => {
        this.take();
      }, this.space);
    }
  }
}

export default defineComponent({
  data: function() {
    const recentActions: Array<any> = [];
    const messageTimer = new SpacedMessageTimer(1500, 4000, recentActions);
    return {
      recentActions,
      messageTimer,
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
    },
    currentAction: function(): any {
      if (!this.store.state.session) {
        return undefined;
      } else {
        return this.store.state.session.currentAction;
      }
    }
  },
  methods: {
    addMessages(messages: Array<string>) {
      for (let i = 0; i < messages.length; i++) {
        this.messageTimer.push(messages[i]);
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
        if (action.actionType === "SURVEY") {
          return action.playerName + " surveyed for " + initialToSectorElement[action.spaceObject.initial].plural + " in " + SECTOR_NAME.name + "s " + action.sectors.map((s: number) => s+1).join("-");
        } else if (action.actionType === "TARGET") {
          return action.playerName + " targeted " + SECTOR_NAME.name + " " + (action.sector + 1);
        } else if (action.actionType === "RESEARCH") {
          return action.playerName + " researched " + this.store.state.game.research[action.index].categoryName;
        } else if (action.actionType === "LOCATE_PLANET_X") {
          if (action.successful) {
            return action.playerName + " found " + GOAL_OBJECT.the;
          } else {
            return action.playerName + " did not find " + GOAL_OBJECT.the;
          }
        } else if (action.actionType === "THEORY") {
          return action.playerName + " finalized theories";
        } else if (action.actionType === "WINNER") {
          return action.text;
        }
      });

      this.addMessages(recentHistory);
    },
    currentAction(newAction: any) {
      if (!this.store.state.isSession) {
        return;
      }

      const history = this.store.state.session.history;
      if (history.length > 0 && this.store.state.session.players.length > 1) {
        const lastAction = history[history.length - 1];
        if (lastAction.turnType === "THEORY" && lastAction.turn !== newAction.turn && newAction.actionType !== "END_GAME") {
          const totalTheoriesSubmitted =
            history.filter((action: any) => action.turn === lastAction.turn)
                    .map((action: any) => action.theories.length)
                    .reduce((a: number, b: number) => a + b, 0);

          this.$nextTick(() => {
            if (totalTheoriesSubmitted !== 1) {
              this.addMessages(["There were " + totalTheoriesSubmitted + " theories submitted"]);
            } else {
              this.addMessages(["There was 1 theory submitted"]);
            }
          })
        }
      }
    },
    kickedPlayers(newKicked: Array<any>, oldKicked: Array<any>) {
      if (!this.store.state.session) {
        return;
      }

      let recentlyKicked = newKicked.slice(oldKicked.length);
      recentlyKicked = recentlyKicked.map((player: any) => {
        return player.name + " was kicked from the game";
      });

      this.addMessages(recentlyKicked);
    }
  }
});
