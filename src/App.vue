<template>
  <ion-app>
    <recent-actions/>
    <ion-fab slot="fixed" vertical="top" horizontal="end" v-if="showFloatingSettings">
      <ion-fab-button
        size="small"
        color="light"
        @click="openSettings()"
        side="start">
        <ion-icon :src="settingsOutline"></ion-icon>
      </ion-fab-button>
      <ion-fab-button
        size="small"
        color="light"
        @click="openHome()"
        side="end"
        v-if="!store.state.isSession && route.path !== '/home'">
        <ion-icon :src="homeOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-split-pane content-id="main" when="lg" v-if="showSplitPane">
      <ion-menu
        content-id="main"
        side="end"
        menu-id="menu">
        <ion-router-outlet/>
      </ion-menu>

      <ion-page id="main">
        <template v-if="showWheel">
          <ion-segment v-model="whichCircle">
            <ion-segment-button class="tab-segment" value="board" mode="md">
              Board
            </ion-segment-button>
            <ion-segment-button class="tab-segment" value="logic" mode="md">
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
        IonFab, IonFabButton, IonIcon,
        popoverController, alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import BoardWheel from "@/components/BoardWheel.vue";
import LogicSheet from "@/components/LogicSheet.vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import SessionHeader from "@/components/SessionHeader.vue";
import GameFooter from "@/components/GameFooter.vue";
import { settingsOutline, homeOutline } from "ionicons/icons";
import SettingsPopover from "@/components/SettingsPopover.vue";
import { useMatchMedia } from '@cwist/vue-match-media';
import KickListener from "@/mixins/KickListener.ts";
import { GOAL_OBJECT, THEME } from "@/constants.ts";
import { capitalize } from "@/utilities/stringUtils.ts";

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
    GameFooter,
    IonFab,
    IonFabButton,
    IonIcon
  },
  data() {
    return {
      store: useStore(),
      route: useRoute(),
      router: useRouter(),
      whichCircle: "board",
      settingsOutline,
      homeOutline,
      matchMedia: useMatchMedia()
    }
  },
  mixins: [KickListener],
  computed: {
    showWheel: function(): boolean {
      return this.matchMedia.lg || this.store.getters.playerReady;
    },
    showSplitPane: function(): boolean {
      return this.store.state.isSession && this.store.getters.gameReady && this.matchMedia.md;
    },
    showWheelInSplitPane: function(): boolean {
      return this.showSplitPane && this.showWheel;
    },
    showFloatingSettings: function(): boolean {
      return !this.store.state.isSession || (this.showSplitPane && this.matchMedia.lg);
    },
    darkSetting: function(): boolean {
      return this.store.state.settings.darkMode;
    },
    websocketDisconnected: function(): boolean {
      return this.store.getters.websocketDisconnected;
    },
    turnSubmissionFailure: function(): boolean {
      return this.store.state.turnSubmissionFailure;
    }
  },
  watch: {
    showWheelInSplitPane(newValue: boolean) {
      if (newValue && (this.route.path === "/session/board" || this.route.path === "/session/logic")) {
        // If we are now showing the wheel in split pane, the real path should be
        // gamemenu
        this.router.replace("/session/gamemenu");
        // Determine what wheel to show by the path
        if (this.route.path === "/session/board") {
          this.whichCircle = "board";
        } else if (this.route.path === "/session/logic") {
          this.whichCircle = "logic";
        }
      }
    },
    darkSetting(newValue: boolean) {
      if (newValue) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    },
    async websocketDisconnected(disconnected: boolean) {
      // Show alert if the websocket becomes disconnected
      if (disconnected) {
        const alert = await alertController.create({
          cssClass: 'custom-alert',
          header: 'Disconnected',
          message: 'You have been disconnected. Would you like to try to reconnect?',
          buttons: [
            {
              text: 'Leave Game',
              role: 'leave',
            }, {
              text: 'Reconnect',
              role: 'reconnect'
            }
          ],
          backdropDismiss: false
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
        if (role === "leave") {
          this.router.push("/home");
        } else if (role === "reconnect") {
          this.store.commit("setAwaitingTurnSubmission", false);
          this.store.dispatch("listenSession");
        }
      }
    },
    async turnSubmissionFailure(failure: boolean) {
      // Show alert if a turn cannot be submitted to the server
      if (failure) {
        const alert = await alertController.create({
          cssClass: 'custom-alert',
          header: 'Server Error',
          message: 'Unable to submit your turn to the server. Would you like to continue with this failure (your turn will be discarded)?',
          buttons: [
            {
              text: 'Leave',
              role: 'leave',
            }, {
              text: 'Continue',
              role: 'continue'
            }
          ],
          backdropDismiss: false
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
        if (role === "leave") {
          this.store.commit("setTurnSubmissionFailure", false);
          this.router.push("/home");
        } else if (role === "continue") {
          this.store.commit("setTurnSubmissionFailure", false);
          this.router.push("/session/gamemenu");
          this.store.commit("refillHistory");
        }
      }
    }
  },
  methods: {
    openSettings: async function() {
      const popover = await popoverController
        .create({
          component: SettingsPopover,
          cssClass: "custom-popover"
        });
      await popover.present();
      await popover.onDidDismiss();
    },
    openHome: async function() {
      // Check before going home if in a game
      if (this.route.path.startsWith("/session") || this.route.path.startsWith("/multiplayer")) {
        const alert = await alertController.create({
          cssClass: 'custom-alert',
          header: 'Home',
          message: 'Are you sure you want to leave the game and navigate home?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            }, {
              text: 'Yes',
              role: 'okay'
            }
          ]
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();
        if (role === "okay") {
          this.router.push("/home");
        }
      } else {
        this.router.push("/home");
      }
    }
  },
  async mounted() {
    document.body.classList.add("dark");
    await this.store.dispatch("initializeStorage");
    await this.store.dispatch("restoreFromStorage");

    // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
    // Set the name of the hidden property and the change event for visibility
    let hidden: string, visibilityChange: string;
    if (document.hidden !== undefined) { // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if ((document as any).msHidden !== undefined) {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if ((document as any).webkitHidden !== undefined) {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    // Listen to the session if the webpage becomes visible again
    document.addEventListener(visibilityChange, () => {
      if (!(document as any)[hidden]) {
        const ws = this.store.state.currentWebSocket;
        if (ws !== undefined && (ws.readyState == WebSocket.CLOSING || ws.readyState == WebSocket.CLOSED)) {
          this.store.dispatch("listenSession");
        }
      }
    });
  }
});
</script>
<style scoped>
ion-segment-button.tab-segment {
  --color: var(--ion-color-dark);
  --color-checked: var(--ion-color-dark);
  --background-checked: var(--ion-color-light-shade);
}
</style>
