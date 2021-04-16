<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Research &amp; Conferences</h3>
        </div>
        <p>The following research items and conferences are available this game. We encourage players to record these titles on their note sheets.</p>
        <ion-item-divider/>
        <div id="research">
          <b>Research</b>
          <p
            v-for="(research, index) in store.state.game.research"
            :key="index">
          {{String.fromCharCode(index+65)}}. {{research.categoryName}}
          </p>
        </div>
        <div id="conference">
          <b>Conference</b>
          <p
            v-for="(conference, index) in store.state.game.conference"
            :key="index">
            X{{index + 1}}. {{conference.categoryName}}
          </p>
        </div>
        <ion-item-divider/>
        <ion-button
          expand="block"
          color="medium"
          router-link="/multiplayer/gamemenu"
          id="continue_button">
          Continue
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
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonIcon, IonFooter,
        IonToolbar, IonTitle, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ResearchCategories',
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
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
  margin-top: 25%;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#research p {
  margin-top: 5px;
  margin-bottom: 5px;
}

#research {
  margin-top: 10px;
}

#conference p {
  margin-top: 5px;
  margin-bottom: 5px;
}

#conference {
  margin-top: 10px;
}

#continue_button {
  margin-top: 10px;
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
