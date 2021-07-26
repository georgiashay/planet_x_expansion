<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Research &amp; {{CONFERENCE_NAME.properPlural}}</h3>
        </div>
        <p>The following are the categories of research and {{CONFERENCE_NAME.plural}} for this game.</p>
        <stripe/>
        <div id="research">
          <b>Research</b>
          <p
            v-for="(research, index) in store.state.game.research"
            :key="index">
          {{String.fromCharCode(index+65)}}. {{research.categoryName}}
          </p>
        </div>
        <div id="conference">
          <b>{{CONFERENCE_NAME.proper}}</b>
          <p
            v-for="(conference, index) in store.state.game.conference"
            :key="index">
            {{GOAL_OBJECT.initial}}{{index + 1}}. {{conference.categoryName}}
          </p>
        </div>
        <stripe/>
        <ion-button
          expand="block"
          color="light"
          :router-link="'/' + gameType + '/gamemenu'"
          id="continue_button">
          Continue
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
      </adaptable-container>
    </ion-content>
    <game-footer hide-at="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";
import { GOAL_OBJECT, CONFERENCE_NAME } from "@/constants.ts";

export default defineComponent({
  name: 'ResearchCategories',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    Stripe,
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
      GOAL_OBJECT,
      CONFERENCE_NAME
    }
  },
  ionViewDidEnter() {
    this.playSound("page_transition");
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

#research p {
  margin-top: 5px;
  margin-bottom: 5px;
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
</style>
