<template>
  <ion-page>
    <ion-content>
      <adaptable-container v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Game Over</h3>
          <h5 v-if="!store.state.isSession">Game Code: {{store.state.gameCode}}</h5>
          <h5 v-else>Session Code: {{store.state.sessionCode}}</h5>
        </div>
        <div id="sector_objects">
          <ion-grid>
            <ion-row
              v-for="(obj, index) in sectorObjects"
              :key="index"
              class="reveal_row">
              <ion-col size="4" class="sector_num">
                {{SECTOR_NAME.proper}} {{index + 1}}
              </ion-col>
              <ion-col size="8" class="revealed_obj">
                <ion-icon :src="obj.icon"></ion-icon>&nbsp;
                {{obj.proper}}
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <ion-button
          expand="block"
          color="light"
          id="return_button"
          router-link="/home">
          Return to Start Screen
        </ion-button>
      </adaptable-container>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonButton,
          IonGrid, IonCol, IonRow, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { initialToSpaceObject, SECTOR_NAME } from '@/constants';
import SoundMixin from "@/mixins/SoundMixin.ts";
import AdaptableContainer from "@/components/AdaptableContainer.vue";

export default defineComponent({
  name: 'EndGame',
  components: {
    IonContent,
    IonPage,
    IonGrid,
    IonCol,
    IonRow,
    IonIcon,
    IonButton,
    AdaptableContainer
  },
  mixins: [SoundMixin],
  data() {
    const store = useStore();
    const router = useRouter();
    return {
      store,
      router,
      SECTOR_NAME
    }
  },
  computed: {
    sectorObjects: function(): Array<any> {
      return this.store.state.game.board.objects.map((obj: any) => {
        return initialToSpaceObject[obj.initial];
      });
    }
  },
  ionViewDidEnter() {
    this.playSound("sonar1");
  }
});
</script>

<style scoped>
#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#return_button {
  text-transform: none;
  margin-top: 10px;
}

.reveal_row {
  padding: 7px;
  border-bottom: 1px solid lightgray;
}

.reveal_row ion-col {
  display: flex;
  align-content: center;
  align-items: center;
  padding-top: 3px;
  padding-bottom: 3px;
}

.revealed_obj ion-icon {
  font-size: 2em;
}

.sector_num {
  font-style: bold;
}
</style>
