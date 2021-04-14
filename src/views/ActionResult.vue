<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Current Action: {{currentAction}}</h3>
        </div>
        <p>Advance Player Pawn: {{store.state.lastActionResult.timeCost}}<ion-icon :icon="timeOutline" size="small"/>  &gt;&gt;&gt;&gt;&gt;</p>
        <p>{{store.state.lastActionResult.text}}</p>
        <ion-item-divider/>
        <ion-button
          expand="block"
          color="medium"
          router-link="/multiplayer/gamemenu"
          id="continue_button">
          Continue <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title>Game Code: {{ store.state.gameCode }}</ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonIcon, IonFooter,
        IonToolbar, IonTitle } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { SpaceObject } from '@/constants';

export default defineComponent({
  name: 'ActionResult',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonItemDivider,
  },
  data() {
    const store = useStore();
    return {
      store,
      arrowForwardOutline,
      timeOutline
    }
  },
  computed: {
    currentAction: function(): string {
      const actionName = this.store.state.lastActionResult.actionType || "None";
      return actionName[0].toUpperCase() + actionName.slice(1);
    }
  }
});
</script>

<style scoped>
#container {
  padding: 20px;
}

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

#continue_button {
  margin-top: 10px;
  text-transform: none;
}
</style>
