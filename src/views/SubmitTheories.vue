<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container :style="{'--use-spacer': 0}" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Submit Theories</h3>
        </div>
        <div id="theory_selections">
          <increment-input :value="numTheories" @input="numTheories = $event" :min="0" :max="maxTheories" label="Number of Theories"></increment-input>
          <spacer/>
          <template v-for="(theory, i) in theories.slice(0, numTheories)" :key="i">
            <ion-item-divider v-if="i>0"/>
            <sector-select
              :label="SECTOR_NAME.proper + ': '"
              :value="theory.sector"
              @input="theory.sector = $event;"
              :columns="6"/>
            <sector-element-select
              :label ="THEME_NAME.proper + ' ' + OBJECT_NAME.proper + ': '"
              :value="theory.spaceObject"
              @input="theory.spaceObject = $event;"
              :exclude-objects="[GOAL_OBJECT, EMPTY_OBJECT]"
              :columns="3"
              :show-name="false"/>
          </template>
        </div>
        <ion-button
          expand="block"
          color="light"
          @click="submitTheories()"
          id="theory_button"
          :disabled="!theoriesReady || !theoriesValid.valid">
          Submit Theories
        </ion-button>
        <p id="invalid_theories" v-if="!theoriesValid.valid">{{theoriesValid.message}}</p>
        <stripe/>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/' + gameType + '/gamemenu'">Cancel</ion-nav-link>
        </div>
        <div id="previous">
          <p>Theory Tokens Remaining</p>
          <table>
            <tr v-for="(row, i) in tokenGrid" :key="i">
              <td
                v-for="(obj, j) in row"
                :key="j"
                :class="obj !== null ? 'theory_token' : 'empty_token'"
                :style="playerStyle(store.getters.playerInfo.color)"
                @click="clickTheoryToken(obj)">
                <div class="inner_token" v-if="obj !== null">
                  <ion-icon :src="obj.icon"></ion-icon>
                </div>
              </td>
            </tr>
          </table>
          <p>Previously Submitted Theories</p>
          <ion-grid>
            <ion-row>
              <ion-col
                v-for="(theory, index) in submittedTheories"
                :key="index"
                size="2"
                class="previous_theory">
                {{theory.sector+1}}:&nbsp;<ion-icon :src="initialToSectorElement[theory.spaceObject.initial].icon"></ion-icon>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </adaptable-container>
    </ion-content>
    <game-footer hide-at="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonNavLink,
        IonInput, IonItem, IonLabel,
        IonIcon, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SectorElement, SECTOR_NAME, THEME_NAME, OBJECT_NAME, GOAL_OBJECT, EMPTY_OBJECT } from '@/constants';
import SectorElementSelect from '@/components/SectorElementSelect.vue';
import SectorSelect from '@/components/SectorSelect.vue';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import Spacer from "@/components/Spacer.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";
import { initialToSectorElement } from "@/constants.ts";
import PlayerColors from "@/mixins/PlayerColors.ts";
import IncrementInput from "@/components/IncrementInput.vue";

