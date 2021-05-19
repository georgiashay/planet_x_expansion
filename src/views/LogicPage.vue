<template>
  <ion-page>
    <session-header v-if="store.state.isSession"/>
    <ion-content>
      <logic-sheet ref="logicSheet"/>
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
import LogicSheet from "@/components/LogicSheet.vue";

export default defineComponent({
  name: 'LogicPage',
  components: {
    IonContent,
    IonPage,
    GameFooter,
    SessionHeader,
    LogicSheet
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
