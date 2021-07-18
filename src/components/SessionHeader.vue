<template>
  <ion-header v-if="showHeader">
    <ion-item id="status_bar" color="light" v-if="recentActions.length === 0">
      <div id="sky_sectors">
        <ion-icon src="/assets/sun.svg"/>
        &nbsp;{{SKY_NAME.proper}}: {{store.getters.skyStart + 1}}-{{store.getters.skyEnd + 1}}
      </div>
      <ion-title id="phase_name">- {{phaseName}} -</ion-title>
      <div id="right_icons">
        <div id="home_icon" @click="openHome()">
          <ion-icon :src="homeOutline" />
        </div>
        <div id="settings_icon" @click="openSettings()" v-if="!matchMedia.lg || !store.state.isSession">
          <ion-icon :src="settingsOutline"></ion-icon>
        </div>
        <div id="menu_icon" @click="openMenu()" v-if="!hideMenu && matchMedia.md && !matchMedia.lg">
          <ion-icon :icon="menuOutline" />
        </div>
      </div>
    </ion-item>
    <ion-item color="dark" v-else>
      <ion-label class="action_notif">{{recentActions[recentActions.length-1].message}}</ion-label>
    </ion-item>
  </ion-header>
</template>

<script lang="ts">
import { IonHeader, IonTitle, IonItem,
        IonLabel, IonIcon, menuController,
        popoverController, alertController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import RecentActions from "@/mixins/RecentActions.ts";
import { menuOutline, settingsOutline, homeOutline } from "ionicons/icons";
import SettingsPopover from "@/components/SettingsPopover.vue";
import { useMatchMedia } from '@cwist/vue-match-media';
import { SKY_NAME } from "@/constants.ts";

export default defineComponent({
  name: "GameFooter",
  components: {
    IonHeader,
    IonTitle,
    IonItem,
    IonLabel,
    IonIcon
  },
  props: {
    hideAt: {
      type: String,
      default: ""
    },
    hideMenu: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      store: useStore(),
      router: useRouter(),
      matchMedia: useMatchMedia(),
      settingsOutline,
      menuOutline,
      homeOutline,
      SKY_NAME
    }
  },
  mixins: [RecentActions],
  computed: {
    phaseName: function(): string {
      const actionName = this.store.state.session.currentAction.actionType.split("_").map((word: string)=>word.slice(0,1) + word.slice(1).toLowerCase()).join(" ");
      let name = actionName;
      if (this.store.state.session.currentAction.actionType === "PLAYER_TURN") {
        const playerID = this.store.state.session.currentAction.playerID;
        let playerName;
        if (playerID === this.store.state.playerID) {
          playerName = "My";
        } else {
          playerName = this.store.getters.playerMap[playerID].name + "'s";
        }

        name = playerName + " Turn";
      }
      return name;
    },
    showHeader: function(): boolean {
      if (this.hideAt === "") {
        return true;
      } else {
        return !this.matchMedia[this.hideAt as string];
      }
    }
  },
  methods: {
    openMenu: function() {
      menuController.toggle("menu");
    },
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
  }
});
</script>

<style scoped>
#phase_name {
  text-align: center;
}

#sky_sectors {
  display: flex;
  align-items: center;
  align-content: center;
  vertical-align: middle;
  position: absolute;
}

#right_icons {
  display: flex;
  align-items: center;
  align-content: center;
  vertical-align: middle;
  position: absolute;
  right: 0;
  margin-right: 0.5em;
}

#right_icons ion-icon {
  margin: 0.2em;
}

.action_notif {
  text-align: center;
}

</style>
