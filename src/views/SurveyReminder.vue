<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Survey</h3>
        </div>
        <div id="reminder">
        <p>Reminder: you can only survey a range of sectors in the visible sky. (At the beginning of the game, the visible sky is 1-12.)</p>
        <img src = "/assets/earth_from_space.jpeg">
        <p>You can only survey in the visible half of the sky.</p>
        </div>
        <ion-button
          expand="block"
          color="medium"
          router-link="/multiplayer/action/survey"
          id="continue_button">
          Continue
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <ion-item-divider/>
        <div id="cancel_container">
          <ion-nav-link router-link="/multiplayer/gamemenu">Cancel</ion-nav-link>
        </div>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title id="game_code">Game Code: {{ store.state.gameCode }}</ion-title>
        <ion-nav-link id="history_link" router-link="/multiplayer/history">History</ion-nav-link>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonIcon, IonFooter,
        IonToolbar, IonTitle, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'SurveyReminder',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonItemDivider,
    IonNavLink
  },
  data() {
    const store = useStore();
    return {
      store,
      arrowForwardOutline
    }
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

#reminder p {
  font-style: italic;
}

#continue_button {
  margin-top: 10px;
  text-transform: none;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

#game_code {
  float:left;
}

#history_link {
  float:right;
  text-decoration: underline;
  margin-right: 20px;
}
</style>
