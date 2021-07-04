<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-menu hide-at="lg"/>
    <ion-content>
      <adaptable-container>
        <div id="content">
          <div id="title_container">
            <h3>Lobby</h3>
          </div>
          <div>
            <p v-if="store.getters.isHost">Your session has been created. Please have the other players enter the following session code:</p>
            <p v-else>You have joined the game. Please double-check that the session code is the same as the one created for this game.</p>
          </div>
          <div id="session_code">
            <h1>{{store.state.sessionCode || "Loading..."}}</h1>
            <p>{{sessionModeName}}</p>
          </div>
          <div id="game_link" v-if="store.getters.isHost && store.state.sessionCode !== undefined">
            <p>Copy Game Link <ion-icon @click="copyGameLink()" :src="clipboardOutline" id="clipboard"/> <ion-icon @click="shareGameLink()" :src="shareSocialOutline" id="share-button"></ion-icon></p>
          </div>
          <div id="players" v-if="store.state.session">
            <table>
              <tr v-for="(row, i) in playerGrid" :key="i">
                <td
                  v-for="(player, j) in row"
                  :key="j"
                  :class="player === null ? 'unselected_color' : 'selected_color'"
                  :style="playerStyle(i*5 + j)"
                  @click="changeColor(i*5 + j)">
                  <span v-if="player !== null">{{player.name}}</span>
                </td>
              </tr>
            </table>
          </div>
          <div>
            <p v-if="store.getters.isHost">Verify that all player have joined the session, and then press the start button below to start the game.</p>
          </div>
          <stripe/>
          <ion-button
            :disabled = "!store.state.isSession || (!store.getters.isHost && store.state.session.currentAction.actionType == 'START_GAME')"
            expand="block"
            color="light"
            @click="startGame()"
            id="start_button">
            Start Game
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </ion-button>
          <div id="cancel_container">
            <ion-nav-link router-link="/home">Cancel</ion-nav-link>
          </div>
        </div>
      </adaptable-container>
    </ion-content>
    <game-footer hide-at="lg"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonNavLink, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, clipboardOutline, shareSocialOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import PlayerColors from "@/mixins/PlayerColors.ts";
import SessionHeader from "@/components/SessionHeader.vue";
import GameFooter from "@/components/GameFooter.vue";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";
import { MY_URL } from "@/constants.ts";
import { SocialSharing } from "@ionic-native/social-sharing";
import { isPlatform } from '@ionic/vue';

export default defineComponent({
  name: 'Lobby',
  components: {
    IonContent,
    IonPage,
    Stripe,
    IonButton,
    IonNavLink,
    IonIcon,
    SessionHeader,
    GameFooter,
    AdaptableContainer
  },
  mixins: [SoundMixin, PlayerColors],
  data() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    return {
      store,
      arrowForwardOutline,
      clipboardOutline,
      shareSocialOutline,
      route,
      router
    }
  },
  computed: {
    sessionCode(): string | undefined {
      return this.store.state.sessionCode;
    },
    sessionModeName(): string {
      if (this.store.state.game === undefined) {
        return "";
      } else {
        return this.store.state.gameType.name + " Mode (" +
         this.store.state.gameType.sectors + " sectors)";
      }
    },
    playerGrid(): Array<Array<any>> {
      const colors = Array.from(Array(this.numColors())).map(() => null);
      for (let i = 0; i < this.store.getters.sessionPlayers.length; i++) {
        const player = this.store.getters.sessionPlayers[i];
        colors[player.color] = player;
      }
      const grid: Array<Array<any>> = [[]];
      for (let i = 0; i < colors.length; i++) {
        grid[grid.length-1].push(colors[i]);
        if (grid[grid.length - 1].length === 5) {
          grid.push([]);
        }
      }
      return grid;
    }
  },
  methods: {
    async startGame() {
      if (this.store.getters.isHost) {
        await this.store.dispatch("startSession");
        this.router.push("/session/chooseview");
      } else {
        this.router.push("/session/chooseview");
      }
    },
    changeColor(newColor: number) {
      this.store.dispatch('changeColor', newColor);
    },
    handleKeypress(e: KeyboardEvent) {
      const color = this.store.getters.playerInfo.color;
      if (e.keyCode === 37) {
        // Left
        if (color % 5 !== 0) {
          this.changeColor(color - 1);
        }
      } else if (e.keyCode === 38) {
        // Up
        if (color >= 5) {
          this.changeColor(color - 5);
        }
      } else if (e.keyCode === 39) {
        // Right
        if (color % 5 !== 4) {
          this.changeColor(color + 1);
        }
      } else if (e.keyCode === 40) {
        // Down
        const newColor = color + 5;
        if (newColor < this.numColors()) {
          this.changeColor(newColor);
        }
      }
    },
    copyGameLink() {
      const tmp = document.createElement("input") as HTMLInputElement;
      tmp.setAttribute("style", "position: absolute; left: -1000px; top:-1000px;");
      tmp.value = MY_URL + "/session/join/" + this.store.state.sessionCode;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    },
    async shareGameLink() {
      if (isPlatform("cordova")) {
        SocialSharing.share("Join My Planet X Game", "Planet X Game", null, MY_URL + "/session/join/" + this.store.state.sessionCode);
      } else {
        navigator.share({
          title: "Planet X Game",
          text: "Join My Planet X Game",
          url: MY_URL + "/session/join/" + this.store.state.sessionCode
        });
      }
    }
  },
  watch: {
    sessionCode: function(newSessionCode) {
      if (newSessionCode !== undefined) {
        this.router.push("/session/lobby/" + newSessionCode);
      }
    }
  },
  ionViewDidEnter() {
    this.playSound("sonar1");
    window.addEventListener("keydown", this.handleKeypress);
  },
  ionViewWillLeave() {
    window.removeEventListener("keydown", this.handleKeypress);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeypress);
  }
});
</script>

<style scoped>
#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#session_code {
  text-align: center;
}

#session_code h1 {
  font-size: 50px;
  line-height: 56px;
}

#game_link {
  text-align: center;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

#start_button {
  text-transform: none;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}

.player_circle {
  width: 1em;
  height: 1em;
  margin: 0.5em;
  border-radius: 0.5em;
  background-color: var(--player-color);

  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: pulse 1.6s infinite;
}

.unselected_color {
  background-color: var(--player-color);
}

.selected_color {
  background-color: var(--player-color);
}

#players {
    width: 100%;
}

table {
  width: 100%;
  max-width: 40vh;
  margin: 0 auto;
}

td {
  width: 20%;
  height: 0;
  padding-bottom: 10%;
  padding-top: 10%;
  position: relative;
  padding-left: 0;
  padding-right: 0;
  overflow: hidden;
}

td span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.2em;
  border-radius: 0.4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

#clipboard {
  cursor: pointer;
}

#share-button {
  cursor: pointer;
}
</style>
