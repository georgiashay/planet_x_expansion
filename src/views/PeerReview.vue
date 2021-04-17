<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Peer Review</h3>
        </div>
        <div id="peerreview_selections">
          <sector-select
            :label="'Sector:'"
            :value="selectedSector"
            @input="selectedSector = $event"
            :columns="6"/>
          <space-object-select
            :label="'Object:'"
            :value="selectedObject"
            @input="selectedObject = $event"
            :columns="3"
            :exclude-objects="['PLANET_X', 'EMPTY']"/>
        </div>
        <ion-button
          expand="block"
          color="dark"
          @click="peerreview()"
          id="peerreview_button"
          :disabled="selectedSector === undefined || selectedObject === undefined">
          View Results
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
import SectorSelect from '@/components/SectorSelect.vue';
import SoundMixin from "@/mixins/SoundMixin.ts";

export default defineComponent({
  name: 'PeerReview',
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
    SectorSelect
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
      selectedObject: undefined,
      selectedSector: undefined,
      router,
    }
  },
  methods: {
    peerreview: function() {
      this.store.commit('peerReview', {
        spaceObject: this.selectedObject,
        sector: this.selectedSector
      });
      this.router.push('/multiplayer/action/peerreview/result');
    },
    clearSelections: function() {
      this.selectedObject = undefined;
      this.selectedSector = undefined;
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

#peerreview_selections {
    margin-top: 20px;
}

#peerreview_button {
  margin-top: 10px;
  text-transform: none;
}

#peerreview_button ion-icon {
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
