import { useStore } from "vuex";
import { initialToSectorElement, GOAL_OBJECT, SECTOR_NAME } from "@/constants.ts";
import { defineComponent, ref, Ref } from 'vue';

class SpacedMessageTimer {
  space: number;
  timeVisible: number;
  queue: Array<{ message: string }>;
  messages: Ref<Array<{ message: string }>>;
  timeout: undefined | number;

  constructor(space: number, timeVisible: number, messages: Ref<Array<{ message: string }>> =ref([])) {
    this.space = space;
    this.timeVisible = timeVisible;
    this.queue = [];
    this.messages = messages;
    this.timeout = undefined;
  }

  push(message: string) {
    const msg = { message };
    if (this.timeout === undefined) {
      // No messages currently displayed
      this.messages.value.push(msg);
      // Remove message after this.timeVisible ms
      setTimeout(() => {
        const i = this.messages.value.indexOf(msg);
        this.messages.value.splice(i, 1);
      }, this.timeVisible);
      // Attempt to retrieve another message
      // after this.space ms
      this.timeout = setTimeout(() => {
        this.take();
      }, this.space);
    } else {
      // Push message to the queue to be shown later
      this.queue.push(msg);
    }
  }

  take() {
    if (this.queue.length === 0) {
      // Nothing in the queue
      this.timeout = undefined;
    } else {
      // Remove first message in queue
      const [msg] = this.queue.splice(0, 1);
      this.messages.value.push(msg);
      // Remove message after this.timeVisible ms
      setTimeout(() => {
        const i = this.messages.value.indexOf(msg);
        this.messages.value.splice(i, 1);
      }, this.timeVisible);
      // Attempt to retrieve another message after
      // this.space ms
      this.timeout = setTimeout(() => {
        this.take();
      }, this.space);
    }
  }
}

export default {
  install(app: any) {
    const recentActions: Ref<Array<any>> = ref([]);
    const messageTimer = new SpacedMessageTimer(1500, 4000, recentActions);

    app.provide("$recentActions", recentActions);

    const component = defineComponent({
      name: "RecentActions",
      render: function() {
        return this.$slots.default;
      },
      data: function() {
        return {
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
          // Add multiple messages to the message timer
          for (let i = 0; i < messages.length; i++) {
            messageTimer.push(messages[i]);
          }
        }
      },
      watch: {
        fullHistory(newHistory: Array<any>, oldHistory: Array<any>) {
          if (!this.store.state.isSession) {
            return;
          }
          // Only look at history that has been added since we last checked
          let recentHistory = newHistory.slice(oldHistory.length);
          // Only consider history that isn't my own turns
          recentHistory = recentHistory.filter((action: any) => {
            return action.playerID === undefined || action.playerID !== this.store.state.playerID;
          });
          // Don't show messages for theory reveals or conferences
          recentHistory = recentHistory.filter((action: any) => {
            return action.actionType !== "THEORY_REVEAL" && action.actionType !== "CONFERENCE";
          });
          // Show different messages depending on the action
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
            // If the last action was a theory phase, we've advanced turns, and it's
            // not the end of the game
            if (lastAction.turnType === "THEORY" && lastAction.turn !== newAction.turn && newAction.actionType !== "END_GAME") {
              // Count total number of theories submitted on the theory turn
              const totalTheoriesSubmitted =
                history.filter((action: any) => action.turn === lastAction.turn)
                        .map((action: any) => action.theories.length)
                        .reduce((a: number, b: number) => a + b, 0);

              // Add messsage for this after any message about individual players
              // finalizing theories
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

    app.component("RecentActions", component);
  }
}
