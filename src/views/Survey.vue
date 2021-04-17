<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Survey</h3>
        </div>
        <div id="time_cost">
          <p>Time cost varies by the selected range.</p>
          <table id="time_table">
            <tr>
              <td>
                <div class="tc_cell">
                  1, 2, 3, 4 sectors <ion-icon :icon="arrowForwardOutline"/>&nbsp;4 <ion-icon :icon="timeOutline"/>
                </div>
              </td>
              <td>
                <div class="tc_cell">
                  5, 6, 7, 8 sectors <ion-icon :icon="arrowForwardOutline"/>&nbsp;3 <ion-icon :icon="timeOutline"/>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="tc_cell">
                  9, 10, 11, 12 sectors <ion-icon :icon="arrowForwardOutline"/>&nbsp;2 <ion-icon :icon="timeOutline"/>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div id="survey_selections">
          <space-object-select
            :label ="'Survey for:'"
            :value="surveyObject"
            @input="surveyObject = $event; objChanged()"
            :exclude-objects="['PLANET_X']"
            :columns="3"
            :show-name="false"/>
          <sector-multi-select
            :label="'In sectors:'"
            :value="[startSector, endSector]"
            @input="startSector = $event[0]; endSector = $event[1]"
            :allowed-sectors="availableSectors"
            :number-only="true"
            :columns="6"/>
        </div>
        <ion-button
          expand="block"
          color="dark"
          @click="survey()"
          id="survey_button"
          :disabled="!surveyReady">
          Survey
            <template v-if="sectorsValid">({{timeCost}} <ion-icon :icon="timeOutline"/>)</template>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <ion-item-divider/>
        <div id="cancel_container">
          <ion-nav-link router-link="/multiplayer/gamemenu">Cancel</ion-nav-link>
        </div>
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
import { useRouter } from 'vue-router';
import { SpaceObject } from '@/constants';
import SpaceObjectSelect from '@/components/SpaceObjectSelect.vue';
import SectorMultiSelect from '@/components/SectorMultiSelect.vue';
import SoundMixin from "@/mixins/SoundMixin.ts";

export default defineComponent({
  name: 'Survey',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonItemDivider,
    IonNavLink,
    SpaceObjectSelect,
    SectorMultiSelect
  },
  mixins: [SoundMixin],
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
      if (this.surveyObject?.initial == SpaceObject.COMET.initial) {
        return [2, 3, 5, 7, 11, 13, 17, 19, 23];
      } else {
        return Array.from(Array(24)).map((el,i)=>i+1);
      }
    },
    surveySize: function(): number {
      if (this.startSector === undefined || this.endSector === undefined) {
        return 0;
      } else if (this.endSector > this.startSector) {
        return this.endSector - this.startSector + 1;
      } else {
        return 24 - (this.startSector - this.endSector) + 1;
      }
    },
    sectorsValid: function(): boolean {
      if (this.startSector === undefined ||
          this.endSector === undefined) {
        return false;
      } else {
        return this.surveySize >= 1 && this.surveySize <= 12;
      }
    },
    surveyReady: function(): boolean {
      return this.sectorsValid && this.surveyObject !== undefined;
    },
    timeCost: function(): number{
      if (!this.sectorsValid) {
        return -1;
      } else {
        return 5 - Math.ceil(this.surveySize/4);
      }
    }
  },
  methods: {
    survey: function() {
      this.store.commit('survey', {
        surveyObject: this.surveyObject,
        startSector: this.startSector,
        endSector: this.endSector
      });
      this.router.push('/multiplayer/action/survey/result');
    },
    clearSelections: function() {
      this.surveyObject = undefined;
      this.startSector = undefined;
      this.endSector = undefined;
    },
    objChanged: function() {
      if (this.availableSectors.indexOf(this.startSector) === -1) {
        this.startSector = undefined;
      }
      if (this.availableSectors.indexOf(this.endSector) === -1) {
        this.endSector = undefined;
      }
    }
  },
  ionViewDidEnter() {
    this.playSonar1();
  },
  ionViewDidLeave() {
    this.clearSelections();
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

#game_code {
  float:left;
}

#history_link {
  float:right;
  text-decoration: underline;
  margin-right: 20px;
}
</style>
