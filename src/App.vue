<template>
  <ion-app>
    <ion-split-pane content-id="main" when="lg" v-if="store.state.isSession && store.getters.gameReady && screenSizeAtLeast('md')">
      <ion-menu content-id="main" side="end" menu-id="menu">
        <ion-router-outlet />
      </ion-menu>

      <ion-page id="main">
        <template v-if="showWheel">
          <ion-segment v-model="whichCircle" color="dark">
            <ion-segment-button value="board" color="dark">
              Board
            </ion-segment-button>
            <ion-segment-button value="logic">
              Logic
            </ion-segment-button>
          </ion-segment>
          <session-header/>
          <ion-content>
            <board-wheel v-show="whichCircle === 'board'"/>
            <logic-sheet v-show="whichCircle === 'logic'"/>
          </ion-content>
          <game-footer/>
        </template>
        <ion-router-outlet v-else />
      </ion-page>
    </ion-split-pane>
    <ion-router-outlet v-else/>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, IonSplitPane,
        IonMenu, IonPage, IonSegment,
        IonSegmentButton, IonContent,
        menuController } from '@ionic/vue';
import { defineComponent } from 'vue';
import ScreenSize from "@/mixins/ScreenSize.ts";
import BoardWheel from "@/components/BoardWheel.vue";
import LogicSheet from "@/components/LogicSheet.vue";
import { useStore } from "vuex";
import SessionHeader from "@/components/SessionHeader.vue";
import GameFooter from "@/components/GameFooter.vue";

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
    BoardWheel,
    LogicSheet,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonContent,
    SessionHeader,
    GameFooter
  },
  mixins: [ScreenSize],
  data() {
    return {
      store: useStore(),
      whichCircle: "board"
    }
  },
  computed: {
    showWheel: function(): boolean {
      return this.screenSizeAtLeast('lg') || this.store.getters.playerReady;
    }
  }
});
</script>
