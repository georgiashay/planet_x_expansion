<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" v-if="store.getters.playerReady">
        <div id="title_container">
          <h3>Submit Theories</h3>
        </div>
        <div id="theory_selections">
          <ion-item color="dark">
            <ion-label position="floating">Number of Theories</ion-label>
            <ion-input v-model="numTheories" type="number" min="0" :max="maxTheories"></ion-input>
          </ion-item>
          <ion-item-divider/>
          <template v-for="(theory, i) in theories.slice(0, numTheories)" :key="i">
            <ion-item-divider v-if="i>0"/>
            <sector-select
              :label="'Sector: '"
              :value="theory.sector"
              @input="theory.sector = $event;"
              :columns="6"/>
            <space-object-select
              :label ="'Space Object: '"
              :value="theory.spaceObject"
              @input="theory.spaceObject = $event;"
              :exclude-objects="['PLANET_X', 'EMPTY']"
              :columns="3"
              :show-name="false"/>
          </template>
        </div>
        <ion-button
          expand="block"
          color="dark"
          @click="submitTheories()"
          id="theory_button"
          :disabled="!theoriesReady">
          Submit Theories
        </ion-button>
        <ion-item-divider/>
        <div id="cancel_container">
          <ion-nav-link :router-link="'/' + gameType + '/gamemenu'">Cancel</ion-nav-link>
        </div>
      </div>
    </ion-content>
    <game-footer/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonItemDivider,
        IonButton, IonNavLink,
        IonInput, IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import { arrowForwardOutline, timeOutline } from 'ionicons/icons';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SpaceObject } from '@/constants';
import SpaceObjectSelect from '@/components/SpaceObjectSelect.vue';
import SectorSelect from '@/components/SectorSelect.vue';
import SoundMixin from "@/mixins/SoundMixin.ts";
import GameFooter from "@/components/GameFooter.vue";

export default defineComponent({
  name: 'Survey',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItemDivider,
    IonNavLink,
    SpaceObjectSelect,
    SectorSelect,
    GameFooter,
    IonInput,
    IonItem,
    IonLabel
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
    const router = useRouter();
    return {
      store,
      arrowForwardOutline,
      timeOutline,
      SpaceObject,
      numTheories: 0,
      theories: [],
      router,
    }
  },
  computed: {
    maxTheories: function(): number {
      if (this.store.getters.myNextAction == null) {
        return 0;
      } else if (this.store.getters.myNextAction.actionType === "THEORY_PHASE") {
        return this.store.state.gameType.theoriesPerTurn;
      } else if (this.store.getters.myNextAction.actionType === "LAST_ACTION"){
        if (this.store.getters.sectorsBehind <= 3) {
          return 1;
        } else {
          return 2;
        }
      } else {
        return 0;
      }
    },
    theoriesReady: function(): boolean {
      for (let i = 0; i < this.numTheories; i++) {
        if (this.theories[i].spaceObject === undefined || this.theories[i].sector === undefined) {
          return false;
        }
      }
      return true;
    }
  },
  methods: {
    submitTheories: function() {
      this.store.dispatch('submitTheories', this.theories.slice(0, this.numTheories));
      this.router.push('/' + this.gameType + '/gamemenu');
    },
    clearSelections: function() {
      this.numTheories = this.maxTheories;
      this.theories = Array.from(Array(this.maxTheories)).map(() => {return {};});
    }
  },
  ionViewWillEnter() {
    this.clearSelections();
  },
  ionViewDidEnter() {
    this.playSonar1();
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

#theory_selections {
  margin-top: 20px;
}

#theory_button {
  margin-top: 10px;
  text-transform: none;
}

#theory_button ion-icon {
  font-size: 1.2em;
}

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}
</style>
