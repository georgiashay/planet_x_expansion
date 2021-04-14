<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Current Action: Research</h3>
        </div>
        <div id="research_selections">
          Select a research item:
          <ion-button
            expand="block"
            v-for="(research, index) in store.state.game.research"
            :key="index"
            :color="buttonColor(index)"
            @click="selectedResearch = (selectedResearch == index ? undefined : index)"
            >
            {{String.fromCharCode(index+65)}}. {{research.categoryName}}
          </ion-button>
        </div>
        <ion-item-divider/>
        <ion-button
          expand="block"
          color="medium"
          @click="research()"
          id="research_button"
          :disabled="selectedResearch === undefined">
          Reveal Information
            <ion-icon :icon="arrowForwardOutline"></ion-icon>
        </ion-button>
        <div id="cancel_container">
          <ion-nav-link router-link="/multiplayer/gamemenu">Cancel</ion-nav-link>
        </div>
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
        IonToolbar, IonTitle, IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SpaceObject } from '@/constants';

export default defineComponent({
  name: 'Research',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonItemDivider,
    IonNavLink
  },
  data() {
    const store = useStore();
    const router = useRouter();
    return {
      store,
      arrowForwardOutline,
      timeOutline,
      selectedResearch: undefined,
      router,
    }
  },
  methods: {
    buttonColor: function(index: string) {
      if (this.selectedResearch == index) {
        return "light";
      } else {
        return "medium";
      }
    },
    research: function() {
      this.store.commit('research', {
        index: this.selectedResearch
      });
      this.selectedResearch = undefined;
      this.router.push('/multiplayer/action/research/result');
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

#research_button {
  margin-top: 10px;
  text-transform: none;
}

#research_selections {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

#research_selections ion-button {
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
</style>
