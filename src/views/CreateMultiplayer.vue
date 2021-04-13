<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Multiplayer Game</h3>
        </div>
        <div id="create_game_buttons">

          <p>Select Game Mode:</p>
          <ion-button
            expand="block"
            v-for="(name, sectors) in GAME_TYPES"
            :key="sectors"
            :color="buttonColor(sectors)"
            @click="selectedGame = (selectedGame == sectors ? undefined : sectors)"
            >
            {{name}} Mode ({{sectors}} sectors)
          </ion-button>
          <ion-item-divider/>
          <ion-button
            v-if="selectedGame !== undefined"
            expand="block"
            color="medium"
            @click="createGame()">
            Start Game
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </ion-button>
          <div id="cancel_container">
            <ion-nav-link router-link="/home">Cancel</ion-nav-link>
          </div>
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
import { useRouter } from 'vue-router';
import { GAME_TYPES } from '@/constants';

export default defineComponent({
  name: 'CreateMultiplayer',
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
    const router = useRouter();
    return {
      selectedGame: undefined,
      GAME_TYPES,
      arrowForwardOutline,
      store,
      router
    }
  },
  methods: {
    buttonColor: function(boardType: number) {
      if (this.selectedGame == boardType) {
        return "light";
      } else {
        return "medium";
      }
    },
    createGame: function() {
      this.store.dispatch("createGame", this.selectedGame);
      this.selectedGame = undefined;
      this.router.push("/multiplayer/gamecode/new");
    }
  },
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
