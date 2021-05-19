<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Research</h3>
        </div>
        <div id="research_selections">
          Select a research item:
          <ion-button
            :disabled = "store.getters.researchedAlready(index)"
            expand="block"
            v-for="(research, index) in store.state.game.research"
            :key="index"
            :color="buttonColor(index)"
            @click="selectedResearch = (selectedResearch == index ? undefined : index)"
            >
            <span class="ion-text-left">{{String.fromCharCode(index+65)}}. {{research.categoryName}}</span>
          </ion-button>
        </div>
        <stripe/>
        <ion-button
          expand="block"
          color="light"
          @click="research()"
          id="research_button"
          :disabled="selectedResearch === undefined">
          Reveal Information
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/' + gameType + '/gamemenu'">Cancel</ion-nav-link>
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
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

export default defineComponent({
  name: 'Research',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    Stripe,
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
    const router = useRouter();
    return {
      store,
      arrowForwardOutline,
      timeOutline,
      selectedResearch: undefined,
      router,
    }
  },
  methods: {
    buttonColor: function(index: string) {
      if (this.selectedResearch == index) {
        return "medium";
      } else {
        return "light";
      }
    },
    research: function() {
      this.store.dispatch('research', {
        index: this.selectedResearch
      });
      this.router.push('/' + this.gameType + '/action/research/result');
    },
    clearSelections: function() {
      this.selectedResearch = undefined;
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
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#research_button {
  margin-top: 10px;
  text-transform: none;
}

#research_button ion-icon {
  font-size: 1.2em;
}

#research_selections {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2em;
}

#research_selections ion-button {
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

.ion-text-left {
  margin-right: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em;
}
</style>
