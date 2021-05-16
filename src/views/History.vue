<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-above="sm"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>History</h3>
        </div>
        <div id="history">
          <ion-button
            expand="block"
            color="light"
            :router-link="'/' + gameType + '/startinginfo'"
            class="history-item">
            <span class="ion-text-left">Starting Information, {{store.state.seasonView.name }} {{ store.state.seasonView.viewType }}</span>
          </ion-button>
          <template v-if="store.state.isSession">
            <ion-button
              v-for="(item, index) in store.getters.selectedHistory"
              :key="index"
              expand="block"
              color="light"
              :disabled = "!item.mine"
              :router-link="'/' + gameType + '/action/result/' + item.historyIndex"
              class="history-item"
            >
              <span class = "ion-text-left"><span v-if="item.playerName !== undefined">{{item.playerName}}:&nbsp;</span>{{item.actionText}}</span>
            </ion-button>
          </template>
          <template v-else>
            <ion-button
              v-for="(item, index) in selectedGameHistory"
              :key="index"
              expand="block"
              color="light"
              :router-link="'/' + gameType + '/action/result/' + item.index"
              class="history-item">
            <span class="ion-text-left">{{item.item.actionText}}</span>
          </ion-button>
          </template>
        </div>
        <stripe/>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/' + gameType + '/gamemenu'">Close History</ion-nav-link>
        </div>
      </div>
    </ion-content>
    <game-footer :show-history-link="false" hide-above="sm"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import Stripe from "@/components/Stripe.vue";

export default defineComponent({
  name: 'History',
  components: {
    IonContent,
    IonPage,
    IonButton,
    Stripe,
    IonNavLink,
    GameFooter,
    SessionHeader
  },
  mixins: [SoundMixin],
  props: {
    gameType: {
      required: true,
      type: String
    }
  },
  data() {
    const store = useStore();
    const router = useRouter();
    return {
      store,
      router
    }
  },
  computed: {
    selectedGameHistory: function(): Array<any> {
      return this.store.state.history.map((item: any, index: number) => {
        return { item, index };
      }).filter((item: any) => {
        // Don't display peer reviews in history
        return item.item.actionType != "peerreview";
      });
    }
  },
  ionViewDidEnter() {
    this.playSound("sonar1");
  }
});
</script>

<style scoped>
#container {
  padding: 20px;
  max-width: var(--max-form-width);
  margin-left: auto;
  margin-right: auto;
  color: white;
}

#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
  margin-top: 15vh;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#history {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10vh;
}

#history ion-button {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: none;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

.ion-text-left {
  margin-right: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em;
}
</style>
