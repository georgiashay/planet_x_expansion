<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Game Over</h3>
          <h5>Game Code: {{store.state.gameCode}}</h5>
        </div>
        <div id="sector_objects">
          <ion-item-group>
            <ion-item
              v-for="(obj, index) in sectorObjects"
              :key="index">
              Sector {{index+1}}:&nbsp;&nbsp;&nbsp;
              <ion-icon :src="obj.icon"></ion-icon>&nbsp;
              {{obj.proper}}
            </ion-item>
          </ion-item-group>
        </div>
        <ion-button
          expand="block"
          color="medium"
          id="return_button"
          router-link="/home">
          Return to Start Screen
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonButton,
          IonItem, IonItemGroup } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SpaceObject } from '@/constants';

export default defineComponent({
  name: 'EndGame',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItem,
    IonItemGroup
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
    sectorObjects: function(): Array<any> {
      const spaceObjectKeys = Object.keys(SpaceObject);
      const initials = spaceObjectKeys
                        .map((key: string) => SpaceObject[key].initial);
      const initialToSpaceObject = (obj: any) => SpaceObject[spaceObjectKeys[initials.indexOf(obj.initial)]];

      return this.store.state.game.board.objects.map((obj: any) => {
        return initialToSpaceObject(obj);
      });
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

#return_button {
  text-transform: none;
  margin-top: 10px;
}
</style>
