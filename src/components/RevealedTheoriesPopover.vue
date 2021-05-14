<template>
  <div class="popover_container">
    <h2>Revealed Theories</h2>
    <ion-item color="light" v-for="(theory, i) in revealedTheories" :key="i">
      Sector {{theory.sector + 1}}: is {{theory.accurate ? "" : "not "}}{{theory.spaceObject.one}}
      &nbsp;<ion-icon :src="theory.spaceObject.icon"/>
    </ion-item>
    <ion-button color="light" expand="block" @click="close()">Close</ion-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController, IonIcon, IonItem, IonButton } from '@ionic/vue';

export default defineComponent({
  name: 'RevealedTheoriesPopover',
  components: {
    IonIcon,
    IonItem,
    IonButton
  },
  props: ['revealedTheories'],
  methods: {
    close: async function(obj: any) {
      await popoverController.dismiss();
    }
  }
});
</script>

<style scoped>
.popover_container {
  padding: 1em;
}
</style>
