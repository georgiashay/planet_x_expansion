<template>
  <ion-page>
    <session-header v-if="store.state.isSession"/>
    <ion-content>
      <board-wheel />
    </ion-content>
    <game-footer/>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "vuex";
import GameFooter from "@/components/GameFooter.vue";
import SessionHeader from "@/components/SessionHeader.vue";
import BoardWheel from "@/components/BoardWheel.vue";

export default defineComponent({
  name: 'BoardPage',
  components: {
    IonContent,
    IonPage,
    GameFooter,
    SessionHeader,
    BoardWheel
  },
  data() {
    return {
      store: useStore()
    }
  }
});
</script>

<style scoped>
</style>
