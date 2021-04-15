<template>
  <div class="select_container">
    <ion-item @click="delegateFocus($event)">
      <ion-label>{{label}}</ion-label>
      <div id="select_object" @click="openPopover($event)">
        <template v-if="value !== undefined">
          <ion-icon :src="value.icon"></ion-icon> {{value.proper}}
        </template>
        <template v-else>
          (Select Object)
        </template>
        <span id="down_arrow">&nbsp;&#9662;</span>
      </div>
    </ion-item>
  </div>
</template>

<script lang="ts">
import { popoverController,
        IonIcon, IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import SpaceObjectSelectPopover from '@/views/SpaceObjectSelectPopover.vue';

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
          componentProps: { excludeObjects: this.excludeObjects },
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

#select_object {
  color: var(--ion-color-medium);
}

#down_arrow {
  color: black;
}
</style>
