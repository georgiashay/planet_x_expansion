<template>
  <ion-page>
    <session-header v-if="store.state.isSession" hide-above="md"/>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Research &amp; Conferences</h3>
        </div>
        <p>The following research items and conferences are available this game. We encourage players to record these titles on their note sheets.</p>
        <ion-item-divider/>
        <div id="research">
          <b>Research</b>
          <p
            v-for="(research, index) in store.state.game.research"
            :key="index">
          {{String.fromCharCode(index+65)}}. {{research.categoryName}}
          </p>
        </div>
        <div id="conference">
          <b>Conference</b>
          <p
            v-for="(conference, index) in store.state.game.conference"
            :key="index">
            X{{index + 1}}. {{conference.categoryName}}
          </p>
        </div>
        <ion-item-divider/>
        <ion-button
          expand="block"
          color="dark"
          :router-link="'/' + gameType + '/gamemenu'"
          id="continue_button">
          Continue
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
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
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";

export default defineComponent({
  name: 'ResearchCategories',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonItemDivider,
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
      arrowForwardOutline
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

#research p {
  margin-top: 5px;
  margin-bottom: 5px;
}

#research {
  margin-top: 10px;
}

#conference p {
  margin-top: 5px;
  margin-bottom: 5px;
}

#conference {
  margin-top: 10px;
}

#continue_button {
  margin-top: 10px;
  text-transform: none;
}
</style>
