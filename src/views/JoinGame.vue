<template>
  <ion-page>
    <ion-content>
      <adaptable-container>
        <div id="title_container">
          <h3>Multiplayer Game</h3>
        </div>
        <div id="enter_code">
          <ion-item color="light">
            <ion-label position="floating">Enter Game Code</ion-label>
            <ion-input v-model="gameCode"></ion-input>
          </ion-item>
        </div>
        <ion-button
          expand="block"
          color="light"
          @click="joinGame()"
          id = "join_game_button">
          Join Game
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <p id="fetching" v-if="fetchingGame">Fetching Game...</p>
        <div id="cancel_container">
          <ion-nav-link router-link="/home">Cancel</ion-nav-link>
        </div>
      </adaptable-container>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonNavLink, IonIcon,
        IonInput, IonItem, IonLabel,
        alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

export default defineComponent({
  name: 'JoinGame',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonNavLink,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    AdaptableContainer
  },
  mixins: [SoundMixin],
  data() {
    const store = useStore();
    const router = useRouter();
    return {
      selectedGame: undefined,
      arrowForwardOutline,
      store,
      router,
      gameCode: "",
      fetchingGame: false
    }
  },
  methods: {
    async joinGame() {
      this.gameCode = this.gameCode.toUpperCase();

      // Fetch game asynchronously
      this.fetchingGame = true;
      await this.store.dispatch("joinGame", this.gameCode);
      this.fetchingGame = false;

      if (this.store.state.game !== undefined) {
        // Start game
        this.router.push("/multiplayer/gamecode/join");
      } else {
        // Game code incorrect, show alert
        const alert = await alertController
                        .create({
                          header: 'Alert',
                          message: 'That game code could not be found. Please try again.',
                          buttons: ['OK'],
                          cssClass: 'custom-alert'
                        });
        await alert.present();
        await alert.onDidDismiss();
      }
    }
  },
  ionViewWillEnter: function() {
    this.gameCode = "";
  },
  ionViewDidEnter() {
    this.playSound("sonar1");
  }
});
</script>

<style scoped>
#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 2em;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#enter_code ion-input {
  text-transform: uppercase;
}

#join_game_button {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: none;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

@keyframes pulse-fetch {
  0% {
    color: black;
  }
  50% {
    color: lightgray;
  }
  100 {
    color: black;
  }
}

#fetching {
  text-align: center;
  animation-name: pulse-fetch;
  animation-duration: 1.3s;
  animation-iteration-count: infinite;
}

</style>
