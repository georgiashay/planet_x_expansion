<template>
  <ion-page>
    <ion-content>
      <centered-container class="media-container">
        <div id="title_container">
          <h3>Media Credits</h3>
        </div>
        <div id="credits">
          <ion-grid id="credit_grid">
            <ion-row
              v-for="(credit, index) in MEDIA_CREDITS"
              :key="index"
              class="credit_row">
              <ion-col size="1">
                <ion-icon v-if="credit.type === 'image'" :src="imageOutline"/>
                <ion-icon v-if="credit.type === 'sound'" :src="musicalNotesOutline"/>
                <ion-icon v-if="credit.type === 'icon'" :src="shapesOutline"/>
              </ion-col>
              <ion-col size="4">
                {{credit.name}}
              </ion-col>
              <ion-col size="7">
                <a :href="credit.url" target="_blank">{{credit.credit}}</a>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </centered-container>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonGrid,
         IonRow, IonCol, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import Stripe from "@/components/Stripe.vue";
import Spacer from "@/components/Spacer.vue";
import CenteredContainer from "@/components/CenteredContainer.vue";
import { MEDIA_CREDITS } from "@/constants.ts";
import { imageOutline, musicalNotesOutline, shapesOutline } from "ionicons/icons";

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    CenteredContainer,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon
  },
  data() {
    return {
      MEDIA_CREDITS,
      imageOutline,
      musicalNotesOutline,
      shapesOutline
    }
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

#credit_grid {
  background-color: rgba(0, 0, 0, 0.5);
}

#credit_grid a {
  color: var(--ion-text-color);
}

.media-container {
  --max-container-width: 90%;
}
</style>
