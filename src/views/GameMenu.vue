<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-above="sm"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Game Menu</h3>
        </div>
        <div id="action_buttons">
          <ion-button
            :disabled="!store.getters.actionAllowed('SURVEY')"
            expand="block"
            color="light"
            @click="clickSurvey()">
            Survey ({{store.state.gameType.surveyCost.min}}-{{store.state.gameType.surveyCost.max}}
            <ion-icon :icon="timeOutline"></ion-icon>
            )
          </ion-button>
          <ion-button
            :disabled="!store.getters.actionAllowed('TARGET')"
            expand="block"
            color="light"
            @click="clickTarget()">
            Target ({{store.state.gameType.targetCost}}
            <ion-icon :icon="timeOutline"></ion-icon>
            )
          </ion-button>
          <ion-button
            :disabled="!store.getters.actionAllowed('RESEARCH')"
            expand="block"
            color="light"
            :router-link="'/' + gameType + '/action/research'">
            Research ({{store.state.gameType.researchCost}}
            <ion-icon :icon="timeOutline"></ion-icon>
            )
          </ion-button>
          <ion-button
            :disabled="!store.getters.actionAllowed('LOCATE_PLANET_X')"
            expand="block"
            color="light"
            :router-link="'/' + gameType + '/action/locateplanetx'">
            Locate Planet X ({{store.state.gameType.locatePlanetXCost}}
            <ion-icon :icon="timeOutline"></ion-icon>
            )
          </ion-button>
          <stripe/>
          <ion-button
            v-if="store.state.isSession"
            :disabled="!store.getters.actionAllowed('THEORY')"
            expand="block"
            color="light"
            :router-link="'/' + gameType + '/action/submittheories'">
            Submit Theories
          </ion-button>
          <ion-button
            v-if="!store.state.isSession"
            expand="block"
            color="light"
            :router-link="'/' + gameType + '/action/peerreview'">
            Peer Review
          </ion-button>
          <ion-button
            :disabled="!store.getters.actionAllowed('CONFERENCE')"
            expand="block"
            color="light"
            :router-link="'/' + gameType + '/action/planetxconference'">
            Planet X Conference
          </ion-button>
          <stripe/>
          <ion-button
            v-if="store.state.isSession && screenSizeLessThan('md')"
            expand="block"
            color="light"
            router-link="/session/board">
            View Board
          </ion-button>
          <ion-button
            v-if="store.state.isSession && screenSizeLessThan('md')"
            expand="block"
            color="light"
            router-link="/session/logic">
            View Logic Sheet
          </ion-button>
          <ion-button
            v-if="store.state.isSession"
            :disabled="store.getters.uniqueRevealedTheories.length === 0"
            expand="block"
            color="light"
            @click="showRevealedTheories()">
            Show Revealed Theories
          </ion-button>
          <ion-button
            :disabled="!store.getters.actionAllowed('END_GAME')"
            expand="block"
            color="light"
            @click="endGame()">
            End Game &amp; Reveal Objects
          </ion-button>
        </div>
      </div>
    </ion-content>
    <game-footer hide-above="sm"/>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent,
        IonButton, IonIcon, alertController,
        popoverController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import RevealedTheoriesPopover from "@/components/RevealedTheoriesPopover.vue";
import ScreenSize from "@/mixins/ScreenSize.ts";
import Stripe from "@/components/Stripe.vue";

export default defineComponent({
  name: 'GameMenu',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    Stripe,
    GameFooter,
    SessionHeader
  },
  mixins: [SoundMixin, ScreenSize],
  props: {
    gameType: {
      required: true,
      type: String
    }
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
      // Display reminder on first survey
      const previousSurveys = this.store.state.history.filter((actionResult: any) => actionResult.actionType === "survey");
      if (previousSurveys.length > 0) {
        this.router.push('/' + this.gameType + '/action/survey');
      } else {
        this.router.push('/' + this.gameType + '/action/survey/reminder');
      }
    },
    clickTarget: function() {
      // Display reminder on first target
      const previousTargets = this.store.state.history.filter((actionResult: any) => actionResult.actionType === "target");
      if (previousTargets.length > 0) {
        this.router.push('/' + this.gameType + '/action/target');
      } else {
        this.router.push('/' + this.gameType + '/action/target/reminder');
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
                              this.router.push('/' + this.gameType + '/endgame');
                            }
                          }],
                          cssClass: "custom-alert"
                      });
      await alert.present();
      await alert.onDidDismiss();
    },
    showRevealedTheories: async function() {
      const popover = await popoverController
        .create({
          component: RevealedTheoriesPopover,
          componentProps: {
            revealedTheories: this.store.getters.uniqueRevealedTheories
          },
          cssClass: "custom-popover"
        });
      await popover.present();
      await popover.onDidDismiss();
    }
  },
  computed: {
    newlyRevealedTheories(): Array<any> {
      return this.store.state.newlyRevealedTheories;
    }
  },
  watch: {
    async newlyRevealedTheories(revealedTheories) {
      if (revealedTheories.length) {
        const popover = await popoverController
          .create({
            component: RevealedTheoriesPopover,
            componentProps: {
              revealedTheories: revealedTheories
            },
            cssClass: "custom-popover"
          });
        await popover.present();
        await popover.onDidDismiss();
      }
    }
  }
});
</script>

<style scoped>
#container {
  padding: 20px;
  max-width: var(--max-form-width);
  margin-left: auto;
  margin-right: auto;
  color: white;
}

#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#action_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10vh;
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
