<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container v-if="store.getters.gameReady && actionResult !== undefined">
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
        <stripe/>
        <ion-button
          expand="block"
          color="light"
          @click="continueGame()"
          id="continue_button">
          Continue <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
      </adaptable-container>
    </ion-content>
    <game-footer hide-at="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

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
    Stripe,
    GameFooter,
    SessionHeader,
    AdaptableContainer
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
        // Get history index from string
        let indexString: string;
        if(isString(this.route.params.historyIndex)) {
          indexString = this.route.params.historyIndex;
        } else {
          indexString = this.route.params.historyIndex[0];
        }
        const historyIndex = parseInt(indexString);
        // Use action result at that index in history
        return this.store.state.history[historyIndex];
      } else {
        // No history index provided, use last action result
        return this.store.getters.lastActionResult;
      }
    },
    arrowString: function() {
      // Get number of arrows corresponding to the time cost of this action
      let arrows = "";
      for (let i = 0; i < this.actionResult.timeCost; i++) {
        arrows += ">";
      }
      return arrows;
    }
  },
  methods: {
    continueGame: function() {
      if (this.route.params.historyIndex !== "") {
        this.router.push("/" + this.gameType + "/history");
      } else {
        if (this.route.params.actionType == "research") {
          const hasDoneResearch = this.store.state.history.filter((actionResult: any) => actionResult.actionType == "RESEARCH").length > 1;
          if (hasDoneResearch || !this.store.state.settings.reminders) {
            // Done research before, go straight to game menu
            this.router.push("/" + this.gameType + "/gamemenu")
          } else {
            // Never done research, display reminder
            this.router.push("/" + this.gameType + "/action/research/reminder");
          }
        } else {
          // Not a research action, go back to game menu
          this.router.push("/" + this.gameType + "/gamemenu");
        }
      }
    }
  },
  ionViewDidEnter: function() {
    if (this.store.getters.gameReady && this.actionResult !== undefined) {
      if (this.actionResult.actionType == "LOCATE_PLANET_X") {
        if (this.actionResult.success) {
          // Play correct sound when planet x is located
          this.playSound("correct");
        } else {
          // Play incorrect sound if it is not located
          this.playSound("incorrect");
        }
      } else {
        // Play sonar ping if it's not a planet x action
        this.playSound("result");
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
  margin-bottom: 2em;
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
</style>
