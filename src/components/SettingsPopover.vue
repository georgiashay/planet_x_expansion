<template>
  <div class="popover_container">
    <h2>Settings</h2>
    <ion-item color="light">
      <ion-label>Sound Effects</ion-label>
      <ion-grid>
        <ion-row>
          <ion-col
            v-for="i in 3"
            :key="i"
            size="4">
            <ion-button :color="buttonColor(i-1)" expand="block" @click="changeMuteLevel(i-1)">{{muteLevelNames[i-1]}}</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
    <ion-item color="light">
      <ion-label>Dark Mode</ion-label>
      <ion-toggle v-model="darkMode" @ionChange="changeDarkMode()"></ion-toggle>
    </ion-item>
    <ion-item color="light">
      <ion-label>Eliminate with Rectangle</ion-label>
      <ion-toggle v-model="rectangleEliminate" @ionChange="changeRectangleEliminate()"></ion-toggle>
    </ion-item>
    <ion-item color="light">
      <ion-label>Scratch out Uncertain</ion-label>
      <ion-toggle v-model="scratchUncertain" @ionChange="changeScratchUncertain()"></ion-toggle>
    </ion-item>
    <ion-item color="light">
      <ion-label position="floating">Logic Icon Size</ion-label>
      <ion-range v-model="iconSize" :min="0" :max="1" :step="0.01" @ionChange="changeIconSize()"></ion-range>
    </ion-item>
    <ion-button color="light" expand="block" @click="close()">Close</ion-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController, IonItem, IonLabel,
        IonButton, IonGrid, IonRow, IonCol,
        IonToggle, IonRange } from '@ionic/vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'SettingsPopover',
  components: {
    IonItem,
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonToggle,
    IonRange
  },
  data() {
    const store = useStore();
    return {
      store: store,
      muteLevel: store.state.settings.muteLevel,
      darkMode: store.state.settings.darkMode,
      rectangleEliminate: store.state.settings.rectangleEliminate,
      scratchUncertain: store.state.settings.scratchUncertain,
      muteLevelNames: ["None", "Some", "All"],
      iconSize: store.state.settings.logicIconSize
    }
  },
  methods: {
    close: async function() {
      await popoverController.dismiss();
    },
    buttonColor: function(i: number) {
      if (i === this.muteLevel) {
        return "dark";
      } else {
        return "medium";
      }
    },
    changeMuteLevel: function(level: number) {
      this.muteLevel = level;
      this.store.commit("setMuteLevel", level);
    },
    changeDarkMode: function() {
      this.store.commit("setDarkMode", this.darkMode);
    },
    changeRectangleEliminate: function() {
      this.store.commit("setRectangleEliminate", this.rectangleEliminate);
    },
    changeScratchUncertain: function() {
      this.store.commit("setScratchUncertain", this.scratchUncertain);
    },
    changeIconSize: function() {
      this.store.commit("setLogicIconSize", this.iconSize);
    }
  }
});
</script>

<style scoped>
.popover_container {
  padding: 1em;
}

ion-button {
  text-transform: none;
  margin: 0;
}

ion-col {
  padding: 0;
}
</style>
