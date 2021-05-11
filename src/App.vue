<template>
  <ion-app>
    <ion-split-pane content-id="main" when="lg" v-if="store.state.isSession && store.getters.gameReady && screenSizeAtLeast('md')">
      <ion-menu content-id="main" side="end">
        <ion-router-outlet />
      </ion-menu>

      <div id="main" v-show="screenSizeAtLeast('lg')">
        <board-wheel/>
      </div>
      <ion-router-outlet id="main" v-show="!screenSizeAtLeast('lg')"/>
    </ion-split-pane>
    <ion-router-outlet v-else/>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu } from '@ionic/vue';
import { defineComponent } from 'vue';
import ScreenSize from "@/mixins/ScreenSize.ts";
import BoardWheel from "@/views/BoardWheel.vue"
import { useStore } from "vuex";

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
    BoardWheel
  },
  mixins: [ScreenSize],
  data() {
    return {
      store: useStore()
    }
  }
});
</script>
