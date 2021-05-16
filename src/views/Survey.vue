<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Survey</h3>
        </div>
        <div id="time_cost">
          <p>Time cost varies by the selected range.</p>
          <table id="time_table">
            <tr v-for="(row, index) in timeCostOptions" :key="index">
              <td v-for="costOption in row" :key="costOption.cost">
                <div class="tc_cell">
                  {{costOption.sectors.join(", ")}} sectors <ion-icon :icon="arrowForwardOutline"/>&nbsp;{{costOption.cost}} <ion-icon :icon="timeOutline"/>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div id="survey_selections">
          <space-object-select
            :label ="'Survey for:'"
            :value="surveyObject"
            @input="surveyObject = $event; validateSelections()"
            :exclude-objects="['PLANET_X']"
            :columns="3"
            :show-name="false"/>
          <sector-multi-select
            :label="'In sectors:'"
            :value="[startSector, endSector]"
            @input="startSector = $event[0]; endSector = $event[1]; validateSelections()"
            :allowed-sectors="availableSectors"
            :number-only="true"
            :columns="6"/>
        </div>
        <ion-button
          expand="block"
          color="light"
          @click="survey()"
          id="survey_button"
          :disabled="!surveyReady">
          Survey
            <template v-if="sectorsValid">({{timeCost}} <ion-icon :icon="timeOutline"/>)</template>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <stripe/>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/' + gameType + '/gamemenu'">Cancel</ion-nav-link>
        </div>
      </div>
    </ion-content>
    <game-footer hide-at="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonIcon, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SpaceObject } from '@/constants';
import SpaceObjectSelect from '@/components/SpaceObjectSelect.vue';
import SectorMultiSelect from '@/components/SectorMultiSelect.vue';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";

export default defineComponent({
  name: 'Survey',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    Stripe,
    IonNavLink,
    SpaceObjectSelect,
    SectorMultiSelect,
    GameFooter,
    SessionHeader
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
      arrowForwardOutline,
      timeOutline,
      SpaceObject,
      surveyObject: undefined,
      startSector: undefined,
      endSector: undefined,
      router,
    }
  },
  computed: {
    availableSectors: function(): Array<number> {
      const primeSectors = [2, 3, 5, 7, 11, 13, 17, 19, 23];
      // Which sectors are available to survey depend on the object being surveyed
      if (this.store.state.isSession) {
        if (this.surveyObject?.initial == SpaceObject.COMET.initial) {
          // Comets can only be in prime sectors
          return this.store.getters.skySectors.map((s: number) => s + 1)
            .filter((s: number) => primeSectors.indexOf(s) >= 0);
        } else {
          // Otherwise all sectors in the sky are available
          return this.store.getters.skySectors.map((s: number) => s + 1);
        }
      } else {
        if (this.surveyObject?.initial == SpaceObject.COMET.initial) {
          // Comets can only be in prime sectors
          return primeSectors.filter((s) => s <= this.store.state.gameType.sectors);
        } else {
          // Otherwise all sectors are available
          return Array.from(Array(this.store.state.gameType.sectors)).map((el,i)=>i+1);
        }
      }
    },
    surveySize: function(): number {
      // Calculate width of survey on a circle
      if (this.startSector === undefined || this.endSector === undefined) {
        return 0;
      } else if (this.endSector >= this.startSector) {
        return this.endSector - this.startSector + 1;
      } else {
        return this.store.state.gameType.sectors - (this.startSector - this.endSector) + 1;
      }
    },
    sectorsValid: function(): boolean {
      // Sectors are valid when both sectors are defined and the survey
      // size is not larger than half the board
      if (this.startSector === undefined ||
          this.endSector === undefined) {
        return false;
      } else {
        return this.surveySize >= 1 && this.surveySize <= this.store.state.gameType.sectors/2;
      }
    },
    surveyReady: function(): boolean {
      // Survey ready to proceed when the sectors make a valid survey
      // and the object is defined
      return this.sectorsValid && this.surveyObject !== undefined;
    },
    timeCostOptions: function(): Array<Array<any>> {
      const numIntervals = (this.store.state.gameType.sectors/2)/this.store.state.gameType.surveyCost.interval;
      const maxCost = this.store.state.gameType.surveyCost.max;
      const costOptions: Array<Array<any>> = [[]];
      for (let i = 0; i < numIntervals; i++) {
        const minSector = i * this.store.state.gameType.surveyCost.interval + 1;
        const maxSector = minSector + this.store.state.gameType.surveyCost.interval - 1;
        const sectorsAtCost = Array.from(Array(maxSector-minSector+1)).map((el,i)=>minSector+i);
        const costOption = {
          cost: maxCost - i,
          sectors: sectorsAtCost
        };

        if (costOptions[costOptions.length - 1].length < 2) {
          costOptions[costOptions.length - 1].push(costOption);
        } else {
          costOptions.push([costOption]);
        }
      }
      return costOptions;
    },
    timeCost: function(): number{
      if (!this.sectorsValid) {
        return -1;
      } else {
        return this.store.state.gameType.surveyCost.max + 1
          - Math.ceil(this.surveySize/this.store.state.gameType.surveyCost.interval);
      }
    }
  },
  methods: {
    survey: function() {
      this.store.dispatch('survey', {
        surveyObject: this.surveyObject,
        startSector: this.startSector,
        endSector: this.endSector
      });
      this.router.push('/' + this.gameType + '/action/survey/result');
    },
    clearSelections: function() {
      this.surveyObject = undefined;
      this.startSector = undefined;
      this.endSector = undefined;
    },
    validateSelections: function() {
      // Clear out sectors if they are no longer valid when the survey
      // object changes
      if (this.availableSectors.indexOf(this.startSector) === -1) {
        this.startSector = undefined;
      }
      if (this.availableSectors.indexOf(this.endSector) === -1) {
        this.endSector = undefined;
      }
    }
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
  margin-top: 15vh;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#time_table {
  width: 100%;
}

#time_table td {
  width: 50%;

}

.tc_cell {
  display: flex;
  align-items: center;
  align-content: center;
  padding-top: 3px;
  padding-bottom: 3px;
}

.tc_cell ion-icon {
  font-size: 1.2em;
}

#time_cost {
  width: 100%;
}

#survey_selections {
  margin-top: 20px;
}

#survey_button {
  margin-top: 10px;
  text-transform: none;
}

#survey_button ion-icon {
  font-size: 1.2em;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}
</style>
