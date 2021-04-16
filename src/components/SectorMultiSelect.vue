<template>
  <div class="select_container">
    <ion-item>
      <ion-label>{{label}}</ion-label>
      <div
        v-for="(i, index) in value"
        :key="index"
        class="select_sector"
        @click="openPopover($event, index)">
        <span v-if="index > 0">&nbsp;{{delimiter}}&nbsp;</span>
        <span v-if="i !== undefined">
          <span v-if="!numberOnly">Sector</span> {{i}}
        </span>
        <span v-else class="no_sector">
          (Select Sector)
        </span>
        <span class="down_arrow">&nbsp;&#9662;</span>
      </div>
    </ion-item>
  </div>
</template>

<script lang="ts">
import { popoverController, IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import SectorSelectPopover from '@/components/SectorSelectPopover.vue';

export default defineComponent({
  name: 'SectorMultiSelect',
  components: {
    IonItem,
    IonLabel
  },
  props: {
    value: {
      type: Array
    },
    label: {
      type: String,
      default: "Select Object: "
    },
    allowedSectors: {
      type: Array,
      default: () => Array.from(Array(24)).map((el,i)=>i+1)
    },
    delimiter: {
      type: String,
      default: "-"
    },
    numberOnly: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Number,
      default: 1
    }
  },
  methods: {
    openPopover: async function(e: Event, i: number) {
      const popover = await popoverController
        .create({
          component: SectorSelectPopover,
          componentProps: {
            allowedSectors: this.allowedSectors,
            columns: this.columns
          },
          event: e
        });
      await popover.present();

      const { data } = await popover.onDidDismiss();
      if (data !== undefined) {
        const val = this.value as Array<number>;
        const newValue = [...val];
        newValue[i] = data;
        this.$emit('input', newValue);
      }
    }
  }
});
</script>

<style scoped>
ion-item {
  cursor: pointer;
  --padding-bottom: 0px;
}

ion-item:hover {
  --background: whitesmoke;
}
.select_button {
  text-transform: none;
}

.down_arrow {
  color: var(--ion-color-medium)
}

.no_sector {
  color: var(--ion-color-medium)
}
</style>
