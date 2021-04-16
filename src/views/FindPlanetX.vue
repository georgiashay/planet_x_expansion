<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Locate Planet X</h3>
        </div>
        <div id="planetx_selections">
          <sector-select
            :label="'Sector:'"
            :value="sector"
            @input="sector=$event"
            :columns="6"/>
          <ion-item-divider v-if="sector"/>
          <space-object-select
            v-if="sector"
            :label="'Sector ' + leftSector"
            :value="leftObject"
            @input="leftObject = $event"
            :columns="3"
            :exclude-objects="['PLANET_X', 'BLACK_HOLE', 'DWARF_PLANET']"/>
          <ion-item v-if="sector" id="planet_x_spacer">
            <ion-label>Sector {{sector}}</ion-label>
            <ion-icon :src="SpaceObject.PLANET_X.icon"></ion-icon>&nbsp;Planet X
          </ion-item>
          <space-object-select
            v-if="sector"
            :label="'Sector ' + rightSector"
            :value="rightObject"
            @input="rightObject = $event"
            :columns="3"
            :exclude-objects="['PLANET_X', 'BLACK_HOLE', 'DWARF_PLANET']"/>
        </div>
        <ion-button
          expand="block"
          color="dark"
          @click="locate()"
          id="planet_button"
          :disabled="sector === undefined || leftObject === undefined || rightObject === undefined">
          Locate Planet X (5 <ion-icon :icon="timeOutline" size="small"/>)
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
        IonToolbar, IonTitle, IonNavLink,
        IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SpaceObject } from '@/constants';
import SpaceObjectSelect from '@/components/SpaceObjectSelect.vue';
import SectorSelect from '@/components/SectorSelect.vue';

export default defineComponent({
  name: 'FindPlanetX',
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
    IonLabel,
    IonItem,
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
      sector: undefined,
      leftObject: undefined,
      rightObject: undefined,
      router,
    }
  },
  computed: {
    leftSector: function(): number | undefined {
      if (this.sector === undefined) {
        return undefined;
      } else {
        let left = this.sector - 1;
        if (left == 0) {
          left = 24;
        }
        return left;
      }
    },
    rightSector: function(): number | undefined {
      if (this.sector === undefined) {
        return undefined;
      } else {
        let left = this.sector + 1;
        if (left == 25) {
          left = 1;
        }
        return left;
      }
    }
  },
  methods: {
    locate: function() {
      this.store.commit('locatePlanetX', {
        sector: this.sector,
        leftObject: this.leftObject,
        rightObject: this.rightObject
      });
      this.router.push('/multiplayer/action/locateplanetx/result');
    },
    clearSelections: function() {
      this.sector = undefined;
      this.leftObject = undefined;
      this.rightObject = undefined;
    }
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

#game_code {
  float:left;
}

#history_link {
  float:right;
  text-decoration: underline;
  margin-right: 20px;
}

#planet_x_spacer ion-icon {
  font-size: 1.2em;
}

#planet_x_spacer {
  --background: ghostwhite;
}
</style>
