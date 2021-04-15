<template>
  <div class="popover_container">
    <ion-item-group>
      <ion-item
        v-for="i in allowedSectors"
        :key="i"
        @click="choose(i)"
        class="sector_item">
        {{i}}
      </ion-item>
    </ion-item-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController, IonItemGroup,
        IonItem } from '@ionic/vue';

export default defineComponent({
  name: 'SectorSelectPopover',
  components: {
    IonItemGroup,
    IonItem
  },
  props: ['value', 'allowedSectors'],
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
}
</style>
