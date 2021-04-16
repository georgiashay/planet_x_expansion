<template>
  <div class="select_container">
    <ion-item @click="delegateFocus($event)">
      <ion-label>{{label}}</ion-label>
      <div id="select_object" @click="openPopover($event)">
        <span v-if="value !== undefined">
          <ion-icon :src="value.icon"></ion-icon> {{value.proper}}
        </span>
        <span v-else id="no_object">
          (Select Object)
        </span>
        <span id="down_arrow">&nbsp;&#9662;</span>
      </div>
    </ion-item>
  </div>
</template>

<script lang="ts">
import { popoverController,
        IonIcon, IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import SpaceObjectSelectPopover from '@/components/SpaceObjectSelectPopover.vue';

export default defineComponent({
  name: 'SpaceObjectSelect',
  components: {
    IonIcon,
    IonItem,
    IonLabel
  },
  props: {
    value: {
      type: Object
    },
    label: {
      type: String,
      default: "Select Object: "
    },
    excludeObjects: {
      type: Array,
      default: () => []
    },
    showName: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Number,
      default: 1
    }
  },
  methods: {
    delegateFocus: function(e: Event) {
      const clicked = e.target as HTMLElement;
      const item = clicked.closest("ion-item");
      const el = item.querySelector("#select_object") as HTMLElement;
      el.click();
    },
    openPopover: async function(e: Event) {
      e.stopPropagation();
      const popover = await popoverController
        .create({
          component: SpaceObjectSelectPopover,
          componentProps: {
            excludeObjects: this.excludeObjects,
            showName: this.showName,
            columns: this.columns
          },
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

#no_object {
  color: var(--ion-color-medium)
}
</style>
