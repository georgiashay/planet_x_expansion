<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h2>The Search For</h2>
          <h1><b>Planet X</b></h1>
          <h5>Unofficial Expansion</h5>
        </div>
        <div id="start_game_buttons">
          <stripe/>
          <ion-button expand="block" color="light" router-link = "/multiplayer/create">Start New Game</ion-button>
          <ion-button expand="block" color="light" router-link = "/multiplayer/join">Enter Game Code</ion-button>
          <spacer/>
          <ion-button expand="block" color="light" router-link = "/session/create">Start New Multiplayer Session</ion-button>
          <ion-button expand="block" color="light" router-link = "/session/join">Enter Multiplayer Session Code</ion-button>
          <ion-button expand="block" color="light" router-link = "/session/reconnect">Reconnect to Session</ion-button>
          <stripe/>
        </div>
      </div>
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

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonButton,
    Stripe,
    Spacer
  },
  mixins: [SoundMixin],
  data() {
    return {
      store: useStore()
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
#container {
  padding: 20px;
  max-width: var(--max-form-width);
  margin-left: auto;
  margin-right: auto;
  color: white;
}

#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
  margin-top: 15vh;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#start_game_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10vh;
}

#start_game_buttons ion-button {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: none;
}
</style>
