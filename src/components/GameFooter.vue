<template>
  <ion-footer>
    <ion-toolbar color="dark">
      <ion-title id="game_code" v-if="!store.state.isSession">Game Code: {{ store.state.gameCode }}</ion-title>
      <ion-title id="game_code" v-else>Session Code: {{ store.state.sessionCode }}</ion-title>
      <ion-nav-link id="history_link" v-if="showHistoryLink" router-link="/multiplayer/history">History</ion-nav-link>
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
import { IonFooter, IonToolbar,
          IonTitle, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "vuex";

export default defineComponent({
  name: "GameFooter",
  components: {
    IonFooter,
    IonToolbar,
    IonTitle,
    IonNavLink
  },
  props: {
    showHistoryLink: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      store: useStore()
    }
  }
});
</script>

<style scoped>
#game_code {
  float:left;
}

#history_link {
  float:right;
  text-decoration: underline;
  margin-right: 20px;
}
</style>
