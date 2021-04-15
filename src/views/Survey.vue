<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Current Action: Survey</h3>
        </div>
        <div id="time_cost">
          <p>Time cost varies by the selected range.</p>
          <table id="time_table">
            <tr>
              <td>
                1, 2, 3, 4 sectors <ion-icon :icon="arrowForwardOutline" size="small"/> 4 <ion-icon :icon="timeOutline" size="small"/>
              </td>
              <td>
                5, 6, 7, 8 sectors <ion-icon :icon="arrowForwardOutline" size="small"/> 3 <ion-icon :icon="timeOutline" size="small"/>
              </td>
            </tr>
            <tr>
              <td>
                9, 10, 11, 12 sectors <ion-icon :icon="arrowForwardOutline" size="small"/> 2 <ion-icon :icon="timeOutline" size="small"/>
              </td>
            </tr>
          </table>
        </div>
        <div id="survey_selections">
          <ion-item>
            <ion-label>Survey for:</ion-label>
            <ion-select
              placeholder="(Select Object)"
              interface="popover"
              v-model="surveyObject"
              @ionChange="startSector = undefined; endSector = undefined;">
              <ion-select-option
                v-for="(surveyObject, objectCode) in surveyableObjects"
                :key="objectCode"
                :value="objectCode">
                {{surveyObject.proper}}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item v-if="surveyObject">
            <ion-label>In sectors:</ion-label>
            <ion-select placeholder="(Start Sector)" interface="popover" v-model="startSector">
              <ion-select-option
                v-for="i in availableSectors"
                :key="i"
                :value="i">
                {{i}}
              </ion-select-option>
            </ion-select>
            <ion-select placeholder="(End Sector)" interface="popover" v-model="endSector">
              <ion-select-option
                v-for="i in availableSectors"
                :key="i"
                :value="i">
                {{i}}
              </ion-select-option>
            </ion-select>
          </ion-item>
        </div>
        <ion-button
          expand="block"
          color="medium"
          @click="survey()"
          id="survey_button"
          :disabled="!sectorsValid">
          Survey
          <template v-if="sectorsValid">({{timeCost}} <ion-icon :icon="timeOutline" size="small"/>)</template>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <ion-item-divider/>
        <div id="cancel_container">
          <ion-nav-link router-link="/multiplayer/gamemenu">Cancel</ion-nav-link>
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
        IonSelect, IonSelectOption, IonItem,
        IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SpaceObject } from '@/constants';

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
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel
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
    surveyableObjects: function(): any {
      const objects = Object.assign({}, SpaceObject);
      delete objects.PLANET_X;
      return objects;
    },
    availableSectors: function(): Array<number> | number {
      if (this.surveyObject === undefined) {
        return [];
      } else if (this.surveyObject === "COMET") {
        return [2, 3, 5, 7, 11, 13, 17, 19, 23];
      } else {
        return 24;
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
      if (this.surveyObject === undefined ||
          this.startSector === undefined ||
          this.endSector === undefined) {
        return false;
      } else {
        return this.surveySize >= 1 && this.surveySize <= 12;
      }
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
      this.surveyObject = undefined;
      this.startSector = undefined;
      this.endSector = undefined;
      this.router.push('/multiplayer/action/survey/result');
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

#time_table {
  width: 100%;
}

#time_table td {
  width: 50%;
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
