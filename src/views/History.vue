<template>
  <ion-page>
    <session-header v-if="store.state.isSession"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>History</h3>
        </div>
        <div id="history">
          <ion-button
            expand="block"
            color="dark"
            :router-link="'/' + gameType + '/startinginfo'">
            <span class="ion-text-left">Starting Information, {{store.state.seasonView.name }} {{ store.state.seasonView.viewType }}</span>
          </ion-button>
          <ion-button
            v-for="(item, index) in store.getters.fullHistory"
            :key="index"
            expand="block"
            color="dark"
            :disabled = "!item.mine"
            :router-link="'/' + gameType + '/action/result/' + item.historyIndex"
          >
            P{{item.playerNum}}:&nbsp;<span class="ion-text-left">{{item.actionText}}</span>
          </ion-button>
        </div>
        <ion-item-divider/>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/' + gameType + '/gamemenu'">Close History</ion-nav-link>
        </div>
      </div>
    </ion-content>
    <game-footer :show-history-link="false"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";

export default defineComponent({
  name: 'History',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItemDivider,
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
    selectedHistory: function(): Array<any> {
      return this.store.state.history.map((item: any, index: number) => {
        return { item, index };
      }).filter((item: any) => {
        // Don't display peer reviews in history
        return item.item.actionType != "PEER_REVIEW";
      });
    }
  },
  ionViewDidEnter() {
    this.playSonar1();
  }
});
</script>

<style scoped>
#container {
  padding: 20px;
}

#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
  margin-top: 25%;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#history {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
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
}
</style>
