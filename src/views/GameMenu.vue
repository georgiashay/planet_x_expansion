<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Game Menu</h3>
        </div>
        <div id="action_buttons">
          <ion-button
            expand="block"
            color="medium"
            @click="clickSurvey()">
            Survey (2-4
            <ion-icon :icon="timeOutline" size="small"></ion-icon>
            )
          </ion-button>
          <ion-button
            expand="block"
            color="medium"
            @click="clickTarget()">
            Target (4
            <ion-icon :icon="timeOutline" size="small"></ion-icon>
            )
          </ion-button>
          <ion-button
            expand="block"
            color="medium"
            router-link="/multiplayer/action/research">
            Research (1
            <ion-icon :icon="timeOutline" size="small"></ion-icon>
            )
          </ion-button>
          <ion-button
            expand="block"
            color="medium"
            router-link="/multiplayer/action/locateplanetx">
            Locate Planet X (5
            <ion-icon :icon="timeOutline" size="small"></ion-icon>
            )
          </ion-button>
          <ion-item-divider/>
          <ion-button
            expand="block"
            color="medium"
            router-link="/multiplayer/action/peerreview">
            Peer Review
          </ion-button>
          <ion-button
            expand="block"
            color="medium"
            router-link="/multiplayer/action/planetxconference">
            Planet X Conference
          </ion-button>
          <ion-item-divider/>
          <ion-button
            expand="block"
            color="medium"
            @click="endGame()">
            End Game &amp; Reveal Objects
          </ion-button>
        </div>
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
        IonToolbar, IonTitle, IonNavLink,
        alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'GameMenu',
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
    const router = useRouter();
    return {
      store,
      timeOutline,
      router
    }
  },
  methods: {
    clickSurvey: function() {
      const previousSurveys = this.store.state.history.filter((actionResult: any) => actionResult.actionType === "survey");
      if (previousSurveys.length > 0) {
        this.router.push('/multiplayer/action/survey');
      } else {
        this.router.push('/multiplayer/action/survey/reminder');
      }
    },
    clickTarget: function() {
      const previousTargets = this.store.state.history.filter((actionResult: any) => actionResult.actionType === "target");
      if (previousTargets.length > 0) {
        this.router.push('/multiplayer/action/target');
      } else {
        this.router.push('/multiplayer/action/target/reminder');
      }
    },
    endGame: async function() {
      const alert = await alertController
                      .create({
                        header: 'End Game',
                        // subHeader: 'Subtitle',
                        message: 'Are you sure you want to end the game and reveal the objects in each sector?',
                        buttons: [
                          {
                            text: 'Yes',
                            handler: () => {
                              this.router.push('/multiplayer/endgame');
                            }
                          },
                          {
                            text: 'Cancel',
                            role: 'cancel'
                          }]
                      });
      await alert.present();
      await alert.onDidDismiss();
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

#action_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

#action_buttons ion-button {
  margin-top: 10px;
  margin-bottom: 10px;
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
