<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Multiplayer {{isSession ? "Online " : ""}}Game</h3>
        </div>
        <div id="create_game_buttons">
          <p>Select Game Mode:</p>
          <ion-button
            expand="block"
            v-for="(gameType, sectors) in GAME_TYPES"
            :key="sectors"
            :color="buttonColor(sectors)"
            @click="selectedGame = (selectedGame == sectors ? undefined : sectors)"
            >
            {{gameType.name}} Mode ({{sectors}} sectors)
          </ion-button>
          <div id="enter_name" v-if="isSession">
            <p>Enter Name:</p>
            <ion-item color="dark">
              <ion-input v-model="name"></ion-input>
            </ion-item>
          </div>
          <ion-item-divider/>
          <ion-button
            v-if="readyToCreate"
            expand="block"
            color="dark"
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
        IonButton, IonNavLink, IonIcon,
        IonItem, IonInput } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { GAME_TYPES } from '@/constants';
import SoundMixin from "@/mixins/SoundMixin.ts";

export default defineComponent({
  name: 'CreateGame',
  components: {
    IonContent,
    IonPage,
    IonItemDivider,
    IonButton,
    IonNavLink,
    IonIcon,
    IonItem,
    IonInput
  },
  mixins: [SoundMixin],
  data() {
    const store = useStore();
    const router = useRouter();
    return {
      selectedGame: undefined,
      GAME_TYPES,
      arrowForwardOutline,
      store,
      router,
      name: ""
    }
  },
  props: {
    isSession: {
      required: true,
      type: Boolean
    }
  },
  methods: {
    buttonColor: function(boardType: number) {
      if (this.selectedGame == boardType) {
        return "medium";
      } else {
        return "dark";
      }
    },
    createGame: function() {
      if (this.isSession) {
        this.store.dispatch("createSession", {
          numSectors: this.selectedGame,
          name: this.name
        });
        this.router.push("/session/lobby/wait");
      } else {
        this.store.dispatch("createGame", this.selectedGame);
        this.router.push("/multiplayer/gamecode/new");
      }
    },
    clearSelections: function() {
      this.selectedGame = undefined;
      this.name = undefined;
    }
  },
  computed: {
    readyToCreate: function(): boolean {
      if (this.isSession) {
        return this.selectedGame !== undefined && this.name !== undefined && this.name.length > 0;
      } else {
        return this.selectedGame !== undefined;
      }
    }
  },
  ionViewDidEnter() {
    this.playSonar1();
  },
  ionViewDidLeave() {
    this.clearSelections();
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