export default defineComponent({
  name: 'Survey',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItemDivider,
    Spacer,
    Stripe,
    IonNavLink,
    SectorElementSelect,
    SectorSelect,
    GameFooter,
    SessionHeader,
    AdaptableContainer,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IncrementInput
  },
  mixins: [SoundMixin, PlayerColors],
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
      arrowForwardOutline,
      timeOutline,
      SectorElement,
      numTheories: 0,
      theories: [],
      router,
      initialToSectorElement,
      theoryToggle: 0,
      SECTOR_NAME,
      THEME_NAME,
      OBJECT_NAME,
      GOAL_OBJECT,
      EMPTY_OBJECT
    }
  },
  computed: {
    maxTheories: function(): number {
      if (this.store.getters.myNextAction == null) {
        // If I don't need to submit theories, I shouldn't be able to submit any
        return 0;
      } else if (this.store.getters.myNextAction.actionType === "THEORY_PHASE") {
        // If it's a normal theory phases, max is usual number of theories
        return this.store.state.gameType.theoriesPerTurn;
      } else if (this.store.getters.myNextAction.actionType === "LAST_ACTION") {
        // If it's the last action, the number of theories depends on how many
        // sectors behind I am
        if (this.store.getters.sectorsBehind <= 3) {
          return 1;
        } else {
          return 2;
        }
      } else {
        return 0;
      }
    },
    theoriesReady: function(): boolean {
      for (let i = 0; i < this.numTheories; i++) {
        if (this.theories[i].spaceObject === undefined || this.theories[i].sector === undefined) {
          return false;
        }
      }
      return true;
    },
    tokensLeft: function(): any {
      const numObjects = this.store.state.game.board.numObjects;
      const existingTheories = this.store.state.session.theories.filter((theory: any) => theory.playerID === this.store.state.playerID);

      const tokensLeft = Object.assign({}, numObjects);
      delete tokensLeft[GOAL_OBJECT.initial];
      delete tokensLeft[EMPTY_OBJECT.initial];
      for (let i = 0; i < existingTheories.length; i++) {
        const theory = existingTheories[i];
        tokensLeft[theory.spaceObject.initial] -= 1;
      }

      return tokensLeft;
    },
    tokenGrid: function(): Array<Array<any>> {
      // Create grid with 8 columns of tokens left
      const tokens = [];
      for (const initial of this.store.state.gameType.logicSheetOrder) {
        if (initial in this.tokensLeft) {
          const obj = initialToSectorElement[initial];
          for (let i = 0; i < this.tokensLeft[initial]; i++) {
            tokens.push(obj);
          }
        }
      }

      const grid: Array<Array<any>> = [[]];
      for (let i = 0; i < tokens.length; i++) {
        grid[grid.length-1].push(tokens[i]);
        if (i === tokens.length - 1) {
          const emptyTokens = 8 - grid[grid.length-1].length;
          for (let j = 0; j < emptyTokens; j++) {
            grid[grid.length-1].push(null);
          }
        } else if (grid[grid.length - 1].length === 8) {
          grid.push([]);
        }
      }
      return grid;
    },
    submittedTheories: function(): Array<any> {
      return this.store.state.session.theories.filter((theory: any) => theory.playerID === this.store.state.playerID);
    },
    theoriesValid: function(): any {
      const existingTheories = this.store.state.session.theories.filter((theory: any) => theory.playerID === this.store.state.playerID);

      const tokensLeft = Object.assign({}, this.tokensLeft);

      const revealedSectors = new Set(this.store.getters.revealedTheories.filter((theory: any) => theory.accurate).map((theory: any) => theory.sector));
      const sectors = new Set();

      for (let i = 0; i < this.numTheories; i++) {
        const objectDefined = this.theories[i].spaceObject !== undefined;
        const sectorDefined = this.theories[i].sector !== undefined;

        // Decrease tokens left
        if (objectDefined) {
          tokensLeft[this.theories[i].spaceObject.initial] -= 1;
        }

        // If this would put tokens left at a negative number, it's invalid
        if (objectDefined && tokensLeft[this.theories[i].spaceObject.initial] < 0) {
          return {
            valid: false,
            message: "You do not have enough " + this.theories[i].spaceObject.name + " theory tokens left."
          }
        }

        // If the sector has already been revealed, you can't submit a theory for it
        if (sectorDefined && revealedSectors.has(this.theories[i].sector)) {
          return {
            valid: false,
            message: "You cannot submit a theory for " + SECTOR_NAME.name + " " + (this.theories[i].sector+1) + " - it has already been revealed."
          }
        }

        // If one of the other theories you're trying to submit is also in this
        // sector, you aren't allowed to submit it
        if (sectorDefined && sectors.has(this.theories[i].sector)) {
          return {
            valid: false,
            message: "You cannot submit multiple theories for " + SECTOR_NAME.name + " " + (this.theories[i].sector+1) + " in the same turn."
          }
        }

        // Add this sector to the list of sectors for the theories you are
        // trying to submit this turn
        if (sectorDefined) {
          sectors.add(this.theories[i].sector);
        }

        // If you've submitted this exact theory before, you can't submit it
        // again
        if (objectDefined && sectorDefined && existingTheories.some((t: any) => t.spaceObject.initial === this.theories[i].spaceObject.initial && t.sector === this.theories[i].sector)) {
          return {
            valid: false,
            message: "You already submitted the theory that " + SECTOR_NAME.name + " " + (this.theories[i].sector+1) + " is " + this.theories[i].spaceObject.one + "."
          }
        }
      }

      return {
        valid: true,
        message: ""
      }
    }
  },
  methods: {
    submitTheories: function() {
      this.store.dispatch('submitTheories', { theories: this.theories.slice(0, this.numTheories) });
      this.router.push('/' + this.gameType + '/gamemenu');
    },
    clearSelections: function() {
      this.numTheories = 0;
      this.theories = Array.from(Array(this.maxTheories)).map(() => {return {};});
    },
    theoryTokenSlot: function(): number {
      // Which theory slot to put a space object you click on it

      // First, try to choose the first theory that doesn't have a space object
      for (let i = 0; i < this.numTheories; i++) {
        if (this.theories[i].spaceObject === undefined) {
          return i;
        }
      }

      // Then, choose the first theory that doesn't have a sector
      for (let i = 0; i < this.numTheories; i++) {
        if (this.theories[i].sector === undefined) {
          return i;
        }
      }

      // Then, toggle between all the theories in a loop
      if (this.numTheories > 0) {
        const slot = this.theoryToggle % this.numTheories;
        this.theoryToggle++;
        this.theoryToggle %= this.numTheories;
        return slot;
      } else {
        return NaN;
      }
    },
    clickTheoryToken: function(obj: any) {
      if (obj !== null) {
        const slot = this.theoryTokenSlot();
        if (slot < this.numTheories) {
          this.theories[slot].spaceObject = obj;
        }
      }
    }
  },
  ionViewWillEnter() {
    this.clearSelections();
  },
  ionViewDidEnter() {
    this.playSound("page_transition");
  },
  ionViewDidLeave() {
    this.clearSelections();
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

#theory_selections {
  margin-top: 20px;
}

#theory_button {
  margin-top: 10px;
  text-transform: none;
}

#theory_button ion-icon {
  font-size: 1.2em;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
  margin-bottom: 2em;
}

#invalid_theories {
  text-align: center;
}

table {
  width: 100%;
  margin: 0 auto;
  border-spacing: 10px;
}

td.empty_token {
  width: 12.5%;
  border: none;
}

td.theory_token {
  width: 12.5%;
  background-color: var(--player-color);
  border: 1px solid var(--ion-color-light);
  margin: 0.2em;
  align-items: center;
  text-align: center;
  padding-top: 6.25%;
  padding-bottom: 6.25%;
  position: relative;
}

td.theory_token .inner_token {
  width: 75%;
  height: 75%;
  background-color: solid var(--player-color);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--ion-color-light);
  color: var(--ion-color-light-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
}

td.theory_token ion-icon {
  font-size: 2em;
}

.previous_theory {
  justify-content: center;
  align-items: center;
  display: flex;
}

.previous_theory ion-icon {
  font-size: 1.2em;
}
</style>
