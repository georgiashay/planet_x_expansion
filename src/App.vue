<template>
  <ion-app>
    <ion-split-pane content-id="main" when="lg" v-if="showSplitPane">
      <ion-menu
        content-id="main"
        side="end"
        menu-id="menu">
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
          <session-header />
          <ion-content>
            <board-wheel v-if="whichCircle === 'board'"/>
            <logic-sheet ref="logicSheet" v-if="whichCircle === 'logic'"/>
          </ion-content>
          <game-footer/>
        </template>
        <ion-router-outlet v-else />
      </ion-page>
    </ion-split-pane>
    <ion-router-outlet v-else />
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
import { useRoute, useRouter } from "vue-router";
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
      route: useRoute(),
      router: useRouter(),
      whichCircle: "board"
    }
  },
  computed: {
    showWheel: function(): boolean {
      return this.screenSizeAtLeast('lg') || this.store.getters.playerReady;
    },
    showSplitPane: function(): boolean {
      return this.store.state.isSession && this.store.getters.gameReady && this.screenSizeAtLeast('md');
    },
    showWheelInSplitPane: function(): boolean {
      return this.showSplitPane && this.showWheel;
    }
  },
  watch: {
    showWheelInSplitPane(newValue: boolean) {
      if (newValue && (this.route.path === "/session/board" || this.route.path === "/session/logic")) {
        this.router.replace("/session/gamemenu");
        if (this.route.path === "/session/board") {
          this.whichCircle = "board";
        } else if (this.route.path === "/session/logic") {
          this.whichCircle = "logic";
        }
      }
    }
  }
});
</script>
