<template>
  <div class="select_container">
    <ion-item @click="delegateFocus($event)" color="light">
      <ion-label>{{label}}</ion-label>
      <div id="select_sector" @click="openPopover($event)">
        <span v-if="value !== undefined">
          <span v-if="!numberOnly">{{SECTOR_NAME.proper}}</span> {{value+1}}
        </span>
        <span v-else id="no_sector">
          (Select {{SECTOR_NAME.proper}})
        </span>
        <span id="down_arrow">&nbsp;&#9662;</span>
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
  name: 'SectorSelect',
  components: {
    IonItem,
    IonLabel
  },
  props: {
    value: {
      type: Number
    },
    label: {
      type: String,
      default: "Select " + SECTOR_NAME.proper + ": "
    },
    allowedSectors: {
      type: Array
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
    delegateFocus: function(e: Event) {
      // If entire item is clicked, delegate click to the
      // select itself, so the popover is aligned properly
      const clicked = e.target as HTMLElement;
      const item = clicked.closest("ion-item");
      const el = item.querySelector("#select_sector") as HTMLElement;
      el.click();
    },
    openPopover: async function(e: Event) {
      // Open popover to choose sector
      e.stopPropagation();
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

      // Returns new sector number
      const { data } = await popover.onWillDismiss();
      if (data !== undefined) {
        // Emit input event with new sector number
        this.$emit('input', data);
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

#down_arrow {
  color: var(--ion-color-medium)
}

#no_sector {
  color: var(--ion-color-medium)
}
</style>
