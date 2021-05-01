<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Game Code</h3>
        </div>
        <div>
          <p v-if="gameCreator">Your game has been created. Please have the other players enter the following game code:</p>
          <p v-else>You have joined the game. Please double-check that the game code is the same as the one created for this game.</p>
        </div>
        <div id="game_code">
          <h1>{{store.state.gameCode || "Loading..."}}</h1>
          <p>{{gameModeName}}</p>
        </div>
        <div>
          <p v-if="gameCreator">Verify that all player devices are using the game code, and then press the continue button below to start.</p>
        </div>
        <ion-item-divider/>
        <ion-button
          expand="block"
          color="dark"
          router-link="/multiplayer/chooseview"
          id="continue_button">
          Continue
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <div id="cancel_container">
          <ion-nav-link router-link="/home">Cancel</ion-nav-link>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonNavLink, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";

export default defineComponent({
  name: 'GameCode',
  components: {
    IonContent,
    IonPage,
    IonItemDivider,
    IonButton,
    IonNavLink,
    IonIcon
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
         this.store.state.gameType.sectors + " sectors)";
      }
    }
  },
  ionViewDidEnter() {
    this.playSonar1();
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
