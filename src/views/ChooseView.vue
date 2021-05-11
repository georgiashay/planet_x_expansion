<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-above="md"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.gameReady">
        <div id="title_container">
          <h3>Choose Your View</h3>
        </div>
        <p>Select the view that matches the side of the board you are facing and your score sheet:</p>
        <div id="view_buttons">
          <ion-button
            expand="block"
            v-for="view in SeasonView"
            :key="view.name"
            :color="buttonColor(view)"
            @click="selectedView = (selectedView == view ? undefined : view)"
            >
            <ion-icon :src="view.icon"></ion-icon>&nbsp; {{ view.name }} {{ view.viewType }}
          </ion-button>
          <ion-item-divider/>
          <ion-button
            v-if="selectedView !== undefined"
            expand="block"
            color="dark"
            @click="continueGame()"
            id="continue_button">
            Continue
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </ion-content>
    <game-footer hide-above="md"/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SeasonView } from '@/constants';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";

export default defineComponent({
  name: 'ChooseView',
  components: {
    IonContent,
    IonPage,
    IonItemDivider,
    IonButton,
    IonIcon,
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
    return {
      store,
      arrowForwardOutline,
      SeasonView,
      selectedView: undefined,
      router: useRouter()
    }
  },
  methods: {
    buttonColor: function(view: string) {
      if (this.selectedView == view) {
        return "medium";
      } else {
        return "dark";
      }
    },
    continueGame: function() {
      this.store.commit("setSeasonView", this.selectedView);
      this.router.push("/" + this.gameType + "/choosedifficulty");
    },
    clearSelections: function() {
      this.selectedView = undefined;
    }
  },
  ionViewDidEnter() {
    this.playSound("sonar1");
  },
  ionViewDidLeave() {
    this.clearSelections();
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

#view_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

#view_buttons ion-button {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: none;
}

#view_buttons ion-icon {
  font-size: 2em;
}

#continue_button ion-icon {
  font-size: 1.2em;
}
</style>
