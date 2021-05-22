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
      <ion-label>Eliminate With Scratch Mark</ion-label>
      <ion-toggle v-model="scratchOut" @ionChange="changeScratchOut()"></ion-toggle>
    </ion-item>
    <ion-button color="light" expand="block" @click="close()">Close</ion-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController, IonItem, IonLabel,
        IonButton, IonGrid, IonRow, IonCol,
        IonToggle } from '@ionic/vue';
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
    IonToggle
  },
  data() {
    const store = useStore();
    return {
      store: store,
      muteLevel: store.state.settings.muteLevel,
      darkMode: store.state.settings.darkMode,
      scratchOut: store.state.settings.scratchOut,
      muteLevelNames: ["None", "Some", "All"]
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
    changeScratchOut: function() {
      this.store.commit("setScratchOut", this.scratchOut);
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

ion-toggle {
  --background: var(--ion-color-light-shade);
  --handle-background: var(--ion-color-light);
  --background-checked: var(--ion-color-dark-tint);
  --handle-background-checked: var(--ion-color-dark);
}
</style>
