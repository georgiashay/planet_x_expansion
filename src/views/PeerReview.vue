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
            @input="selectedSector = $event"/>
          <space-object-select
            :label="'Object:'"
            :value="selectedObject"
            @input="selectedObject = $event"
            :exclude-objects="['PLANET_X', 'EMPTY']"/>
        </div>
        <ion-button
          expand="block"
          color="medium"
          @click="peerreview()"
          id="peerreview_button"
          :disabled="selectedSector === undefined || selectedObject === undefined">
          View Results
          <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <ion-item-divider/>
        <div id="cancel_container">
          <ion-nav-link router-link="/multiplayer/gamemenu" @click="clearSelections()">Cancel</ion-nav-link>
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
        IonToolbar, IonTitle, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SpaceObject } from '@/constants';
import SpaceObjectSelect from '@/views/SpaceObjectSelect.vue';
import SectorSelect from '@/views/SectorSelect.vue';

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
  computed: {
    selectableObjects: function(): any {
      const objects = Object.assign({}, SpaceObject);
      delete objects.PLANET_X;
      delete objects.EMPTY;
      return objects;
    }
  },
  methods: {
    peerreview: function() {
      this.store.commit('peerReview', {
        spaceObject: this.selectedObject,
        sector: this.selectedSector
      });
      this.clearSelections();
      this.router.push('/multiplayer/action/peerreview/result');
    },
    clearSelections: function() {
      this.selectedObject = undefined;
      this.selectedSector = undefined;
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

#peerreview_selections {
    margin-top: 20px;
}

#peerreview_button {
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
