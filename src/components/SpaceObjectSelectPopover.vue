<template>
  <div class="popover_container" :style="cssVars">
    <table>
      <tr v-for="(row, index) in tableSpaceObjects" :key="index">
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
import { SpaceObject } from '@/constants';

export default defineComponent({
  name: 'SpaceObjectSelectPopover',
  components: {
    IonIcon
  },
  props: ['value', 'excludeObjects', 'showName', 'columns'],
  data: function() {
    return {
      SpaceObject
    }
  },
  computed: {
    spaceObjects: function(): any {
      const objects = Object.assign({}, SpaceObject);
      for (const objectCode in objects) {
        if (this.excludeObjects.indexOf(objectCode) >= 0) {
          delete objects[objectCode];
        }
      }
      return objects;
    },
    tableSpaceObjects: function(): any {
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
      return {
        "--width": (50*this.columns) + "px"
      }
    }
  },
  methods: {
    choose: async function(obj: any) {
      await popoverController.dismiss(obj);
    }
  }
});
</script>

<style scoped>
ion-col {
  --background-hover: lightgray;
}
ion-col:hover {
  --background: lightgray;
}

table {
  table-layout: fixed;
  width: var(--width);
  background-color: var(--ion-color-dark);
}

.space_item {
  cursor: pointer;
  font-size: 25px;
  margin: 0px;
  padding: 10px;
  outline: 1px solid white;
  outline-offset: -1px;
  text-align: center;
}

.space_item:hover {
  background-color: whitesmoke;
}
</style>
