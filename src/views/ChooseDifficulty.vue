<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container v-if="store.getters.gameReady && store.state.seasonView !== undefined">
        <div id="title_container">
          <h3>{{ store.state.seasonView.name }} {{ store.state.seasonView.viewType }}</h3>
        </div>
        <p>Select a difficulty level:</p>
        <div id="difficulty_buttons">
          <ion-button
            expand="block"
            v-for="difficulty in store.state.gameType.difficulties"
            :key="difficulty.facts"
            :color="buttonColor(difficulty.facts)"
            @click="selectedFacts = (selectedFacts == difficulty.facts ? undefined : difficulty.facts)"
            >
            {{difficulty.name}} ({{difficulty.facts}} facts)
          </ion-button>
          <stripe/>
          <ion-button
            v-if="selectedFacts !== undefined"
            expand="block"
            color="light"
            @click="continueGame()">
            View Starting Information
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </ion-button>
        </div>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/' + gameType + '/chooseview'">(Change View)</ion-nav-link>
        </div>
      </adaptable-container>
    </ion-content>
    <game-footer hide-at="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonIcon, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

export default defineComponent({
  name: 'ChooseDifficulty',
  components: {
    IonContent,
    IonPage,
    Stripe,
    IonButton,
    IonIcon,
    IonNavLink,
    GameFooter,
    SessionHeader,
    AdaptableContainer
  },
  mixins: [SoundMixin],
  props: {
    gameType: {
      required: true,
      type: String
    }
  },
  data() {
    const store = useStore();
    return {
      store,
      arrowForwardOutline,
      selectedFacts: undefined,
      router: useRouter()
    }
  },
  methods: {
    buttonColor: function(facts: string) {
      if (this.selectedFacts == facts) {
        return "medium";
      } else {
        return "light";
      }
    },
    continueGame: function() {
      this.store.commit("setNumFacts", this.selectedFacts);
      this.router.push("/" + this.gameType + "/startinginfo");
    },
    clearSelections: function() {
      this.selectedFacts = undefined;
    }
  },
  ionViewDidEnter() {
    this.playSound("sonar1");
  },
  ionViewDidLeave() {
    this.clearSelections();
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

#difficulty_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
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
</style>
