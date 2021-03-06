<template>
  <div class="select_container">
    <ion-item color="light">
      <ion-label>{{label}}</ion-label>
      <div
        v-for="(i, index) in value"
        :key="index"
        class="select_sector"
        @click="openPopover($event, index)">
        <span v-if="index > 0">&nbsp;{{delimiter}}&nbsp;</span>
        <span v-if="i !== undefined">
          <span v-if="!numberOnly">{{SECTOR_NAME.proper}}</span> {{i + 1}}
        </span>
        <span v-else class="no_sector">
          (Select {{SECTOR_NAME.proper}})
        </span>
        <span class="down_arrow">&nbsp;&#9662;</span>
      </div>
    </ion-item>
  </div>
</template>

<script lang="ts">
import { popoverController, IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import SectorSelectPopover from '@/components/SectorSelectPopover.vue';
import { SECTOR_NAME } from "@/constants.ts";

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
      default: "Select " + SECTOR_NAME.properPlural + ": "
    },
    allowedSectors: {
      type: Array,
      default: (): Array<number> => []
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
  data() {
    return {
      store: useStore(),
      SECTOR_NAME
    }
  },
  computed: {
    _allowedSectors(): any {
      return this.allowedSectors ||
      Array.from(Array(this.store.state.gameType.sectors)).map((el,i)=>i);
    }
  },
  methods: {
    openPopover: async function(e: Event, i: number) {
      // Display popover to choose sector
      const popover = await popoverController
        .create({
          component: SectorSelectPopover,
          componentProps: {
            allowedSectors: this._allowedSectors,
            columns: this.columns
          },
          event: e
        });
      await popover.present();

      // Returns sector number for the ith select
      const { data } = await popover.onWillDismiss();

      if (data !== undefined) {
        // Create a new value array with new sector number
        // and emit input event for it
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
