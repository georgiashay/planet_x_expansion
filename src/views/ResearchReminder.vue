<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Current Action: Research</h3>
        </div>
        <div id="reminder">
        <p>Reminder: You must choose a different action on your next turn; you cannot take the research action twice in a row.</p>
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
    <game-footer/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import GameFooter from "@/components/GameFooter.vue";

export default defineComponent({
  name: 'ResearchReminder',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonItemDivider,
    GameFooter
  },
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

#reminder p {
  font-style: italic;
}

#continue_button {
  margin-top: 10px;
  text-transform: none;
}
</style>
