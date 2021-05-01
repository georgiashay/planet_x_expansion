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
            color="dark"
            @click="clickSurvey()">
            Survey ({{store.state.gameType.surveyCost.min}}-{{store.state.gameType.surveyCost.max}}
            <ion-icon :icon="timeOutline"></ion-icon>
            )
          </ion-button>
          <ion-button
            expand="block"
            color="dark"
            @click="clickTarget()">
            Target ({{store.state.gameType.targetCost}}
            <ion-icon :icon="timeOutline"></ion-icon>
            )
          </ion-button>
          <ion-button
            expand="block"
            color="dark"
            router-link="/multiplayer/action/research">
            Research ({{store.state.gameType.researchCost}}
            <ion-icon :icon="timeOutline"></ion-icon>
            )
          </ion-button>
          <ion-button
            expand="block"
            color="dark"
            router-link="/multiplayer/action/locateplanetx">
            Locate Planet X ({{store.state.gameType.locatePlanetXCost}}
            <ion-icon :icon="timeOutline"></ion-icon>
            )
          </ion-button>
          <ion-item-divider/>
          <ion-button
            expand="block"
            color="dark"
            router-link="/multiplayer/action/peerreview">
            Peer Review
          </ion-button>
          <ion-button
            expand="block"
            color="dark"
            router-link="/multiplayer/action/planetxconference">
            Planet X Conference
          </ion-button>
          <ion-item-divider/>
          <ion-button
            expand="block"
            color="dark"
            @click="endGame()">
            End Game &amp; Reveal Objects
          </ion-button>
        </div>
      </div>
    </ion-content>
    <game-footer/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonIcon, alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";

export default defineComponent({
  name: 'GameMenu',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonItemDivider,
    GameFooter
  },
  mixins: [SoundMixin],
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
      // Display reminder on first survey
      const previousSurveys = this.store.state.history.filter((actionResult: any) => actionResult.actionType === "survey");
      if (previousSurveys.length > 0) {
        this.router.push('/multiplayer/action/survey');
      } else {
        this.router.push('/multiplayer/action/survey/reminder');
      }
    },
    clickTarget: function() {
      // Display reminder on first target
      const previousTargets = this.store.state.history.filter((actionResult: any) => actionResult.actionType === "target");
      if (previousTargets.length > 0) {
        this.router.push('/multiplayer/action/target');
      } else {
        this.router.push('/multiplayer/action/target/reminder');
      }
    },
    endGame: async function() {
      // Ensure user actually wants to end game
      const alert = await alertController
                      .create({
                        header: 'End Game',
                        message: 'Are you sure you want to end the game and reveal the objects in each sector?',
                        buttons: [
                          {
                            text: 'Cancel',
                            role: 'cancel'
                          },
                          {
                            text: 'Yes',
                            handler: () => {
                              this.router.push('/multiplayer/endgame');
                            }
                          }],
                          cssClass: "custom-alert"
                      });
      await alert.present();
      await alert.onDidDismiss();
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
  display: flex;
  align-items: center;
  align-content: center;
}

#action_buttons ion-button ion-icon {
  font-size: 1.2em;
}
</style>
