<template>
  <ion-app>
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
            <ion-segment-button value="board">
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
        menuController, IonFab, IonFabButton,
        IonIcon, popoverController, alertController } from '@ionic/vue';
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
    },
    darkSetting(newValue: boolean) {
      if (newValue) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    },
    async websocketDisconnected(disconnected: boolean) {
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
          this.store.dispatch("listenSession");
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
    }
  },
  async mounted() {
    document.body.classList.add("dark");
    await this.store.dispatch("initializeStorage");
    await this.store.dispatch("restoreFromStorage");
  }
});
</script>
