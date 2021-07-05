<template>
  <div id="results-summary" :class="[fullScroll ? '' : 'content-scroll']">
    <h5 id="summary_title">Results Summary</h5>
    <ion-grid v-if="!useVerticalLayout" class="summary-horizontal">
      <ion-row class="title_row">
        <b>Conferences</b>
      </ion-row>
      <ion-row >
        <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
          v-for="(conference, index) in resultsSummary.allConferences"
          :key="index"
          class="reveal_row">
          <slot name="conference" v-bind:conference="conference" v-bind:index="index"></slot>
        </ion-col>
      </ion-row>
      <ion-row class="title_row">
        <b>Research</b>
      </ion-row>
      <ion-row >
        <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
          v-for="(research, index) in resultsSummary.allResearch"
          :key="index"
          class="reveal_row">
          <slot name="research" v-bind:research="research" v-bind:index="index"></slot>
        </ion-col>
      </ion-row>
      <ion-row v-if="resultsSummary.located.length > 0" class="title_row">
        <b>Locate Planet X Attempts</b>
      </ion-row>
      <ion-row v-if="resultsSummary.located.length > 0">
        <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
          v-for="(locate, index) in resultsSummary.located"
          :key="index"
          class="reveal_row">
          <slot name="locate" v-bind:locate="locate" v-bind:index="index"></slot>
        </ion-col>
      </ion-row>
      <ion-row v-if="resultsSummary.surveyed.length > 0" class="title_row">
        <b>Surveys</b>
      </ion-row>
      <ion-row v-if="resultsSummary.surveyed.length > 0">
        <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
          v-for="(survey, index) in resultsSummary.surveyed"
          :key="index"
          class="reveal_row">
          <slot name="survey" v-bind:survey="survey" v-bind:index="index"></slot>
        </ion-col>
      </ion-row>
      <ion-row v-if="resultsSummary.targeted.length > 0" class="title_row">
        <b>Targets</b>
      </ion-row>
      <ion-row v-if="resultsSummary.targeted.length > 0">
        <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
          v-for="(target, index) in resultsSummary.targeted"
          :key="index"
          class="reveal_row">
          <slot name="target" v-bind:target="target" v-bind:index="index"></slot>
        </ion-col>
      </ion-row>
      <ion-row v-if="resultsSummary.revealed.length > 0" class="title_row">
        <b>Revealed Theories</b>
      </ion-row>
      <ion-row v-if="resultsSummary.revealed.length > 0">
        <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
          v-for="(theory, index) in resultsSummary.revealed"
          :key="index"
          class="reveal_row">
          <slot name="theory" v-bind:theory="theory" v-bind:index="index"></slot>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-grid v-else-if="numColumns === 3" class="summary-vertical">
      <ion-row>
        <ion-col size-xs="4">
          <ion-row class="title_row">
            <b>Conferences</b>
          </ion-row>
          <ion-row
            v-for="(conference, index) in resultsSummary.allConferences"
            :key="index"
            class="reveal_row">
            <slot name="conference" v-bind:conference="conference" v-bind:index="index"></slot>
          </ion-row>
          <ion-row class="title_row">
            <b>Research</b>
          </ion-row>
          <ion-row
            v-for="(research, index) in resultsSummary.allResearch"
            :key="index"
            class="reveal_row">
            <slot name="research" v-bind:research="research" v-bind:index="index"></slot>
          </ion-row>
        </ion-col>
        <ion-col size-xs="4" v-if="resultsSummary.surveyed.length > 0">
          <ion-row class="title_row">
            <b>Surveys</b>
          </ion-row>
          <ion-row
            v-for="(survey, index) in resultsSummary.surveyed"
            :key="index"
            class="reveal_row">
            <slot name="survey" v-bind:survey="survey" v-bind:index="index"></slot>
          </ion-row>
        </ion-col>
        <ion-col size-xs="4">
          <template v-if="resultsSummary.targeted.length > 0">
            <ion-row class="title_row">
              <b>Targets</b>
            </ion-row>
            <ion-row
              v-for="(target, index) in resultsSummary.targeted"
              :key="index"
              class="reveal_row">
              <slot name="target" v-bind:target="target" v-bind:index="index"></slot>
            </ion-row>
          </template>
          <template v-if="resultsSummary.located.length > 0">
            <ion-row class="title_row">
              <b>Locate Planet X Attempts</b>
            </ion-row>
            <ion-row
              v-for="(locate, index) in resultsSummary.located"
              :key="index"
              class="reveal_row">
              <slot name="locate" v-bind:locate="locate" v-bind:index="index"></slot>
            </ion-row>
          </template>
          <template v-if="resultsSummary.revealed.length > 0">
            <ion-row class="title_row">
              <b>Revealed Theories</b>
            </ion-row>
            <ion-row
              v-for="(theory, index) in resultsSummary.revealed"
              :key="index"
              class="reveal_row">
              <slot name="theory" v-bind:theory="theory" v-bind:index="index"></slot>
            </ion-row>
          </template>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-grid v-else-if="numColumns === 4" class="summary-vertical">
      <ion-row>
        <ion-col size-xs="3">
          <ion-row class="title_row">
            <b>Conferences</b>
          </ion-row>
          <ion-row
            v-for="(conference, index) in resultsSummary.allConferences"
            :key="index"
            class="reveal_row">
            <slot name="conference" v-bind:conference="conference" v-bind:index="index"></slot>
          </ion-row>
          <ion-row class="title_row">
            <b>Research</b>
          </ion-row>
          <ion-row
            v-for="(research, index) in resultsSummary.allResearch"
            :key="index"
            class="reveal_row">
            <slot name="research" v-bind:research="research" v-bind:index="index"></slot>
          </ion-row>
        </ion-col>
        <ion-col size-xs="3" v-if="resultsSummary.surveyed.length > 0">
          <ion-row class="title_row">
            <b>Surveys</b>
          </ion-row>
          <ion-row
            v-for="(survey, index) in resultsSummary.surveyed"
            :key="index"
            class="reveal_row">
            <slot name="survey" v-bind:survey="survey" v-bind:index="index"></slot>
          </ion-row>
        </ion-col>
        <ion-col size-xs="3">
          <template v-if="resultsSummary.targeted.length > 0">
            <ion-row class="title_row">
              <b>Targets</b>
            </ion-row>
            <ion-row
              v-for="(target, index) in resultsSummary.targeted"
              :key="index"
              class="reveal_row">
              <slot name="target" v-bind:target="target" v-bind:index="index"></slot>
            </ion-row>
          </template>
          <template v-if="resultsSummary.located.length > 0">
            <ion-row class="title_row">
              <b>Locate Planet X Attempts</b>
            </ion-row>
            <ion-row
              v-for="(locate, index) in resultsSummary.located"
              :key="index"
              class="reveal_row">
              <slot name="locate" v-bind:locate="locate" v-bind:index="index"></slot>
            </ion-row>
          </template>
        </ion-col>
        <ion-col size-xs="3" v-if="resultsSummary.revealed.length > 0">
          <ion-row class="title_row">
            <b>Revealed Theories</b>
          </ion-row>
          <ion-row
            v-for="(theory, index) in resultsSummary.revealed"
            :key="index"
            class="reveal_row">
            <slot name="theory" v-bind:theory="theory" v-bind:index="index"></slot>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonGrid, IonRow, IonCol } from '@ionic/vue';
