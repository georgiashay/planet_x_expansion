<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Target</h3>
        </div>
        <div id="reminder">
        <p>Reminder: you can only target a sector in the visible sky. (At the beginning of the game, the visible sky is 1-{{store.getters.skySize}}.)</p>
        <p>You can only target in the visible half of the sky.</p>
        </div>
        <ion-button
          expand="block"
          color="light"
          :router-link="'/' + gameType + '/action/target'"
          id="continue_button">
          Continue
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <stripe/>
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
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

export default defineComponent({
  name: 'TargetReminder',
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
      arrowForwardOutline
    }
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

#reminder p {
  font-style: italic;
}

#continue_button {
  margin-top: 10px;
  text-transform: none;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}
</style>
