<template>
  <div class="popover_container">
    <h2>{{store.state.gameType.sectors}}-Sector Board</h2>
    <ion-grid>
      <ion-row
        color="light"
        v-for="(obj, index) in spaceObjects"
        :key="index"
        >
        <ion-col size="1">
          {{obj.numObject}}
        </ion-col>
        <ion-col size="3">
          <ion-icon :src="obj.spaceObject.icon"/>
          <p>{{obj.numObject === 1 ? obj.spaceObject.proper : obj.spaceObject.properPlural}}</p>
        </ion-col>
        <ion-col size="8">
          {{obj.constraint}}
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonIcon, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { useStore } from "vuex";
import { initialToSectorElement } from "@/constants.ts";

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
      for (const initial of this.store.state.gameType.constraintOrder) {
        const spaceObject = initialToSectorElement[initial];
        spaceObjects.push({
          spaceObject,
          numObject: this.store.state.gameType.numObjects[initial],
          constraint: this.store.state.gameType.constraints[initial]
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
  border: 0.01em solid gray;
}

ion-col p {
  padding-left: 0.5em;
  margin: 0;
}

ion-icon {
  font-size: 1.2em;
}
</style>
