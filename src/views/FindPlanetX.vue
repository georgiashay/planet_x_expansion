<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content>
      <adaptable-container v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Locate {{GOAL_OBJECT.the}}</h3>
        </div>
        <div id="planetx_selections">
          <sector-select
            :label="SECTOR_NAME.proper + ':'"
            :value="sector"
            @input="sector=$event"
            :columns="6"/>
          <spacer v-if="sector !== undefined"/>
          <sector-element-select
            v-if="sector !== undefined "
            :label="SECTOR_NAME.proper + ' ' + (leftSector+1)"
            :value="leftObject"
            @input="leftObject = $event"
            :columns="3"
            :exclude-objects="[GOAL_OBJECT, SURROUNDED_OBJECT, BANDED_OBJECT]"/>
          <ion-item v-if="sector !== undefined" id="planet_x_spacer" color="light">
            <ion-label>{{SECTOR_NAME.proper}} {{sector+1}}</ion-label>
            <ion-icon :src="GOAL_OBJECT.icon"></ion-icon>&nbsp;{{GOAL_OBJECT.name}}
          </ion-item>
          <sector-element-select
            v-if="sector !== undefined"
            :label="SECTOR_NAME.proper + ' ' + (rightSector+1)"
            :value="rightObject"
            @input="rightObject = $event"
            :columns="3"
            :exclude-objects="[GOAL_OBJECT, SURROUNDED_OBJECT, BANDED_OBJECT]"/>
        </div>
        <ion-button
          expand="block"
          color="light"
          @click="locate()"
          id="planet_button"
          :disabled="sector === undefined || leftObject === undefined || rightObject === undefined">
          Locate {{GOAL_OBJECT.the}} ({{store.state.gameType.locatePlanetXCost}} <ion-icon :icon="timeOutline" size="small"/>)
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
        IonButton, IonIcon, IonNavLink,
        IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { GOAL_OBJECT, SECTOR_NAME, SURROUNDED_OBJECT, BANDED_OBJECT } from '@/constants';
import SectorElementSelect from '@/components/SectorElementSelect.vue';
import SectorSelect from '@/components/SectorSelect.vue';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";
import Spacer from "@/components/Spacer.vue";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

export default defineComponent({
  name: 'FindPlanetX',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    Stripe,
    Spacer,
    IonNavLink,
    IonLabel,
    IonItem,
    SectorElementSelect,
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
      GOAL_OBJECT,
      SURROUNDED_OBJECT,
      BANDED_OBJECT,
      SECTOR_NAME,
      sector: undefined,
      leftObject: undefined,
      rightObject: undefined,
      router,
    }
  },
  computed: {
    leftSector: function(): number | undefined {
      // Get sector to the left of selected sector on a circle
      if (this.sector === undefined) {
        return undefined;
      } else {
        let left = this.sector - 1;
        if (left < 0) {
          left = this.store.state.gameType.sectors - 1;
        }
        return left;
      }
    },
    rightSector: function(): number | undefined {
      // Get sector to the right of selected sector on a circle
      if (this.sector === undefined) {
        return undefined;
      } else {
        let left = this.sector + 1;
        if (left > this.store.state.gameType.sectors - 1) {
          left = 0;
        }
        return left;
      }
    }
  },
  methods: {
    locate: function() {
      this.store.dispatch('locatePlanetX', {
        sector: this.sector,
        leftObject: this.leftObject,
        rightObject: this.rightObject
      });
      this.router.push('/' + this.gameType + '/action/locateplanetx/result');
    },
    clearSelections: function() {
      this.sector = undefined;
      this.leftObject = undefined;
      this.rightObject = undefined;
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

#planet_selections {
    margin-top: 20px;
}

#planet_button {
  margin-top: 10px;
  text-transform: none;
}

#planet_button ion-icon {
  font-size: 1.2em;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

#planet_x_spacer ion-icon {
  font-size: 1.6em;
}
</style>
