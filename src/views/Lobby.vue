<template>
  <ion-page>
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
          <ion-item color="dark" v-for="player in store.getters.sessionPlayers" :key="player.num">
            <div class="player_circle" :style="playerStyle(player.num)"></div>
            P{{player.num}}: {{player.name}}
          </ion-item>
        </div>
        <div>
          <p v-if="sessionCreator">Verify that all player have joined the session, and then press the start button below to start the game.</p>
        </div>
        <ion-item-divider/>
        <ion-button
          :disabled = "!sessionCreator && store.state.session.currentAction.actionType == 'START_GAME'"
          expand="block"
          color="dark"
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
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonNavLink, IonIcon,
        IonItem } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import PlayerColors from "@/mixins/PlayerColors.ts";

export default defineComponent({
  name: 'Lobby',
  components: {
    IonContent,
    IonPage,
    IonItemDivider,
    IonButton,
    IonNavLink,
    IonIcon,
    IonItem
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
    this.playSonar1();
  }
});
</script>

<style scoped>
#container {
  padding: 20px;
}

#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
  margin-top: 25%;
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
