<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Current Action: {{store.getters.lastActionResult.actionName}}</h3>
        </div>
        <p id="upper_text" v-if="store.getters.lastActionResult.upperText !== undefined">
          {{store.getters.lastActionResult.upperText}}
        </p>
        <p id="advance_text" v-if="store.getters.lastActionResult.timeCost !== undefined">
          Advance Player Pawn: {{store.getters.lastActionResult.timeCost}}<ion-icon :icon="timeOutline" size="small"/>  &gt;&gt;&gt;&gt;&gt;
        </p>
        <p>{{store.getters.lastActionResult.text}}</p>
        <ion-item-divider/>
        <ion-button
          expand="block"
          color="medium"
          @click="continueGame()"
          id="continue_button">
          Continue <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
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
import { SpaceObject } from '@/constants';

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

#upper_text {
  margin-bottom: 0px;
}

#advance_text {
  margin-top: 0px;
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
