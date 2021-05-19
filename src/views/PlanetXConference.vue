<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Planet X Conference</h3>
        </div>
        <div id="conference_selections">
          Select the current conference:
          <ion-button
            :disabled="store.state.isSession && index != store.getters.currentConference"
            expand="block"
            v-for="(conference, index) in store.state.game.conference"
            :key="index"
            :color="buttonColor(index)"
            @click="selectedConference = (selectedConference == index ? undefined : index)"
            >
            <span class="ion-text-left">X{{index + 1}}. {{conference.categoryName}}</span>
          </ion-button>
        </div>
        <stripe/>
        <ion-button
          expand="block"
          color="light"
          @click="conference()"
          id="conference_button"
          :disabled="selectedConference === undefined">
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
  name: 'PlanetXConference',
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
      selectedConference: undefined,
      router,
    }
  },
  methods: {
    buttonColor: function(index: string): string {
      if (this.selectedConference == index) {
        return "medium";
      } else {
        return "light";
      }
    },
    conference: function() {
      this.store.dispatch('conference', {
        index: this.selectedConference
      });
      this.router.push('/' + this.gameType + '/action/conference/result');
    },
    clearSelections: function() {
      this.selectedConference = undefined;
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
  margin-top: 2em;
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

.ion-text-left {
  margin-right: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em;
}
</style>
