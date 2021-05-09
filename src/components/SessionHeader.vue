<template>
  <ion-header>
    <ion-item id="status_bar" color="dark" v-if="recentActions.length === 0">
      <div id="sky_start">
        <ion-icon src="/assets/sun.svg"/>
        &nbsp;{{store.getters.skyStart + 1}}
      </div>
      <ion-title id="phase_name">- {{phaseName}} -</ion-title>
      <div id="sky_end">
        {{store.getters.skyEnd + 1}}
        &nbsp;<ion-icon src="/assets/moon.svg"/>
      </div>
    </ion-item>
    <ion-item color="light" v-else>
      <ion-label class="action_notif">{{recentActions[recentActions.length-1].message}}</ion-label>
    </ion-item>
  </ion-header>
</template>

<script lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "vuex";
import RecentActions from "@/mixins/RecentActions.ts";

export default defineComponent({
  name: "GameFooter",
  components: {
    IonHeader,
    // IonToolbar,
    IonTitle,
    IonItem,
    // IonItemGroup
    IonLabel,
    IonIcon
  },
  data: function() {
    return {
      store: useStore()
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
  }
});
</script>

<style scoped>
#phase_name {
  text-align: center;
}

#sky_start {
  float: left;
  text-align: left;
}

#sky_end {
  float: right;
  text-align: right;
}

.action_notif {
  text-align: center;
}

#sky_start {
  display: flex;
  align-items: center;
  align-content: center;
  vertical-align: middle;
}

#sky_end {
  display: flex;
  align-items: center;
  align-content: center;
  vertical-align: middle;
}
</style>
