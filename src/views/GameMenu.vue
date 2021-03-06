<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <centered-container v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Game Menu</h3>
        </div>
        <modal v-if="showAllTheories" @close="showAllTheories = false;">
          <template v-slot:header>
            <h3 class="theories-header">Revealed Theories</h3>
          </template>
          <template v-slot:body>
            <revealed-theories :revealed-theories="store.getters.uniqueRevealedTheories" @close="showAllTheories = false"/>
          </template>
        </modal>
        <modal v-if="showNewTheories" @close="showNewTheories = false;">
          <template v-slot:header>
            <h3 class="theories-header">Revealed Theories</h3>
          </template>
          <template v-slot:body>
            <revealed-theories :revealed-theories="newlyRevealedTheories" @close="showNewTheories = false"/>
          </template>
        </modal>
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
            Locate {{capitalize(GOAL_OBJECT.the)}} ({{store.state.gameType.locatePlanetXCost}}
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
            {{GOAL_OBJECT.proper}} {{CONFERENCE_NAME.proper}}
          </ion-button>
          <stripe/>
          <ion-button
            v-if="store.state.isSession && !matchMedia.md"
            expand="block"
            color="light"
            router-link="/session/board">
            View Board
          </ion-button>
          <ion-button
            v-if="store.state.isSession && !matchMedia.md"
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
      </centered-container>
    </ion-content>
    <game-footer hide-at="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent,
        IonButton, IonIcon, alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import RevealedTheories from "@/components/RevealedTheories.vue";
import Stripe from "@/components/Stripe.vue";
import { useMatchMedia } from '@cwist/vue-match-media';
import CenteredContainer from "@/components/CenteredContainer.vue";
import Modal from "@/components/Modal.vue";
import { GOAL_OBJECT, SECTOR_NAME, CONFERENCE_NAME } from "@/constants.ts";
import { capitalize } from "@/utilities/stringUtils.ts";

export default defineComponent({
  name: 'GameMenu',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    Stripe,
    GameFooter,
    SessionHeader,
    CenteredContainer,
    Modal,
    RevealedTheories
  },
  mixins: [SoundMixin],
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
      router,
      GOAL_OBJECT,
      CONFERENCE_NAME,
      capitalize,
      matchMedia: useMatchMedia(),
      showAllTheories: false,
      showNewTheories: false
    }
  },
  methods: {
    clickSurvey: function() {
      // Display reminder on first survey
      const previousSurveys = this.store.state.history.filter((actionResult: any) => actionResult.actionType === "survey");
      if (previousSurveys.length > 0 || !this.store.state.settings.reminders) {
        this.router.push('/' + this.gameType + '/action/survey');
      } else {
        this.router.push('/' + this.gameType + '/action/survey/reminder');
      }
    },
    clickTarget: function() {
      // Display reminder on first target
      const previousTargets = this.store.state.history.filter((actionResult: any) => actionResult.actionType === "target");
      if (previousTargets.length > 0 || !this.store.state.settings.reminders) {
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
                        message: 'Are you sure you want to end the game and reveal the objects in each ' + SECTOR_NAME.name + '?',
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
      this.showAllTheories = true;
    }
  },
  computed: {
    newlyRevealedTheories(): Array<any> {
      return this.store.state.newlyRevealedTheories;
    }
  },
  watch: {
    newlyRevealedTheories(revealedTheories) {
      if (revealedTheories.length) {
        this.showNewTheories = true;
      }
    }
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

#action_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2em;
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

.theories-header {
  text-align: center;
  font-weight: 100;
  margin-bottom: 0;
}
</style>
