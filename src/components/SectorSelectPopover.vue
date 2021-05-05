<template>
  <div class="popover_container" :style="cssVars">
    <table>
      <tr v-for="(row, index) in tableSectors" :key="index">
        <td
          v-for="(sector, j) in row"
          :key="j"
          @click="choose(sector)"
          class="sector_item"
          :style="'width: ' + percentWidth + '%'">
          {{sector}}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController } from '@ionic/vue';

export default defineComponent({
  name: 'SectorSelectPopover',
  components: {
  },
  props: ['value', 'allowedSectors', 'columns'],
  computed: {
    percentWidth: function(): number {
      // Percent each column should take up
      return Math.floor(100/this.columns);
    },
    tableSectors: function(): any[][] {
      // Split sectors into rows of size this.columns
      const table: any[][] = [[]];
      for (let i = 0; i < this.allowedSectors.length; i++) {
        const sector = this.allowedSectors[i];
        if (table[table.length-1].length < this.columns) {
          table[table.length-1].push(sector);
        } else {
          table.push([sector]);
        }
      }
      return table;
    },
    cssVars: function(): any {
      // Construct reasonable table width depending on number of
      // columns
      const numColumns = Math.min(this.columns, this.allowedSectors.length);
      return {
        "--width": (45 * numColumns) + "px"
      };
    }
  },
  methods: {
    choose: async function(num: number) {
      // Dismiss popover and return chosen sector
      await popoverController.dismiss(num);
    }
  }
});
</script>

<style scoped>
table {
  table-layout: fixed;
  width: var(--width);
  background-color: var(--ion-color-dark);
}
.sector_item {
  cursor: pointer;
  font-size: 20px;
  margin: 0px;
  padding: 10px;
  outline: 1px solid white;
  outline-offset: -1px;
  text-align: center;
  text-overflow: clip;
}

.sector_item:hover {
  background-color: dimgray;
}

</style>
