<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Target</h3>
        </div>
        <div id="target_selections">
          <sector-select
            :label="SECTOR_NAME.proper + ':'"
            :value="sectorNumber"
            @input="sectorNumber = $event"
            :allowed-sectors="allowedSectors"
            :columns="6"/>
        </div>
        <ion-button
          expand="block"
          color="light"
          @click="target()"
          id="target_button"
          :disabled="sectorNumber === undefined">
          Target
          <template v-if="sectorNumber !== undefined">({{store.state.gameType.targetCost}} <ion-icon :icon="timeOutline"/>)</template>
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <stripe/>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/' + gameType + '/gamemenu'">Cancel</ion-nav-link>
        </div>
      </adaptable-container>
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
import SectorSelect from '@/components/SectorSelect.vue';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";
import { SECTOR_NAME } from "@/constants.ts";

export default defineComponent({
  name: 'Target',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    Stripe,
    IonNavLink,
    SectorSelect,
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
    const router = useRouter();
    return {
      store,
      arrowForwardOutline,
      timeOutline,
      sectorNumber: undefined,
      router,
      SECTOR_NAME
    }
  },
  methods: {
    target: function() {
      this.store.dispatch('target', {
        sectorNumber: this.sectorNumber
      });
      this.router.push('/' + this.gameType + '/action/target/result');
    },
    clearSelections: function() {
      this.sectorNumber = undefined;
    }
  },
  computed: {
    allowedSectors: function(): Array<number> {
      if (this.store.state.isSession) {
        return this.store.getters.skySectors;
      } else {
        return Array.from(Array(this.store.state.gameType.sectors)).map((el, i) => i);
      }
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
  margin-bottom: 2em;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#target_selections {
  margin-top: 20px;
}

#target_button {
  margin-top: 10px;
  text-transform: none;
}

#target_button ion-icon {
  font-size: 1.2em;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}
</style>
