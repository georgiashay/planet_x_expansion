<template>
  <div class="popover_container">
    <h2>{{store.state.gameType.sectors}}-Sector Board</h2>
    <ion-grid>
      <ion-row
        color="dark"
        v-for="(obj, index) in spaceObjects"
        :key="index"
        >
        <ion-col size="2">
          {{obj.numObject}}
        </ion-col>
        <ion-col size="10">
          <ion-icon :src="obj.spaceObject.icon"/>&nbsp;{{obj.numObject === 1 ? obj.spaceObject.name : obj.spaceObject.plural}}
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { useStore } from "vuex";
import { initialToSpaceObject } from "@/constants.ts";

export default defineComponent({
  name: 'NumObjectsPopover',
  components: {
    IonIcon,
    IonGrid,
    IonRow,
    IonCol
  },
  data() {
    return {
      store: useStore()
    }
  },
  computed: {
    spaceObjects: function(): Array<any> {
      const spaceObjects = [];
      for (const initial in this.store.state.gameType.numObjects) {
        const spaceObject = initialToSpaceObject[initial];
        spaceObjects.push({
          spaceObject,
          numObject: this.store.state.gameType.numObjects[initial]
        });
      }
      return spaceObjects;
    }
  }
});
</script>

<style scoped>
.popover_container {
  padding: 1em;
}

ion-col {
  padding: 0.2em;
  display: flex;
  align-content: center;
  align-items: center;
}

ion-icon {
  font-size: 1.2em;
}
</style>
