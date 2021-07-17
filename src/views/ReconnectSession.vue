<template>
  <ion-page>
    <ion-content>
      <adaptable-container>
        <div id="title_container">
          <h3>Reconnect To Session</h3>
        </div>
        <div id="enter_code">
          <ion-item color="light">
            <ion-label position="floating">Enter Online Game Code</ion-label>
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
          Reconnect to Game
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <p id="fetching" v-if="fetchingSession">Fetching Game...</p>
        <div id="cancel_container">
          <ion-nav-link router-link="/home">Cancel</ion-nav-link>
        </div>
        <div id="recent_sessions" v-if="store.state.recentSessions.length > 0">
          <h4>Recent Games</h4>
          <ion-item
            v-for="(item, index) in store.state.recentSessions"
            :key="index"
            @click="sessionCode = item.sessionCode; playerNum = item.playerNum;">
            {{item.sessionCode}}
          </ion-item>
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
        if (this.store.state.seasonView !== undefined && this.store.state.startingFacts !== undefined) {
          this.router.push("/session/gamemenu");
        } else {
          this.router.push("/session/lobby/join");
        }
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
#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
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
