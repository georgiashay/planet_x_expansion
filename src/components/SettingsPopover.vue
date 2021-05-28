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
    <!-- <ion-button
            ionicColorPicker
            [colors]="['#C0392B', '#E74C3C', '#9B59B6', '#8E44AD', '#2980B9', '#3498DB', '#1ABC9C', '#16A085', '#27AE60', '#2ECC71']"
            (colorPickerOpen)=""
            (colorPickerClose)=""
            (colorChange)="">
        Change Color
    </ion-button> -->
    <ion-item color="light">
      <ion-label>Uncertain Color</ion-label>
      <div id="color-swatch" :style="{'--swatch-color': uncertainColor}">
        <ion-button color="dark" @click="openColorPicker($event)">
          <ion-icon :src="colorPaletteOutline"></ion-icon>
        </ion-button>
      </div>

      <!-- <fk-color-picker v-model:color="uncertainColor"/> -->
      <!-- <sketch-picker v-model="uncertainColor"/> -->
    </ion-item>
    <ion-button color="light" expand="block" @click="close()">Close</ion-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController, IonItem, IonLabel,
        IonButton, IonGrid, IonRow, IonCol,
        IonToggle, IonRange, IonIcon } from '@ionic/vue';
import { useStore } from 'vuex';
import { colorPaletteOutline } from "ionicons/icons";
import ColorSelectPopover from "@/components/ColorSelectPopover.vue";

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
    IonRange,
    IonIcon
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
      iconSize: store.state.settings.logicIconSize,
      uncertainColor: store.state.settings.levelColors[1],
      colorPaletteOutline
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
    },
    openColorPicker: async function(ev: Event) {
      const popover = await popoverController.create({
        component: ColorSelectPopover,
        event: ev,
        translucent: true,
        componentProps: {
          color: this.uncertainColor
        }
      });
      await popover.present();

      const { data } = await popover.onDidDismiss();
      if (data !== undefined) {
        this.uncertainColor = data;
        this.store.commit("setLevelColor", { color: data, level: 1 });
      }
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

#color-swatch {
  padding: 0.5em;
  background-color: var(--swatch-color);
}
</style>
