<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-menu hide-at="lg"/>
    <ion-content>
      <adaptable-container v-if="store.getters.gameReady">
        <div id="title_container">
          <h3>Choose Your View</h3>
        </div>
        <p>Select the view that matches the side of the board you are facing and your score sheet:</p>
        <div id="view_buttons">
          <ion-button
            expand="block"
            v-for="view in SeasonView"
            :key="view.name"
            :color="buttonColor(view)"
            @click="selectedView = (selectedView == view ? undefined : view)"
            >
            <ion-icon :src="view.icon"></ion-icon>&nbsp; {{ view.name }} {{ view.viewType }}
          </ion-button>
          <stripe/>
          <ion-button
            v-if="selectedView !== undefined"
            expand="block"
            color="light"
            @click="continueGame()"
            id="continue_button">
            Continue
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </ion-button>
        </div>
      </adaptable-container>
    </ion-content>
    <game-footer hide-at="lg"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SeasonView } from '@/constants';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

export default defineComponent({
  name: 'ChooseView',
  components: {
    IonContent,
    IonPage,
    Stripe,
    IonButton,
    IonIcon,
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
      SeasonView,
      selectedView: undefined,
      router: useRouter()
    }
  },
  methods: {
    buttonColor: function(view: string) {
      if (this.selectedView == view) {
        return "medium";
      } else {
        return "light";
      }
    },
    continueGame: function() {
      this.store.commit("setSeasonView", this.selectedView);
      this.router.push("/" + this.gameType + "/choosedifficulty");
    },
    clearSelections: function() {
      this.selectedView = undefined;
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

#view_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

#view_buttons ion-button {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: none;
}

#view_buttons ion-icon {
  font-size: 2em;
}

#continue_button ion-icon {
  font-size: 1.2em;
}
</style>
