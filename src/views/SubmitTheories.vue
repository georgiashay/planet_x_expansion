<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container :style="{'--use-spacer': 0}" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Submit Theories</h3>
        </div>
        <div id="theory_selections">
          <ion-item color="light">
            <ion-label position="floating">Number of Theories</ion-label>
            <ion-input v-model="numTheories" type="number" min="0" :max="maxTheories"></ion-input>
          </ion-item>
          <spacer/>
          <template v-for="(theory, i) in theories.slice(0, numTheories)" :key="i">
            <ion-item-divider v-if="i>0"/>
            <sector-select
              :label="'Sector: '"
              :value="theory.sector"
              @input="theory.sector = $event;"
              :columns="6"/>
            <space-object-select
              :label ="'Space Object: '"
              :value="theory.spaceObject"
              @input="theory.spaceObject = $event;"
              :exclude-objects="['PLANET_X', 'EMPTY']"
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
                class="theory_token"
                :style="playerStyle(store.getters.playerInfo.color)">
                <div class="inner_token">
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
                {{theory.sector+1}}:&nbsp;<ion-icon :src="initialToSpaceObject[theory.spaceObject.initial].icon"></ion-icon>
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
import { SpaceObject } from '@/constants';
import SpaceObjectSelect from '@/components/SpaceObjectSelect.vue';
import SectorSelect from '@/components/SectorSelect.vue';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import Spacer from "@/components/Spacer.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";
import { initialToSpaceObject } from "@/constants.ts";
import PlayerColors from "@/mixins/PlayerColors.ts";

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
    SpaceObjectSelect,
    SectorSelect,
    GameFooter,
    SessionHeader,
    IonInput,
    IonItem,
    IonLabel,
    AdaptableContainer,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol
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
      SpaceObject,
      numTheories: 0,
      theories: [],
      router,
      initialToSpaceObject
    }
  },
  computed: {
    maxTheories: function(): number {
      if (this.store.getters.myNextAction == null) {
        return 0;
      } else if (this.store.getters.myNextAction.actionType === "THEORY_PHASE") {
        return this.store.state.gameType.theoriesPerTurn;
      } else if (this.store.getters.myNextAction.actionType === "LAST_ACTION"){
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
      delete tokensLeft.X;
      delete tokensLeft.E;
      for (let i = 0; i < existingTheories.length; i++) {
        const theory = existingTheories[i];
        tokensLeft[theory.spaceObject.initial] -= 1;
      }

      return tokensLeft;
    },
    tokenGrid: function(): Array<Array<any>> {
      const tokens = [];
      for (const initial of this.store.state.gameType.logicSheetOrder) {
        if (initial in this.tokensLeft) {
          const obj = initialToSpaceObject[initial];
          for (let i = 0; i < this.tokensLeft[initial]; i++) {
            tokens.push(obj);
          }
        }
      }

      const grid: Array<Array<any>> = [[]];
      for (let i = 0; i < tokens.length; i++) {
        grid[grid.length-1].push(tokens[i]);
        if (grid[grid.length - 1].length === 6) {
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

        if (objectDefined) {
          tokensLeft[this.theories[i].spaceObject.initial] -= 1;
        }

        if (objectDefined && tokensLeft[this.theories[i].spaceObject.initial] < 0) {
          return {
            valid: false,
            message: "You do not have enough " + this.theories[i].spaceObject.name + " theory tokens left."
          }
        }

        if (sectorDefined && revealedSectors.has(this.theories[i].sector-1)) {
          return {
            valid: false,
            message: "You cannot submit a theory for sector " + this.theories[i].sector + " - it has already been revealed."
          }
        }

        if (sectorDefined && sectors.has(this.theories[i].sector)) {
          return {
            valid: false,
            message: "You cannot submit multiple theories for sector " + this.theories[i].sector + " in the same turn."
          }
        }

        if (sectorDefined) {
          sectors.add(this.theories[i].sector);
        }

        if (objectDefined && sectorDefined && existingTheories.some((t: any) => t.spaceObject.initial === this.theories[i].spaceObject.initial && t.sector === this.theories[i].sector - 1)) {
          return {
            valid: false,
            message: "You already submitted the theory that sector " + this.theories[i].sector + " is " + this.theories[i].spaceObject.one + "."
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
      this.store.dispatch('submitTheories', this.theories.slice(0, this.numTheories));
      this.router.push('/' + this.gameType + '/gamemenu');
    },
    clearSelections: function() {
      this.numTheories = 0;
      this.theories = Array.from(Array(this.maxTheories)).map(() => {return {};});
    }
  },
  watch: {
    numTheories: function(newNumTheories) {
      const intTheories = parseInt(newNumTheories);
      if (!isNaN(intTheories)) {
        if(intTheories > this.maxTheories) {
          this.numTheories = this.maxTheories;
        } else if (intTheories < 0) {
          this.numTheories = 0;
        } else {
          this.numTheories = intTheories;
        }
      }
    }
  },
  ionViewWillEnter() {
    this.clearSelections();
  },
  ionViewDidEnter() {
    this.playSound("sonar1");
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

td.theory_token {
  width: 16%;
  background-color: var(--player-color);
  border: 1px solid var(--ion-color-light);
  margin: 0.2em;
  align-items: center;
  text-align: center;
  padding-top: 8%;
  padding-bottom: 8%;
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
