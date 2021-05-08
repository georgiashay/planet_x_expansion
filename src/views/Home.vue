<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h2>The Search For</h2>
          <h1><b>Planet X</b></h1>
          <h5>Unofficial Expansion</h5>
        </div>
        <div id="start_game_buttons">
          <ion-item-divider/>
          <ion-button expand="block" color="dark" router-link = "/multiplayer/create">Start New Game</ion-button>
          <ion-button expand="block" color="dark" router-link = "/multiplayer/join">Enter Game Code</ion-button>
          <ion-button expand="block" color="dark" router-link = "/session/create">Start New Session</ion-button>
          <ion-button expand="block" color="dark" router-link = "/session/join">Enter Session Code</ion-button>
          <ion-button expand="block" color="dark" router-link = "/session/reconnect">Reconnect to Session</ion-button>
          <ion-item-divider/>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonButton, IonItemDivider } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import SoundMixin from "@/mixins/SoundMixin.ts";

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItemDivider
  },
  mixins: [SoundMixin],
  data() {
    return {
      store: useStore()
    }
  },
  ionViewDidEnter() {
    this.store.commit('resetGame');
    this.playStartup();
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

#start_game_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

#start_game_buttons ion-button {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: none;
}
</style>
