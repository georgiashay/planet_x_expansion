<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-at="md"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>History</h3>
        </div>
        <ion-item color="light" v-if="store.state.isSession && store.state.session.players.length > 1">
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-button class="player_button" :color="buttonColor(0)" expand="block" @click="filterNum = 0;">All</ion-button>
              </ion-col>
              <ion-col
                v-for="(player, index) in players"
                :key="index">
                <ion-button class="player_button" :color="buttonColor(player.num)" expand="block" @click="filterNum = player.num;">{{player.name}}</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
        <div id="history">
          <ion-button
            expand="block"
            color="light"
            :router-link="'/' + gameType + '/startinginfo'"
            class="history-item"
            v-if="!store.state.isSession || filterNum === 0 || filterNum === store.getters.playerInfo.num">
            <span class="ion-text-left">Starting Information, {{store.state.seasonView.name }} {{ store.state.seasonView.viewType }}</span>
          </ion-button>
          <template v-if="store.state.isSession">
            <ion-button
              v-for="(item, index) in filteredHistory"
              :key="index"
              expand="block"
              :color="item.mine ? 'light' : 'medium'"
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
    <game-footer :show-history-link="false" hide-at="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage,
        IonButton, IonNavLink, IonItem,
        IonGrid, IonRow, IonCol } from '@ionic/vue';
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
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
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
      router,
      filterNum: 0
    }
  },
  computed: {
    players: function(): Array<any> {
      return this.store.state.session.players.slice().sort((a: any, b: any) => a.num - b.num);
    },
    selectedGameHistory: function(): Array<any> {
      return this.store.state.history.map((item: any, index: number) => {
        return { item, index };
      }).filter((item: any) => {
        // Don't display peer reviews in history
        return item.item.actionType != "peerreview";
      });
    },
    filteredHistory: function(): Array<any> {
      const history = this.store.getters.selectedHistory;

      if (this.filterNum === 0) {
        return history;
      } else {
        return history.filter((action: any) => action.playerNum === this.filterNum || action.playerNum === undefined);
      }
    }
  },
  methods: {
    buttonColor: function(i: number) {
      if (i === this.filterNum) {
        return "dark";
      } else {
        return "medium";
      }
    },
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

.player_button {
  text-transform: none;
}

.button-disabled {
  opacity: 1;
}
</style>
