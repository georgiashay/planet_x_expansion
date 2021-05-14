<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Reconnect To Session</h3>
        </div>
        <div id="enter_code">
          <ion-item color="light">
            <ion-label position="floating">Enter Session Code</ion-label>
            <ion-input v-model="sessionCode"></ion-input>
          </ion-item>
        </div>
        <div id="enter_num">
          <ion-item color="light">
            <ion-label position="floating">Enter Player Number</ion-label>
            <ion-input v-model="playerNum" type="number" min="1"></ion-input>
          </ion-item>
        </div>
        <ion-button
          :disabled="sessionCode.length == 0 || playerNum === undefined"
          expand="block"
          color="light"
          @click="reconnectSession()"
          id = "reconnect_session_button">
          Reconnect to Session
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <p id="fetching" v-if="fetchingSession">Fetching Session...</p>
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
import SoundMixin from "@/mixins/SoundMixin.ts";

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
    IonLabel
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
      sessionCode: "",
      playerNum: undefined,
      fetchingSession: false
    }
  },
  methods: {
    async reconnectSession() {
      this.sessionCode = this.sessionCode.toUpperCase();

      // Fetch session asynchronously
      this.fetchingSession = true;
      await this.store.dispatch("reconnectSession", {
        sessionCode: this.sessionCode,
        playerNum: this.playerNum
      });
      this.fetchingSession = false;

      if (this.store.state.session !== undefined) {
        // Start session
        this.router.push("/session/lobby/join");
      } else {
        // Session code or player number incorrect, show alert
        const alert = await alertController
                        .create({
                          header: 'Alert',
                          message: 'That session code or player number could not be found. Please try again.',
                          buttons: ['OK'],
                          cssClass: 'custom-alert'
                        });
        await alert.present();
        await alert.onDidDismiss();
      }
    }
  },
  ionViewWillEnter: function() {
    this.sessionCode = "";
    this.playerNum = undefined;
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

#enter_code ion-input {
  text-transform: uppercase;
}

#reconnect_session_button {
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
