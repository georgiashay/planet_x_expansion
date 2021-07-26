<template>
  <ion-page>
    <ion-content>
      <adaptable-container>
        <div id="title_container">
          <h3>Game Code</h3>
        </div>
        <div>
          <p v-if="gameCreator">You have created a game. Other players should enter the following game code:</p>
          <p v-else>You have joined this game. Ensure that the game code you entered is correct.</p>
        </div>
        <div id="game_code">
          <h1>{{store.state.gameCode || "Loading..."}}</h1>
          <p>{{gameModeName}}</p>
        </div>
        <div>
          <p v-if="gameCreator">Ensure all players have joined the game with this code, then press the Continue button below.</p>
        </div>
        <stripe/>
        <ion-button
          expand="block"
          color="light"
          router-link="/multiplayer/chooseview"
          id="continue_button">
          Continue
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <div id="cancel_container">
          <ion-nav-link router-link="/home">Cancel</ion-nav-link>
        </div>
      </adaptable-container>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonNavLink, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";
import { SECTOR_NAME } from "@/constants.ts";

export default defineComponent({
  name: 'GameCode',
  components: {
    IonContent,
    IonPage,
    Stripe,
    IonButton,
    IonNavLink,
    IonIcon,
    AdaptableContainer
  },
  mixins: [SoundMixin],
  props: {
    gameCreator: {
      required: true,
      type: Boolean
    }
  },
  data() {
    const store = useStore();
    const route = useRoute();
    return {
      store,
      arrowForwardOutline,
      route
    }
  },
  computed: {
    gameModeName(): string {
      if (this.store.state.game === undefined) {
        return "";
      } else {
        return this.store.state.gameType.name + " Mode (" +
         this.store.state.gameType.sectors + " " + SECTOR_NAME.plural + ")";
      }
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
  margin-bottom: 2em;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#game_code {
  text-align: center;
}

#game_code h1 {
  font-size: 50px;
  line-height: 56px;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

#continue_button {
  text-transform: none;
}

</style>
