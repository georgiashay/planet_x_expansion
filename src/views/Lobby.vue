<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-menu hide-above="md"/>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Lobby</h3>
        </div>
        <div>
          <p v-if="sessionCreator">Your session has been created. Please have the other players enter the following session code:</p>
          <p v-else>You have joined the game. Please double-check that the session code is the same as the one created for this game.</p>
        </div>
        <div id="session_code">
          <h1>{{store.state.sessionCode || "Loading..."}}</h1>
          <p>{{sessionModeName}}</p>
        </div>
        <div id="players">
          <ion-item color="light" v-for="player in store.getters.sessionPlayers" :key="player.num">
            <div class="player_circle" :style="playerStyle(player.num)"></div>
            P{{player.num}}: {{player.name}}
          </ion-item>
        </div>
        <div>
          <p v-if="sessionCreator">Verify that all player have joined the session, and then press the start button below to start the game.</p>
        </div>
        <stripe/>
        <ion-button
          :disabled = "!sessionCreator && store.state.session.currentAction.actionType == 'START_GAME'"
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
    </ion-content>
    <game-footer hide-above="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonNavLink, IonIcon,
        IonItem } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import PlayerColors from "@/mixins/PlayerColors.ts";
import SessionHeader from "@/components/SessionHeader.vue";
import GameFooter from "@/components/GameFooter.vue";
import Stripe from "@/components/Stripe.vue";

export default defineComponent({
  name: 'Lobby',
  components: {
    IonContent,
    IonPage,
    Stripe,
    IonButton,
    IonNavLink,
    IonIcon,
    IonItem,
    SessionHeader,
    GameFooter
  },
  mixins: [SoundMixin, PlayerColors],
  props: {
    sessionCreator: {
      required: true,
      type: Boolean
    }
  },
  data() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    return {
      store,
      arrowForwardOutline,
      route,
      router
    }
  },
  computed: {
    sessionModeName(): string {
      if (this.store.state.game === undefined) {
        return "";
      } else {
        return this.store.state.gameType.name + " Mode (" +
         this.store.state.gameType.sectors + " sectors)";
      }
    }
  },
  methods: {
    async startGame() {
      if (this.sessionCreator) {
        await this.store.dispatch("startSession");
        this.router.push("/session/chooseview");
      } else {
        this.router.push("/session/chooseview");
      }
    },
  },
  ionViewDidEnter() {
    this.playSound("sonar1");
  }
});
</script>

<style scoped>
#container {
  padding: 20px;
  max-width: var(--max-form-width);
  margin-right: auto;
  margin-left: auto;
  color: white;
}

#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
  margin-top: 15vh;
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
</style>
