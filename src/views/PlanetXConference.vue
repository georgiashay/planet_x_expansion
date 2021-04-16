<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Planet X Conference</h3>
        </div>
        <div id="conference_selections">
          Select the current conference:
          <ion-button
            expand="block"
            v-for="(conference, index) in store.state.game.conference"
            :key="index"
            :color="buttonColor(index)"
            @click="selectedConference = (selectedConference == index ? undefined : index)"
            >
            <span class="ion-text-left">X{{index + 1}}. {{conference.categoryName}}</span>
          </ion-button>
        </div>
        <ion-item-divider/>
        <ion-button
          expand="block"
          color="medium"
          @click="conference()"
          id="conference_button"
          :disabled="selectedConference === undefined">
          Reveal Information
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <div id="cancel_container">
          <ion-nav-link router-link="/multiplayer/gamemenu" @click="clearSelections()">Cancel</ion-nav-link>
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
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PlanetXConference',
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
      timeOutline,
      selectedConference: undefined,
      router,
    }
  },
  methods: {
    buttonColor: function(index: string): string {
      if (this.selectedConference == index) {
        return "light";
      } else {
        return "medium";
      }
    },
    conference: function() {
      this.store.commit('conference', {
        index: this.selectedConference
      });
      this.clearSelections();
      this.router.push('/multiplayer/action/conference/result');
    },
    clearSelections: function() {
      this.selectedConference = undefined;
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

#conference_button {
  margin-top: 10px;
  text-transform: none;
}

#conference_button ion-icon {
  font-size: 1.2em;
}

#conference_selections {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

#conference_selections ion-button {
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

#history_link {
  float:right;
  text-decoration: underline;
  margin-right: 20px;
}

.ion-text-left {
  margin-right: auto;
}
</style>
