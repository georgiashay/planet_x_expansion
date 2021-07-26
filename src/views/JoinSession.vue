<template>
  <ion-page>
    <ion-content>
      <adaptable-container>
        <div id="title_container">
          <h3>Join Online Game</h3>
        </div>
        <div id="enter_code">
          <ion-item color="light">
            <ion-label position="floating">Enter Game Code</ion-label>
            <ion-input v-model="sessionCode"></ion-input>
          </ion-item>
        </div>
        <div id="enter_name">
          <ion-item color="light">
            <ion-label position="floating">Enter Name</ion-label>
            <ion-input v-model="name" maxlength="12"></ion-input>
          </ion-item>
        </div>
        <ion-button
          :disabled="sessionCode.length == 0 || name.length == 0"
          expand="block"
          color="light"
          @click="joinSession()"
          id = "join_session_button">
          Join Game
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <p id="fetching" v-if="fetchingSession">Fetching Game...</p>
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
import { useRouter, useRoute } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

function isString(obj: any): obj is string {
  return typeof obj === "string";
}

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
    const route = useRoute();
    return {
      selectedGame: undefined,
      arrowForwardOutline,
      store,
      router,
      route,
      sessionCode: "",
      name: "",
      fetchingSession: false
    }
  },
  methods: {
    async joinSession() {
      this.sessionCode = this.sessionCode.toUpperCase();

      // Fetch session asynchronously
      this.fetchingSession = true;
      await this.store.dispatch("joinSession", {
        sessionCode: this.sessionCode,
        name: this.name
      });
      this.fetchingSession = false;

      if (this.store.state.session !== undefined) {
        // Start session
        this.router.push("/session/lobby/join");
      } else {
        // Session code incorrect, show alert
        const alert = await alertController
                        .create({
                          header: 'Alert',
                          message: 'That session does not exist or could not be joined. Please try again.',
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
    this.name = "";
    if (this.route.params.sessionCode) {
      if (isString(this.route.params.sessionCode)) {
        this.sessionCode = this.route.params.sessionCode;
      }
    }
  },
  ionViewDidEnter() {
    this.playSound("page_transition");
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

#join_session_button {
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
