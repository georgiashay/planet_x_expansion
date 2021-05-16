<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Starting Information</h3>
          <h4>{{ store.state.seasonView.name }} {{ store.state.seasonView.viewType }}</h4>
        </div>
        <div id="starting_info">
          <p v-if="store.getters.myStartingInformation.length === 0">You're a genius. You don't need any starting information.</p>
          <ion-grid>
            <ion-row
              v-for="(info, index) in store.getters.myStartingInformation"
              :key="index"
              class="clue_row">
              <ion-col size="4" class="sector_num">
                Sector {{info.sector + 1}}
              </ion-col>
              <ion-col size="8" class="clue_obj">
                <ion-icon :src="info.spaceObject.icon"></ion-icon>&nbsp;
                not {{info.spaceObject.one}}
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <ion-button
          v-if="store.state.isSession"
          expand="block"
          color="light"
          @click="exportLogic()"
          id="export_button">
          Export to Logic Sheet
        </ion-button>
        <spacer v-if="store.state.isSession"/>
        <ion-button
          expand="block"
          color="light"
          :router-link="'/' + gameType + '/researchcategories'"
          id="start_button">
          Start Game
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
    <game-footer hide-at="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonIcon,
        IonGrid, IonCol, IonRow } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Spacer from "@/components/Spacer.vue";

export default defineComponent({
  name: 'StartingInformation',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonGrid,
    IonCol,
    IonRow,
    Spacer,
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
    return {
      store,
      arrowForwardOutline
    }
  },
  ionViewDidEnter() {
    this.playSound("sonar1");
  },
  methods: {
    exportLogic: function() {
      for (let i = 0; i < this.store.getters.myStartingInformation.length; i++) {
        const info = this.store.getters.myStartingInformation[i];
        this.store.commit("logicEliminate", {
          sector: info.sector,
          object: info.spaceObject.initial
        });
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
  margin-top: 15vh;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#starting_info {
  margin-bottom: 10px;
}

#export_button {
  text-transform: none;
}

#start_button {
  text-transform: none;
}

.clue_row {
  padding: 7px;
  border-bottom: 1px solid lightgray;
}

.clue_row ion-col {
  display: flex;
  align-content: center;
  align-items: center;
  padding-top: 3px;
  padding-bottom: 3px;
}

.clue_obj ion-icon {
  font-size: 2em;
}

.sector_num {
  font-style: bold;
}
</style>
