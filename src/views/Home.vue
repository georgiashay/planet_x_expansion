<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="title_container">
        <h2>The Search For</h2>
        <h1><b>Planet X</b></h1>
        <h5>Unofficial Expansion</h5>
      </div>
      <div id="start_game_buttons">
        <ion-button expand="block" color="medium">Start New Game</ion-button>
        <ion-button expand="block" color="medium">Enter Game Code</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage
  }
});
</script>

<style scoped>
#title_container {
  font-family: sans-serif;
  text-transform: uppercase;
  text-align: center;
  margin-top: 25%;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#start_game_buttons {
  width: 80%;
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
