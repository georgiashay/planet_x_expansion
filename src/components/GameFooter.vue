<template>
  <ion-footer v-if="screenSizeAtMost(hideAbove)">
    <ion-toolbar color="dark">
      <ion-title id="game_code" v-if="!store.state.isSession">Game Code: {{ store.state.gameCode }}</ion-title>
      <ion-title id="game_code" v-else>Session Code: {{ store.state.sessionCode }}</ion-title>
      <ion-nav-link id="history_link" v-if="showHistoryLink" @click="clickHistory()">History</ion-nav-link>
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
import { IonFooter, IonToolbar,
          IonTitle, IonNavLink, menuController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ScreenSize from "@/mixins/ScreenSize.ts";

export default defineComponent({
  name: "GameFooter",
  components: {
    IonFooter,
    IonToolbar,
    IonTitle,
    IonNavLink
  },
  mixins: [ScreenSize],
  props: {
    showHistoryLink: {
      type: Boolean,
      default: true
    },
    hideAbove: {
      type: String,
      default: "xl"
    }
  },
  data: function() {
    return {
      store: useStore(),
      router: useRouter()
    }
  },
  computed: {
    historyLink: function(): string {
      return this.store.state.isSession ? "/session/history" : "/multiplayer/history";
    }
  },
  methods: {
    clickHistory: function() {
      this.router.push(this.historyLink);
      if (this.breakpoint === "md") {
        menuController.open("menu");
      }
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
