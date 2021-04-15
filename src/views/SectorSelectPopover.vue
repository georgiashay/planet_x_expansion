<template>
  <div class="popover_container">
    <!-- <ion-item-group>
      <ion-item
        v-for="i in allowedSectors"
        :key="i"
        @click="choose(i)"
        class="sector_item">
        {{i}}
      </ion-item>
    </ion-item-group> -->
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
      return Math.floor(100/this.columns);
    },
    tableSectors: function(): any[][] {
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
    }
  },
  methods: {
    choose: async function(num: number) {
      await popoverController.dismiss(num);
    }
  }
});
</script>

<style scoped>
ion-item:hover {
  --background: whitesmoke;
}

.sector_item {
  cursor: pointer;
  font-size: 25px;
  margin: 0px;
  padding: 10px;
  border: 1px solid whitesmoke;
  text-align: center;
}

.sector_item:hover {
  background-color: whitesmoke;
}

</style>
