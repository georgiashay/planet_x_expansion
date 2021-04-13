<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Game Code</h3>
        </div>
        <div>
          <p v-if="isGameCreator">Your game has been created. Please have the other players enter the following game code:</p>
          <p v-else>You have joined the game. Please double-check that the game code is the same as the one created for this game.</p>
        </div>
        <div id="game_code">
          <h1>{{store.state.gameCode || "Loading..."}}</h1>
          <p>{{gameModeName}}</p>
        </div>
        <div>
          <p v-if="isGameCreator">Verify that all player devices are using the game code, and then press the Continue button below to start.</p>
        </div>
        <ion-item-divider/>
        <ion-button
          expand="block"
          color="medium"
          router-link="/multiplayer/chooseview">
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
import { GAME_TYPES } from '@/constants';

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
  data() {
    const store = useStore();
    const isGameCreator = true;
    return {
      store,
      isGameCreator,
      arrowForwardOutline,
      gameTypes: GAME_TYPES
    }
  },
  computed: {
    gameModeName() {
      if (this.store.state.game === undefined) {
        return "";
      } else {
        const boardSize: number = this.store.state.game.board.size;
        return GAME_TYPES[boardSize!] + " Mode (" + boardSize + " sectors)";
      }
    }
  }
});
</script>

<style scoped>
#container {
  padding: 20px;
}

#title_container {
  font-family: sans-serif;
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

#create_game_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

#create_game_buttons ion-button {
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
