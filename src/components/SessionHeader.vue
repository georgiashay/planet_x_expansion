<template>
  <ion-header v-if="screenSizeAtMost(hideAbove)">
    <ion-item id="status_bar" color="light" v-if="recentActions.length === 0">
      <div id="sky_sectors">
        <ion-icon src="/assets/sun.svg"/>
        &nbsp;Sky: {{store.getters.skyStart + 1}}-{{store.getters.skyEnd + 1}}
      </div>
      <ion-title id="phase_name">- {{phaseName}} -</ion-title>
      <div id="right_icons">
        <div id="settings_icon" @click="openSettings()" v-if="screenSizeAtMost('md') || !store.state.isSession">
          <ion-icon :src="settingsOutline"></ion-icon>
        </div>
        <div id="menu_icon" @click="openMenu()" v-if="!hideMenu && screenSizeAtLeast('md') && screenSizeAtMost('md')">
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
        IonItemDivider, IonLabel, IonIcon,
        menuController, popoverController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "vuex";
import RecentActions from "@/mixins/RecentActions.ts";
import { menuOutline, settingsOutline } from "ionicons/icons";
import ScreenSize from "@/mixins/ScreenSize.ts";
import SettingsPopover from "@/components/SettingsPopover.vue";

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
    hideAbove: {
      type: String,
      default: "xl"
    },
    hideMenu: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      store: useStore(),
      settingsOutline,
      menuOutline
    }
  },
  mixins: [RecentActions, ScreenSize],
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
