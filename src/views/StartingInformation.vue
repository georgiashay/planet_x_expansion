<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Starting Information</h3>
          <h4>{{ store.state.equinox }} Equinox</h4>
        </div>
        <div id="starting_info">
          <p v-if="store.getters.myStartingInformation.length === 0">You're a genius. You don't need any starting information.</p>
          <ion-grid>
            <ion-row
              v-for="(info, index) in store.getters.myStartingInformation"
              :key="index"
              class="clue_row">
              <ion-col size="4" class="sector_num">
                Sector {{info.sector + 1}}
              </ion-col>
              <ion-col size="8" class="clue_obj">
                <ion-icon :src="info.spaceObject.icon"></ion-icon>&nbsp;
                not {{info.spaceObject.one}}
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <ion-button
          expand="block"
          color="dark"
          router-link="/multiplayer/researchcategories"
          id="start_button">
          Start Game
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar color="dark">
        <ion-title id="game_code">Game Code: {{ store.state.gameCode }}</ion-title>
        <ion-nav-link id="history_link" router-link="/multiplayer/history">History</ion-nav-link>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonIcon, IonFooter,
        IonToolbar, IonTitle, IonNavLink,
        IonGrid, IonCol, IonRow } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';

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
    IonNavLink,
    IonGrid,
    IonCol,
    IonRow
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
  font-family: "Roboto Slab";
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

.clue_row {
  padding: 7px;
  border-bottom: 1px solid lightgray;
}

.clue_row ion-col {
  display: flex;
  align-content: center;
  align-items: center;
}

.clue_obj ion-icon {
  font-size: 24px;
}

.sector_num {
  font-style: bold;
}
</style>
