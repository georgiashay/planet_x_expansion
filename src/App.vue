<template>
  <ion-app>
    <ion-split-pane content-id="main" when="lg" v-if="store.state.isSession && store.getters.gameReady && screenSizeAtLeast('md')">
      <ion-menu content-id="main" side="end" menu-id="menu">
        <ion-router-outlet />
      </ion-menu>

      <ion-page id="main">
        <board-wheel v-if="showWheel"/>
        <ion-router-outlet v-else />
      </ion-page>
    </ion-split-pane>
    <ion-router-outlet v-else/>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonPage } from '@ionic/vue';
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
    BoardWheel,
    IonPage
  },
  mixins: [ScreenSize],
  data() {
    return {
      store: useStore()
    }
  },
  computed: {
    showWheel: function(): boolean {
      return this.screenSizeAtLeast('lg') || this.store.getters.playerReady;
    }
  }
});
</script>
