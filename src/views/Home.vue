<template>
  <ion-page>
    <ion-content>
      <centered-container>
        <div id="title_container">
          <h2>The Search For</h2>
          <h1><b>{{GOAL_OBJECT.proper}}</b></h1>
          <h5 v-if="THEME == 'space'">Unofficial Expansion</h5>
        </div>
        <div id="start_game_buttons">
          <stripe/>
          <ion-button expand="block" color="light" router-link = "/multiplayer/create">Start New Offline Game</ion-button>
          <ion-button expand="block" color="light" router-link = "/multiplayer/join">Enter Offline Game Code</ion-button>
          <spacer/>
          <ion-button expand="block" color="light" router-link = "/session/create">Start New Online Game</ion-button>
          <ion-button expand="block" color="light" router-link = "/session/join">Enter Online Game Code</ion-button>
          <ion-button expand="block" color="light" router-link = "/session/reconnect">Reconnect to Game</ion-button>
          <stripe/>
        </div>
      </centered-container>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import SoundMixin from "@/mixins/SoundMixin.ts";
import Stripe from "@/components/Stripe.vue";
import Spacer from "@/components/Spacer.vue";
import CenteredContainer from "@/components/CenteredContainer.vue";
import { GOAL_OBJECT, THEME } from "@/constants.ts";

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonButton,
    Stripe,
    Spacer,
    CenteredContainer
  },
  mixins: [SoundMixin],
  data() {
    return {
      store: useStore(),
      THEME,
      GOAL_OBJECT
    }
  },
  ionViewDidEnter() {
    this.store.commit('resetGame');
    this.store.dispatch('stopListening');
    this.playSound("startup");
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

#start_game_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3em;
}

#start_game_buttons ion-button {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: none;
}
</style>
