<template>
  <ion-header>
    <ion-toolbar color="dark">
      <!-- {{store.state.session.currentAction}} -->
      <ion-title id="phase_name">- {{phaseName}} -</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { IonHeader, IonToolbar, IonTitle } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "vuex";

export default defineComponent({
  name: "GameFooter",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle
  },
  data: function() {
    return {
      store: useStore()
    }
  },
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
</style>
