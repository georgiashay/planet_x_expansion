<template>
  <div class="popover_container" :style="cssVars">
    <table>
      <tr v-for="(row, index) in tableSectorElements" :key="index">
        <td
          v-for="(obj, j) in row"
          :key="j"
          @click="choose(obj)"
          class="space_item">
          <ion-icon :src="obj.icon"></ion-icon>
          <span v-if="showName">&nbsp;{{obj.proper}}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController, IonIcon } from '@ionic/vue';
import { SectorElement } from '@/constants';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'SectorElementSelectPopover',
  components: {
    IonIcon
  },
  props: ['value', 'excludeObjects', 'showName', 'columns'],
  data: function() {
    return {
      SectorElement,
      store: useStore()
    }
  },
  computed: {
    spaceObjects: function(): any {
      // Remove excluded space objects
      const objects = Object.assign({}, SectorElement);
      const excludedInitials = this.excludeObjects.map((obj: any) => obj.initial);
      for (const objectCode in objects) {
        if (excludedInitials.indexOf(objects[objectCode].initial) >= 0) {
          delete objects[objectCode];
        } else if (this.store.state.gameType.numObjects[SectorElement[objectCode].initial] === undefined) {
          delete objects[objectCode];
        }
      }
      return objects;
    },
    tableSectorElements: function(): any {
      // Split space objects into rows of size this.columns
      const objects: any[][] = [[]];
      for (const objectCode in this.spaceObjects) {
        if (objects[objects.length-1].length < this.columns) {
          objects[objects.length-1].push(this.spaceObjects[objectCode]);
        } else {
          objects.push([this.spaceObjects[objectCode]]);
        }
      }
      return objects;
    },
    cssVars: function(): any {
      // Return reasonable width for popover table
      return {
        "--width": (50*this.columns) + "px"
      }
    }
  },
  methods: {
    choose: async function(obj: any) {
      // Dismiss popover and return selected space object
      await popoverController.dismiss(obj);
    }
  }
});
</script>

<style scoped>
table {
  table-layout: fixed;
  width: var(--width);
  background-color: var(--ion-color-light);
  color: var(--ion-color-light-contrast);
}

.space_item {
  cursor: pointer;
  font-size: 2em;
  margin: 0px;
  padding: 10px;
  outline: 1px solid var(--ion-color-light-contrast);
  outline-offset: -1px;
  text-align: center;
}

.space_item:hover {
  background-color: var(--ion-color-medium);
}
</style>