import { useMatchMedia } from '@cwist/vue-match-media';

export default defineComponent({
  name: "ResultsSummary",
  props: {
    resultsSummary: {
      type: Object,
      required: true,
    },
    fullScroll: {
      type: Boolean,
      default: false
    },
    verticalLayout: {
      type: Boolean,
      default: false
    }
  },
  components: {
    IonGrid,
    IonRow,
    IonCol
  },
  data() {
    return {
      matchMedia: useMatchMedia()
    }
  },
  computed: {
    useVerticalLayout: function(): boolean {
      return this.verticalLayout && this.matchMedia.sm;
    },
    numColumns: function(): number {
      if (!this.matchMedia.sm) {
        return 2;
      } else if (!this.matchMedia.md) {
        return 3;
      } else if (!this.matchMedia.lg) {
        return 4;
      } else if (!this.matchMedia.xl) {
        return 3;
      } else {
        return 4;
      }
    }
  }
});
</script>
<style scoped>
#results-summary {
  background-color: var(--ion-color-light);
  color: var(--ion-color-light-contrast);
  width: calc(100% + 20px);
  border: 1px solid gray;
  padding: 5px;
  margin-left: -10px;
  margin-right: -10px;
  margin-bottom: -10px;
  margin-top: 10px;
  height: 100%;
}

#summary_title {
  margin-left: 6px;
  margin-bottom: 0;
  text-transform: uppercase;
}

.title_row {
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}

.content-scroll {
  overflow-y: auto;
}

.reveal_row {
  display: flex;
  align-content: center;
  align-items: center;
}

ion-col {
  --ion-grid-column-padding: 0px;
}
</style>
