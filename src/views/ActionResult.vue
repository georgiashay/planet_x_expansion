<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.gameReady && actionResult !== undefined">
        <div id="title_container">
          <h3>Current Action: {{actionResult.actionName}}</h3>
        </div>
        <p id="upper_text" v-if="actionResult.upperText !== undefined">
          {{actionResult.upperText}}
        </p>
        <p id="advance_text" v-if="actionResult.timeCost !== undefined">
          Advance Player Pawn: {{actionResult.timeCost}}
          <ion-icon :icon="timeOutline" size="small"/>
          {{arrowString}}
        </p>
        <p>{{actionResult.text}}</p>
        <ion-item-divider/>
        <ion-button
          expand="block"
          color="dark"
          @click="continueGame()"
          id="continue_button">
          Continue <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar color="dark">
        <ion-title id="game_code">Game Code: {{ store.state.gameCode }}</ion-title>
        <ion-nav-link id="history_link" router-link="/multiplayer/history">History</ion-nav-link>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonIcon, IonFooter,
        IonToolbar, IonTitle, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";

function isString(obj: any): obj is string {
  return typeof obj === "string";
}

export default defineComponent({
  name: 'ActionResult',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonItemDivider,
    IonNavLink
  },
  mixins: [SoundMixin],
  data() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    return {
      store,
      arrowForwardOutline,
      timeOutline,
      route,
      router
    }
  },
  computed: {
    actionResult: function(): any {
      if (this.route.params.historyIndex === undefined) {
        return undefined;
      } else if (this.route.params.historyIndex !== "") {
        let indexString: string;
        if(isString(this.route.params.historyIndex)) {
          indexString = this.route.params.historyIndex;
        } else {
          indexString = this.route.params.historyIndex[0];
        }
        const historyIndex = parseInt(indexString);
        return this.store.state.history[historyIndex];
      } else {
        return this.store.getters.lastActionResult;
      }
    },
    arrowString: function() {
      let arrows = "";
      for (let i = 0; i < this.actionResult.timeCost; i++) {
        arrows += ">";
      }
      return arrows;
    }
  },
  methods: {
    continueGame: function() {
      if (this.route.params.actionType == "research") {
        const hasDoneResearch = this.store.state.history.filter((actionResult: any) => actionResult.actionType == "research").length > 1;
        if (hasDoneResearch) {
          this.router.push("/multiplayer/gamemenu")
        } else {
          this.router.push("/multiplayer/action/research/reminder");
        }
      } else {
        this.router.push("/multiplayer/gamemenu");
      }
    }
  },
  ionViewDidEnter: function() {
    if (this.store.getters.gameReady && this.actionResult !== undefined) {
      if (this.actionResult.actionType == "locateplanetx") {
        if (this.actionResult.success) {
          this.playCorrect();
        } else {
          this.playIncorrect();
        }
      } else {
        this.playSonar2();
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
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
  margin-top: 25%;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#upper_text {
  margin-bottom: 0px;
}

#advance_text {
  margin-top: 0px;
  display: flex;
  align-items: center;
  align-content: center;
}

#advance_text ion-icon {
  font-size: 1.2em;
}

#continue_button {
  margin-top: 10px;
  text-transform: none;
}

#game_code {
  float:left;
}

#history_link {
  float:right;
  text-decoration: underline;
  margin-right: 20px;
}
</style>
