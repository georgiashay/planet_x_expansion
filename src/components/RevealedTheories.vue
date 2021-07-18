<template>
  <div class="popover_container">
    <ion-item color="light" v-for="(theory, i) in revealedTheories" :key="i">
      {{SECTOR_NAME.proper}} {{theory.sector + 1}}: is {{theory.accurate ? "" : "not "}}{{theory.spaceObject.one}}
      &nbsp;<ion-icon :src="theory.spaceObject.icon"/>
    </ion-item>
    <ion-button color="light" expand="block" @click="exportRevealed($event)">Export to Logic Sheet</ion-button>
    <ion-button color="light" expand="block" @click="$emit('close')">Close</ion-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController, IonIcon, IonItem, IonButton } from '@ionic/vue';
import { useStore } from 'vuex';
import { PRIME_OBJECT, SECTOR_NAME } from "@/constants.ts"

export default defineComponent({
  name: 'RevealedTheoriesPopover',
  components: {
    IonIcon,
    IonItem,
    IonButton
  },
  data() {
    return {
      store: useStore(),
      SECTOR_NAME
    }
  },
  props: ['revealedTheories'],
  methods: {
    close: async function() {
      await popoverController.dismiss();
    },
    exportRevealed: async function(event: Event) {
      event.stopPropagation();
      await this.store.dispatch('newPacket', { queue: 'undo' });
      for (let i = 0; i < this.revealedTheories.length; i++) {
        const theory = this.revealedTheories[i];
        if (theory.accurate) {
          for (const initial of this.store.state.gameType.logicSheetOrder) {
            if (theory.spaceObject.initial === initial) {
              await this.store.dispatch("logicSetLevel", {
                sector: theory.sector,
                object: initial,
                newPacket: false
              });
            } else {
              if (initial !== PRIME_OBJECT.initial || [2,3,5,7,11,13,17,19,23].indexOf(theory.sector+1) >= 0) {
                await this.store.dispatch("logicEliminateLevel", {
                  sector: theory.sector,
                  object: initial,
                  newPacket: false
                });
              }
            }
          }
        } else {
          await this.store.dispatch("logicEliminateLevel", {
            sector: theory.sector,
            object: theory.spaceObject.initial,
            newPacket: false
          });
        }
      }
    }
  }
});
</script>

<style scoped>
.popover_container {
  padding: 1em;
}

ion-button {
  text-transform: none;
}
</style>
