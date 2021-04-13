<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Multiplayer Game</h3>
        </div>
        <div id="enter_code">
          <ion-item>
            <ion-label position="floating">Enter Game Code</ion-label>
            <ion-input v-model="gameCode"></ion-input>
          </ion-item>
        </div>
        <ion-button
          expand="block"
          color="medium"
          @click="joinGame()"
          id = "join_game_button">
          Join Game
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <p id="fetching" v-if="fetchingGame">Fetching Game...</p>
        <div id="cancel_container">
          <ion-nav-link router-link="/home">Cancel</ion-nav-link>
        </div>
      </div>
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

export default defineComponent({
  name: 'JoinMultiplayer',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonNavLink,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel
  },
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

      this.fetchingGame = true;
      await this.store.dispatch("joinGame", this.gameCode);
      this.fetchingGame = false;

      if (this.store.state.game !== undefined) {
        this.router.push("/multiplayer/gamecode/join");
      } else {
        const alert = await alertController
                        .create({
                          // cssClass: 'my-custom-class',
                          header: 'Alert',
                          // subHeader: 'Subtitle',
                          message: 'That game code could not be found. Please try again.',
                          buttons: ['OK'],
                        });
        await alert.present();
        await alert.onDidDismiss();
      }
    }
  },
  ionViewWillEnter: function() {
    this.gameCode = "";
  }
});
</script>

<style scoped>
#container {
  padding: 20px;
}

#title_container {
  font-family: sans-serif;
  text-transform: uppercase;
  text-align: center;
  margin-top: 25%;
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
