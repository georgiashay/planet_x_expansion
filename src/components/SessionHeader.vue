<template>
  <ion-header>
    <!-- <ion-toolbar color="dark" v-if="recentActions.length === 0"> -->
    <ion-item color="dark" v-if="recentActions.length === 0">
      <ion-title id="phase_name">- {{phaseName}} -</ion-title>
    </ion-item>
    <!-- </ion-toolbar> -->
    <!-- <ion-item-group v-else>
      <ion-item color="dark" v-for="(action, index) in recentActions" :key="index" class = "action_notif">
        <ion-label>{{action.message}}</ion-label>
      </ion-item>
    </ion-item-group> -->
    <ion-item color="light" v-else>
      <ion-label class="action_notif">{{recentActions[recentActions.length-1].message}}</ion-label>
    </ion-item>
  </ion-header>
</template>

<script lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonItem, IonItemDivider, IonItemGroup, IonLabel } from '@ionic/vue';
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
    IonLabel
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

.action_notif {
  text-align: center;
}
</style>
