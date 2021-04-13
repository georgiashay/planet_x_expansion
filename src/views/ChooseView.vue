<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="title_container">
          <h3>Choose Your View</h3>
        </div>
        <p>Select the view that matches the side of the board you are facing and your score sheet:</p>
        <div id="equinox_buttons">
          <ion-button
            expand="block"
            v-for="equinox in Equinox"
            :key="equinox"
            :color="buttonColor(equinox)"
            @click="selectedEquinox = (selectedEquinox == equinox ? undefined : equinox)"
            >
            {{equinox}} Equinox
          </ion-button>
          <ion-item-divider/>
          <ion-button
            v-if="selectedEquinox !== undefined"
            expand="block"
            color="medium"
            @click="continueGame()">
            Continue
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Equinox } from '@/constants';

export default defineComponent({
  name: 'ChooseView',
  components: {
    IonContent,
    IonPage,
    IonItemDivider,
    IonButton,
    IonIcon
  },
  data() {
    const store = useStore();
    const isGameCreator = true;
    return {
      store,
      isGameCreator,
      arrowForwardOutline,
      Equinox,
      selectedEquinox: undefined,
      router: useRouter()
    }
  },
  methods: {
    buttonColor: function(equinox: string) {
      if (this.selectedEquinox == equinox) {
        return "light";
      } else {
        return "medium";
      }
    },
    continueGame: function() {
      this.store.commit("setEquinox", this.selectedEquinox);
      this.router.push("/multiplayer/choosedifficulty");
    }
  },
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

#equinox_buttons {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
}

#equinox_buttons ion-button {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: none;
}

</style>
