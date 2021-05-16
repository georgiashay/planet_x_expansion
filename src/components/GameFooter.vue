<template>
  <ion-footer v-if="showFooter">
    <ion-toolbar color="light">
      <ion-title id="game_code" v-if="!store.state.isSession">Game Code: {{ store.state.gameCode }}</ion-title>
      <ion-title id="game_code" v-else>Session Code: {{ store.state.sessionCode }}</ion-title>
      <ion-nav-link id="history_link" v-if="allowedHistoryLink" @click="clickHistory()">History</ion-nav-link>
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
import { IonFooter, IonToolbar,
          IonTitle, IonNavLink, menuController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useMatchMedia } from '@cwist/vue-match-media';

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
    },
    hideAt: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      store: useStore(),
      router: useRouter(),
      matchMedia: useMatchMedia()
    }
  },
  computed: {
    historyLink: function(): string {
      return this.store.state.isSession ? "/session/history" : "/multiplayer/history";
    },
    showFooter: function(): boolean {
      if (this.hideAt === "") {
        return true;
      } else {
        return !this.matchMedia[this.hideAt as string];
      }
    },
    allowedHistoryLink: function(): boolean {
      return this.showHistoryLink && this.store.getters.playerReady && this.store.state.startingFacts !== undefined;
    }
  },
  methods: {
    clickHistory: function() {
      this.router.push(this.historyLink);
      if (this.matchMedia.md && !this.matchMedia.lg) {
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
