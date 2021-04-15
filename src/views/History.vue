<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>History</h3>
        </div>
        <div id="history">
          <ion-button
            expand="block"
            color="medium"
            router-link="/multiplayer/startinginfo">
            Starting Information, {{store.state.equinox}} Equinox
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </ion-button>
          <ion-button
            disabled
            v-for="(item, index) in selectedHistory"
            :key="index"
            expand="block"
            color="medium"
          >
            {{item.actionText}}
          </ion-button>
        </div>
        <ion-item-divider/>
        <div id="cancel_container">
          <ion-nav-link router-link="/multiplayer/gamemenu">Close History</ion-nav-link>
        </div>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title id="game_code">Game Code: {{ store.state.gameCode }}</ion-title>
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
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'History',
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
    const router = useRouter();
    return {
      store,
      arrowForwardOutline,
      router
    }
  },
  computed: {
    selectedHistory: function(): Array<any> {
      return this.store.state.history.filter((item: any) => {
        return item.actionType != "peerReview" && item.actionType != "conference";
      });
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

#history {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

#history ion-button {
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

#game_code {
  float:left;
}
</style>
