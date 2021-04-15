<template>
  <div class="select_container">
    <ion-item @click="delegateFocus($event)">
      <ion-label>{{label}}</ion-label>
      <div id="select_sector" @click="openPopover($event)">
        <span v-if="value !== undefined">
          <span v-if="!numberOnly">Sector</span> {{value}}
        </span>
        <span v-else id="no_sector">
          (Select Sector)
        </span>
        <span id="down_arrow">&nbsp;&#9662;</span>
      </div>
    </ion-item>
  </div>
</template>

<script lang="ts">
import { popoverController, IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import SectorSelectPopover from '@/views/SectorSelectPopover.vue';

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
      default: "Select Object: "
    },
    allowedSectors: {
      type: Array,
      default: () => Array.from(Array(24)).map((el,i)=>i+1)
    },
    numberOnly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    delegateFocus: function(e: Event) {
      const clicked = e.target as HTMLElement;
      const item = clicked.closest("ion-item");
      const el = item.querySelector("#select_sector") as HTMLElement;
      el.click();
    },
    openPopover: async function(e: Event) {
      e.stopPropagation();
      const popover = await popoverController
        .create({
          component: SectorSelectPopover,
          componentProps: { allowedSectors: this.allowedSectors },
          event: e
        });
      await popover.present();

      const { data } = await popover.onDidDismiss();
      if (data !== undefined) {
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
