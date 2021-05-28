<template>
  <div>
    <table id="color_table">
      <tr v-for="(row, i) in colorsGrid" :key="i">
        <td
          v-for="(color, j) in row"
          :key="j"
          class="color_cell"
          :style="{'--cell-color': color || 'rgba(0, 0, 0, 0)'}"
          @click="choose(i*5+j)">
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController } from '@ionic/vue';
import { INNER_WHEEL_COLORS } from "@/constants.ts";

export default defineComponent({
  name: 'ColorPickerPopover',
  props: ['value'],
  data: function() {
    return {
      color: this.value
    }
  },
  computed: {
    colors: function(): Array<string> {
      return ["#3dc2ff", "#3880ff", "#eb445a", "#2dd36f",
              "#ffc409", "#5260ff"].concat(INNER_WHEEL_COLORS);
    },
    colorsGrid: function(): Array<Array<string>> {
      const grid: Array<Array<any>> = [[]];
      for (let i = 0; i < this.colors.length; i++) {
        grid[grid.length-1].push(this.colors[i]);
        if (grid[grid.length - 1].length === 5) {
          grid.push([]);
        }
      }
      return grid;
    }
  },
  methods: {
    choose: async function(index: number) {
      const color = this.colors[index];
      await popoverController.dismiss(color);
    }
  }
});
</script>

<style scoped>
table#color_table {
  width: 200px;
}

td.color_cell {
  width: 20%;
  height: 0;
  padding-bottom: 10%;
  padding-top: 10%;
  position: relative;
  padding-left: 0;
  padding-right: 0;
  overflow: hidden;
  background-color: var(--cell-color);
}
</style>
