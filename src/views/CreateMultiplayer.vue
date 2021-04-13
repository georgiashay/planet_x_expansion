<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="title_container">
        <h3>Multiplayer Game</h3>
      </div>
      <div id="create_game_buttons">

        <p>Select Game Mode:</p>
        <ion-button
          expand="block"
          v-for="gameType in gameTypes"
          :key="gameType.sectors"
          :color="buttonColor(gameType.sectors)"
          @click="selectedGame = (selectedGame == gameType.sectors ? undefined : gameType.sectors)"
          >
          {{gameType.name}} ({{gameType.sectors}} sectors)
        </ion-button>
        <ion-item-divider/>
        <ion-button
          v-if="selectedGame !== undefined"
          expand="block"
          color="medium"
          router-link="/multiplayer/gamecode">
          Start Game
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
    return {
      selectedGame: undefined,
      gameTypes: [
        {
          name: "Standard Mode",
          sectors: 12
        },
        {
          name: "Expert Mode",
          sectors: 18
        },
        {
          name: "Ace Mode",
          sectors: 24
        }
      ],
      arrowForwardOutline
    }
  },
  methods: {
    log: function(text: string) {
      console.log(text);
    },
    buttonColor: function(boardType: number) {
      if (this.selectedGame == boardType) {
        return "light";
      } else {
        return "medium";
      }
    }
  },
});
</script>

<style scoped>
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
  width: 80%;
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
