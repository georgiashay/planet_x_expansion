<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Target</h3>
        </div>
        <div id="target_selections">
          <sector-select
            :label="'Sector:'"
            :value="sectorNumber"
            @input="sectorNumber = $event"
            :columns="6"/>
        </div>
        <ion-button
          expand="block"
          color="medium"
          @click="target()"
          id="target_button"
          :disabled="!sectorNumber">
          Target
          <template v-if="sectorNumber">(4 <ion-icon :icon="timeOutline"/>)</template>
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
import SectorSelect from '@/components/SectorSelect.vue';

export default defineComponent({
  name: 'Target',
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
    SectorSelect
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
    }
  },
  methods: {
    target: function() {
      this.store.commit('target', {
        sectorNumber: this.sectorNumber
      });
      this.clearSelections();
      this.router.push('/multiplayer/action/target/result');
    },
    clearSelections: function() {
      this.sectorNumber = undefined;
    }
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

#game_code {
  float:left;
}

#history_link {
  float:right;
  text-decoration: underline;
  margin-right: 20px;
}
</style>
