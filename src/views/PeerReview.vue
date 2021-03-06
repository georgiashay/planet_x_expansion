<template>
  <ion-page>
    <ion-content>
      <adaptable-container v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Peer Review</h3>
        </div>
        <div id="peerreview_selections">
          <sector-select
            :label="SECTOR_NAME.proper + ':'"
            :value="selectedSector"
            @input="selectedSector = $event"
            :columns="6"/>
          <sector-element-select
            :label="OBJECT_NAME.proper + ':'"
            :value="selectedObject"
            @input="selectedObject = $event"
            :columns="3"
            :exclude-objects="[GOAL_OBJECT, EMPTY_OBJECT]"/>
        </div>
        <ion-button
          expand="block"
          color="light"
          @click="peerreview()"
          id="peerreview_button"
          :disabled="selectedSector === undefined || selectedObject === undefined">
          View Results
          <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <stripe/>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/' + gameType + '/gamemenu'">Cancel</ion-nav-link>
        </div>
      </adaptable-container>
    </ion-content>
    <game-footer/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonIcon, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SectorElement, SECTOR_NAME, OBJECT_NAME, GOAL_OBJECT, EMPTY_OBJECT } from '@/constants';
import SectorElementSelect from '@/components/SectorElementSelect.vue';
import SectorSelect from '@/components/SectorSelect.vue';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

export default defineComponent({
  name: 'PeerReview',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    Stripe,
    IonNavLink,
    SectorElementSelect,
    SectorSelect,
    GameFooter,
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
    const router = useRouter();
    return {
      store,
      arrowForwardOutline,
      timeOutline,
      SectorElement,
      SECTOR_NAME,
      OBJECT_NAME,
      GOAL_OBJECT,
      EMPTY_OBJECT,
      selectedObject: undefined,
      selectedSector: undefined,
      router,
    }
  },
  methods: {
    peerreview: function() {
      this.store.dispatch('peerReview', {
        spaceObject: this.selectedObject,
        sector: this.selectedSector
      });
      this.router.push('/' + this.gameType + '/action/peerreview/result');
    },
    clearSelections: function() {
      this.selectedObject = undefined;
      this.selectedSector = undefined;
    }
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
</style>
