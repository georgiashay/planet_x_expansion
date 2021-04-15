<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Starting Information</h3>
          <h4>{{ store.state.equinox }} Equinox</h4>
        </div>
        <div id="starting_info">
          <ion-item-group>
            <template
              v-for="(info, index) in store.getters.myStartingInformation"
              :key="index">
              <ion-item>
                {{info.text}}
              </ion-item>
            </template>
          </ion-item-group>
        </div>
        <ion-button
          expand="block"
          color="medium"
          router-link="/multiplayer/researchcategories"
          id="start_button">
          Start Game
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
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
import { IonContent, IonPage,
        IonButton, IonIcon, IonFooter,
        IonToolbar, IonTitle, IonItem,
        IonItemGroup, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'StartingInformation',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonItem,
    IonItemGroup,
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

#starting_info {
  margin-bottom: 10px;
}

#start_button {
  text-transform: none;
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
