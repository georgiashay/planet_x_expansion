<template>
  <ion-page>
    <ion-content>
      <adaptable-container>
        <div id="title_container">
          <h3>{{isSession ? "Online" : "Offline"}} Game</h3>
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
            {{gameType.name}} Mode ({{sectors}} {{SECTOR_NAME.plural}})
          </ion-button>
          <div id="enter_name" v-if="isSession">
            <p>Enter Name:</p>
            <ion-item color="light">
              <ion-input v-model="name" maxlength="12"></ion-input>
            </ion-item>
          </div>
          <stripe/>
          <ion-button
            v-if="readyToCreate"
            expand="block"
            color="light"
            @click="createGame()">
            Start Game
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </ion-button>
          <div id="cancel_container">
            <ion-nav-link router-link="/home">Cancel</ion-nav-link>
          </div>
        </div>
      </adaptable-container>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonNavLink, IonIcon,
        IonItem, IonInput } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { GAME_TYPES, SECTOR_NAME } from '@/constants';
import SoundMixin from "@/mixins/SoundMixin.ts";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

export default defineComponent({
  name: 'CreateGame',
  components: {
    IonContent,
    IonPage,
    Stripe,
    IonButton,
    IonNavLink,
    IonIcon,
    IonItem,
    IonInput,
    AdaptableContainer
  },
  mixins: [SoundMixin],
  data() {
    const store = useStore();
    const router = useRouter();
    return {
      selectedGame: undefined,
      GAME_TYPES,
      SECTOR_NAME,
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
        return "light";
      }
    },
    createGame: function() {
      if (this.isSession) {
        this.store.dispatch("createSession", {
          numSectors: this.selectedGame,
          name: this.name
        }).then(() => {
          this.router.push("/session/lobby/" + this.store.state.sessionCode);
        });
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
    this.playSound("sonar1");
  },
  ionViewWillLeave() {
    this.clearSelections();
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

#create_game_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2em;
  max-width: var(--max-form-width);
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
