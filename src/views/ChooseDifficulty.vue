<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container"  v-if="store.getters.gameReady && store.state.seasonView !== undefined">
        <div id="title_container">
          <h3>{{ store.state.seasonView.name }} {{ store.state.seasonView.viewType }}</h3>
        </div>
        <p>Select a difficulty level:</p>
        <div id="difficulty_buttons">
          <ion-button
            expand="block"
            v-for="difficulty in DIFFICULTY_LEVELS"
            :key="difficulty.facts"
            :color="buttonColor(difficulty.facts)"
            @click="selectedFacts = (selectedFacts == difficulty.facts ? undefined : difficulty.facts)"
            >
            {{difficulty.name}} ({{difficulty.facts}} facts)
          </ion-button>
          <ion-item-divider/>
          <ion-button
            v-if="selectedFacts !== undefined"
            expand="block"
            color="dark"
            @click="continueGame()">
            View Starting Information
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </ion-button>
        </div>
        <div id="cancel_container">
          <ion-nav-link router-link="/multiplayer/chooseview">(Change View)</ion-nav-link>
        </div>
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
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonIcon, IonFooter,
        IonToolbar, IonTitle, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { DIFFICULTY_LEVELS } from '@/constants';
import SoundMixin from "@/mixins/SoundMixin.ts";

export default defineComponent({
  name: 'ChooseDifficulty',
  components: {
    IonContent,
    IonPage,
    IonItemDivider,
    IonButton,
    IonIcon,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonNavLink
  },
  mixins: [SoundMixin],
  data() {
    const store = useStore();
    return {
      store,
      arrowForwardOutline,
      DIFFICULTY_LEVELS,
      selectedFacts: undefined,
      router: useRouter()
    }
  },
  methods: {
    buttonColor: function(facts: string) {
      if (this.selectedFacts == facts) {
        return "medium";
      } else {
        return "dark";
      }
    },
    continueGame: function() {
      this.store.commit("setNumFacts", this.selectedFacts);
      this.router.push("/multiplayer/startinginfo");
    },
    clearSelections: function() {
      this.selectedFacts = undefined;
    }
  },
  ionViewDidEnter() {
    this.playSonar1();
  },
  ionViewDidLeave() {
    this.clearSelections();
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

#difficulty_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

#difficulty_buttons ion-button {
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
</style>
