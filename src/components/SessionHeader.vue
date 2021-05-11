<template>
  <ion-header>
    <ion-item id="status_bar" color="dark" v-if="recentActions.length === 0">
      <div id="sky_sectors">
        <ion-icon src="/assets/sun.svg"/>
        &nbsp;Sky: {{store.getters.skyStart + 1}}-{{store.getters.skyEnd + 1}}
      </div>
      <ion-title id="phase_name">- {{phaseName}} -</ion-title>
    </ion-item>
    <ion-item color="light" v-else>
      <ion-label class="action_notif">{{recentActions[recentActions.length-1].message}}</ion-label>
    </ion-item>
  </ion-header>
</template>

<script lang="ts">
import { IonHeader, IonTitle, IonItem,
        IonItemDivider, IonLabel, IonIcon,
        menuController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "vuex";
import RecentActions from "@/mixins/RecentActions.ts";
import { gameControllerOutline, menuOutline } from "ionicons/icons";

export default defineComponent({
  name: "GameFooter",
  components: {
    IonHeader,
    IonTitle,
    IonItem,
    IonLabel,
    IonIcon
  },
  data: function() {
    return {
      store: useStore(),
      gameControllerOutline,
      menuOutline
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
    }
  },
  mounted() {
    menuController.enable(true, "menu");
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

.action_notif {
  text-align: center;
}

</style>
