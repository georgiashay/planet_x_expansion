iconRadii[j]<template>
  <div ref="container" id="container" v-if="store.getters.gameReady && store.state.isSession">
    <ion-fab slot="fixed" vertical="top" horizontal="start" v-if="matchMedia.sm">
      <ion-fab-button
        size="small"
        color="light"
        @click="showNumObjects($event)">
        <ion-icon :src="informationCircleOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-fab slot="fixed" vertical="top" horizontal="end" v-if="matchMedia.sm">
      <ion-item>
        <ion-label>Certain</ion-label>
        <ion-toggle v-model="certaintyLevel"></ion-toggle>
      </ion-item>
    </ion-fab>
    <div id="title_container">
      <h3>Logic Sheet</h3>
    </div>
    <div id="button-container" v-if="!matchMedia.sm">
      <ion-row>
        <ion-col>
          <ion-item style="--background: rgba(0,0,0,0); --border-color: rgba(0,0,0,0)">
            <ion-button
              color="light"
              @click="showNumObjects($event)"
              expand="full">
              <ion-icon :src="informationCircleOutline"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-col>
        <ion-col>
          <ion-item>
            <ion-label>Certain</ion-label>
            <ion-toggle v-model="certaintyLevel"></ion-toggle>
          </ion-item>
        </ion-col>
      </ion-row>
    </div>
    <div id="canvas-container">
      <canvas ref="logicCanvas" id="logicCanvas" height="3204" width="3204"/>
    </div>
    <div ref="cancelContainer" id="cancel_container_logic" v-if="!matchMedia.md">
      <ion-nav-link :router-link="'/session/gamemenu'">Return to Game Menu</ion-nav-link>
    </div>
    <div ref="resultsSummary" id="results-summary">
      <h5 id="summary_title">Results Summary</h5>
      <ion-grid>
        <ion-row class="title_row">
          <b>Conferences</b>
        </ion-row>
        <ion-row >
          <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
            v-for="(conference, index) in resultsSummary.allConferences"
            :key="index"
            :class="['reveal_row', conference.researched ? '' : 'not_researched']">
            <ion-checkbox
              :disabled="!conference.researched"
              @ionChange="conferenceUsedChanged(index, $event)"
              :checked="store.state.logic.conferenceUsed.has(index)"
              color="light">
            </ion-checkbox>
            &nbsp;<span :class="store.state.logic.conferenceUsed.has(index) ? 'used_clue' : 'unused_clue'">{{conference.index + 1}}. {{conference.shortText}}</span>
          </ion-col>
        </ion-row>
        <ion-row class="title_row">
          <b>Research</b>
        </ion-row>
        <ion-row >
          <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
            v-for="(research, index) in resultsSummary.allResearch"
            :key="index"
            :class="['reveal_row', research.researched ? '' : 'not_researched']">
              <ion-checkbox
                :disabled="!research.researched"
                @ionChange="researchUsedChanged(index, $event)"
                :checked="store.state.logic.researchUsed.has(index)"
                color="light">
              </ion-checkbox>
              &nbsp;<span :class="store.state.logic.researchUsed.has(index) ? 'used_clue' : 'unused_clue'">{{research.shortText}}</span>
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
              {{locate.leftObject.initial}}-{{locate.sector + 1}}-{{locate.rightObject.initial}}: {{locate.successful ? "✓" : "X"}}
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
            <ion-checkbox
              @ionChange="surveyUsedChanged(index, $event)"
              :checked="store.state.logic.surveyUsed.has(index)"
              color="light">
            </ion-checkbox>
            &nbsp;<span :class="store.state.logic.surveyUsed.has(index) ? 'used_clue' : 'unused_clue'">
              {{survey.startSector + 1}}-{{survey.endSector + 1}}: {{survey.numObject}}{{survey.spaceObject.initial}}{{survey.spaceObject.initial === "E" ? "?" : ""}}
              <!-- <ion-icon :src="survey.spaceObject.icon"></ion-icon> -->
              <!-- &nbsp;{{survey.numObject === 1 ? survey.spaceObject.name : survey.spaceObject.plural}} -->
            </span>
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
              {{target.sector + 1}}:&nbsp;<ion-icon :src="target.spaceObject.icon"></ion-icon>&nbsp;{{target.spaceObject.name}}{{target.spaceObject.initial === "E" ? "?" : ""}}
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
              {{theory.sector + 1}}:{{theory.accurate ? "" : " not"}}&nbsp;<ion-icon :src="theory.spaceObject.icon"></ion-icon>&nbsp;{{theory.spaceObject.name}}
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { IonNavLink, IonGrid, IonRow, IonCol,
          IonIcon, IonFab, IonFabButton,
          popoverController, IonCheckbox,
          IonToggle, IonItem, IonLabel } from '@ionic/vue';
import { informationCircleOutline } from "ionicons/icons";
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { initialToSpaceObject } from "@/constants.ts";
import NumObjectsPopover from "@/components/NumObjectsPopover.vue";
import DarkMode from "@/mixins/DarkMode.ts";
import { useMatchMedia } from '@cwist/vue-match-media';
import { SUSPICION_LEVELS } from "@/constants.ts";

const LINE_WIDTH = 8;
const SELECTED_BOX_PADDING = 10;

export default defineComponent({
  name: 'LogicSheet',
  components: {
    IonNavLink,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonFab,
    IonFabButton,
    IonCheckbox,
    IonToggle,
    IonItem,
    IonLabel
  },
  mixins: [DarkMode],
  data() {
    const store = useStore();
    return {
      store,
      matchMedia: useMatchMedia(),
      paths: undefined,
      iconRadii: undefined,
      iconWidth: undefined,
      informationCircleOutline,
      unsubscribeStore: () => { return; },
      certaintyLevel: 1
    }
  },
  computed: {
    currentSector: function(): any {
      return this.store.state.session?.currentSector;
    },
    seasonView: function(): any {
      return this.store.state.seasonView;
    },
    resultsSummary: function(): any {
      return this.store.getters.resultsSummary
    },
    sectorAngle: function(): number {
      return 2 * Math.PI/this.store.state.gameType.sectors;
    },
    logicBoard: function(): any {
      return this.store.state.logic.board;
    },
    primes: function(): Array<number> {
      const primes = [];
      for (let i = 2; i <= this.store.state.gameType.sectors; i++) {
        let isPrime = true;
        for (let j = 0; j < primes.length; j++) {
          if (i % primes[j] == 0) {
            isPrime = false;
            break;
          }
        }
        if (isPrime) {
          primes.push(i);
        }
      }
      return primes;
    },
    scratchOut: function(): boolean {
      return this.store.state.settings.scratchOut;
    }
  },
  methods: {
    conferenceUsedChanged: function(index: number, e: CustomEvent) {
      if (e.detail.checked) {
        this.store.commit("setConferenceUsed", { index });
      } else {
        this.store.commit("setConferenceUnused", { index });
      }
    },
    researchUsedChanged: function(index: number, e: CustomEvent) {
      if (e.detail.checked) {
        this.store.commit("setResearchUsed", { index });
      } else {
        this.store.commit("setResearchUnused", { index });
      }
    },
    surveyUsedChanged: function(index: number, e: CustomEvent) {
      if (e.detail.checked) {
        this.store.commit("setSurveyUsed", { index });
      } else {
        this.store.commit("setSurveyUnused", { index });
      }
    },
    showNumObjects: async function(e: Event) {
      const popover = await popoverController
        .create({
          component: NumObjectsPopover,
          cssClass: "custom-popover",
          event: e
        });
      await popover.present();
      await popover.onDidDismiss();
    },
    loadSVGWithColor: async function(path: string, color: string) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", path, true);

      const imageData: string = await new Promise((resolve, reject) => {
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              let theoryFile = xhr.responseText;
              theoryFile = theoryFile.replaceAll("currentColor", color);
              resolve(theoryFile);
            } else {
              reject(xhr.statusText);
            }
          }
        };

        xhr.send(null);
      });

      const img = new Image();
      img.src = "data:image/svg+xml;base64,"+btoa(imageData);

      await new Promise((resolve, reject) => {
        img.onload = function() {
          resolve();
        }
        img.onerror = function(e) {
          reject(e);
        }
      });

      return img;
    },
    iconImages: async function(): Promise<Array<any>> {
      const imagePromises = this.store.state.gameType.logicSheetOrder.map((initial: string) => {
        const object = initialToSpaceObject[initial];

        const levelPromises = SUSPICION_LEVELS.map((level) => {
          return this.loadSVGWithColor(object.iconShort, this.getCSSVariable(level.color));
        });

        return Promise.all(levelPromises);
      });

      return Promise.all(imagePromises);
    },
    fullImages: async function(): Promise<Array<any>> {
      const imagePromises = this.store.state.gameType.logicSheetOrder.map((initial: string) => {
        const object = initialToSpaceObject[initial];

        const levelPromises = SUSPICION_LEVELS.map((level) => {
          return this.loadSVGWithColor(object.iconFull, this.getCSSVariable(level.color));
        });

        return Promise.all(levelPromises);
      });

      return Promise.all(imagePromises);
    },
    getIconRadii: async function(startRadius: number, space: number, width: number, minPadding: number) {
      const iconImages = await this.iconImages();
      const fullImages = await this.fullImages();
      const numImages = iconImages.length;
      const imageSpace = space - minPadding * (numImages - 1);

      const firstWidth = iconImages[0][0].width;
      let sizingFactor = width/firstWidth;

      let heights = iconImages.map((imgs: any) => imgs[0].height * sizingFactor);
      const totalHeight = heights.reduce((a: number, b: number) => a + b, 0);
      if (totalHeight > imageSpace) {
        sizingFactor = sizingFactor * imageSpace/totalHeight;
        heights = iconImages.map((imgs: any) => imgs[0].height * sizingFactor);
      }

      const widths = iconImages.map((imgs: any) => imgs[0].width * sizingFactor);
      const padding = (space - heights.reduce((a: number, b: number) => a + b, 0))/(iconImages.length - 1);

      const radii = [];
      let radius = startRadius;
      for (let i = 0; i < iconImages.length; i++) {
        radii.push({
          radius,
          image: iconImages[i],
          fullImage: fullImages[i],
          height: heights[i],
          width: widths[i],
          object: this.store.state.gameType.logicSheetOrder[i]
        });
        radius += heights[i] + padding;
      }
      return radii;
    },
    rotate: function(x: number, y: number, angle: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: cos * x + sin * y,
        y: cos * y - sin * x
      }
    },
    getClickedObject: function(event: MouseEvent | TouchEvent) {
      let clientX;
      let clientY;

      if (event instanceof TouchEvent) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const cx = x * canvas.width/canvas.offsetWidth - canvas.width/2;
      const cy = y *  canvas.height/canvas.offsetHeight - canvas.height/2;
      const angle = Math.atan2(cy, cx);

      let seasonAngle = 0;
      if (this.store.state.seasonView !== undefined) {
        seasonAngle = this.store.state.seasonView.angle;
      }
      let sectorAngle = angle - seasonAngle;
      sectorAngle = (sectorAngle % (2*Math.PI) + 2*Math.PI) % (2*Math.PI);
      const sector = Math.floor(sectorAngle/this.sectorAngle);

      const rotatedCoords = this.rotate(cx, -cy, -Math.PI/2 - sector * this.sectorAngle - this.sectorAngle/2 - seasonAngle);
      const rx = rotatedCoords.x;
      const ry = rotatedCoords.y;

      if (Math.abs(rx) <= this.iconWidth/2) {
        const iconRadius = this.iconRadii.find((obj: any) => ry >= obj.radius && ry <= obj.radius + obj.height);
        if (iconRadius !== undefined) {
          if (iconRadius.object !== "C" || this.primes.indexOf(sector+1) >= 0) {
            return { sector, iconRadius };
          }
        }
      }

      return { sector: undefined, iconRadius: undefined };
    },
    handleClick: function(event: Event) {
      const { sector, iconRadius } = this.getClickedObject(event as MouseEvent | TouchEvent);
      if (sector !== undefined) {
        return this.toggleObject(sector, iconRadius);
      }
    },
    handleRightClick: function(event: Event) {
      const { sector, iconRadius } = this.getClickedObject(event as MouseEvent | TouchEvent);
      if (sector !== undefined) {
        this.toggleObjectEqual(sector, iconRadius);
      }
      event.preventDefault();
    },
    getCSSVariable: function(varName: string) {
      return getComputedStyle(document.body).getPropertyValue(varName);
    },
    redrawObject: function(sector: number, iconRadius: any, level: number, newStatus: string) {
      const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");

      ctx.save();
      ctx.rotate(Math.PI/2 + (this.sectorAngle/2 + sector * this.sectorAngle));

      const clearPadding = SELECTED_BOX_PADDING + LINE_WIDTH/2 + 1;
      const scratchThickness = Math.min(iconRadius.width/4, iconRadius.height);
      ctx.fillStyle = this.getCSSVariable("--ion-color-light");
      ctx.fillRect(-iconRadius.width/2 - clearPadding, -iconRadius.radius - iconRadius.height - clearPadding, iconRadius.width + 2 * clearPadding, iconRadius.height + 2 * clearPadding);

      if (newStatus === "equal") {
        ctx.drawImage(iconRadius.image[0], -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
        ctx.beginPath();
        ctx.rect(-iconRadius.width/2 - SELECTED_BOX_PADDING, -iconRadius.radius - iconRadius.height - SELECTED_BOX_PADDING, iconRadius.width + 2 * SELECTED_BOX_PADDING, iconRadius.height + 2 * SELECTED_BOX_PADDING);
        ctx.strokeStyle = this.getCSSVariable(SUSPICION_LEVELS[level].color);
        ctx.stroke();
      } else if (newStatus === "none") {
        ctx.drawImage(iconRadius.image[0], -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
      } else if (newStatus === "eliminated"){
        if (this.scratchOut) {
          ctx.drawImage(iconRadius.image[0], -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
          ctx.beginPath();
          ctx.rect(-iconRadius.width/2 - SELECTED_BOX_PADDING, -iconRadius.radius - iconRadius.height/2 - scratchThickness/2, iconRadius.width + 2 * SELECTED_BOX_PADDING, scratchThickness);
          ctx.fillStyle = this.getCSSVariable(SUSPICION_LEVELS[level].color);
          ctx.fill();
        } else {
          ctx.drawImage(iconRadius.fullImage[level], -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
        }
      }

      const restorePadding = SELECTED_BOX_PADDING + LINE_WIDTH + 2;
      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      const x = (iconRadius.radius + iconRadius.height + restorePadding) * Math.cos(sector * this.sectorAngle);
      const y = (iconRadius.radius + iconRadius.height + restorePadding) * Math.sin(sector * this.sectorAngle);
      ctx.lineTo(x, y);

      ctx.moveTo(0, 0);
      const x2 = (iconRadius.radius + iconRadius.height + restorePadding) * Math.cos((sector + 1) * this.sectorAngle);
      const y2 = (iconRadius.radius + iconRadius.height + restorePadding) * Math.sin((sector + 1) * this.sectorAngle);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = this.getCSSVariable("--ion-color-light-contrast");
      ctx.stroke();
    },
    getIconRadius: function(spaceObject: string) {
      return this.iconRadii.find((ir: any) => ir.object === spaceObject);
    },
    drawObjectEliminated: function(sector: number, spaceObject: string, level: number) {
      const iconRadius = this.getIconRadius(spaceObject);
      this.redrawObject(sector, iconRadius, level, "eliminated");
    },
    drawObjectEqual: function(sector: number, spaceObject: string, level: number) {
      const iconRadius = this.getIconRadius(spaceObject);
      this.redrawObject(sector, iconRadius, level, "equal");
    },
    drawObjectUnset: function (sector: number, spaceObject: string) {
      const iconRadius = this.getIconRadius(spaceObject);
      this.redrawObject(sector, iconRadius, 0, "none");
    },
    toggleObjectEqual: function(sector: number, iconRadius: any) {
      this.store.dispatch("logicToggleEqual", {
        sector,
        object: iconRadius.object,
        level: +!this.certaintyLevel
      });
    },
    toggleObject: function(sector: number, iconRadius: any) {
      const checkHold = this.store.state.logic.board[sector].equalTo !== iconRadius.object;

      this.store.dispatch("logicToggle", {
        sector,
        object: iconRadius.object,
        level: +!this.certaintyLevel
      });

      return checkHold;
    },
    redrawSky: async function() {
      const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
      if (canvas === null) {
        return;
      }
      const ctx = canvas.getContext("2d");

      const skyAngle = this.sectorAngle * this.store.state.session.currentSector;

      const boardRadius = 1400;
      const outerRadius = 1600;
      const textRadius = (boardRadius + outerRadius)/2;
      const textHeight = 150;

      const lightColor = this.getCSSVariable("--ion-color-light");
      const darkColor = this.getCSSVariable("--ion-color-light-contrast");

      const baseColor = lightColor;
      const skyColor = this.isDarkMode ? "#585858" : "#FFFFCC";

      ctx.beginPath();
      ctx.fillStyle = baseColor;
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI, false);
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI, true);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = skyColor;
      ctx.arc(0, 0, outerRadius, skyAngle, skyAngle + Math.PI, false);
      ctx.arc(0, 0, boardRadius, skyAngle + Math.PI, skyAngle + 2*Math.PI, true);
      ctx.fill();

      for (let i = 0; i < this.store.state.gameType.sectors; i++) {
        // Sector line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const x = outerRadius * Math.cos(i * this.sectorAngle);
        const y = outerRadius * Math.sin(i * this.sectorAngle);
        ctx.lineTo(x, y);
        ctx.strokeStyle = darkColor;
        ctx.stroke();

        // Sector number label
        ctx.save();

        ctx.rotate(Math.PI/2 + (this.sectorAngle/2 + i * this.sectorAngle));

        ctx.font = textHeight + "px Roboto";
        ctx.textAlign = "center";
        ctx.fillStyle = darkColor;
        ctx.textBaseline = "middle";
        ctx.fillText("" + (i+1), 0, -(textRadius-textHeight*0.1));

        ctx.restore();
      }
    },
    computeCanvas: async function() {
      if (!this.store.getters.gameReady || !this.store.state.isSession) {
        return;
      }
      const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
      if (canvas === null) {
        return;
      }
      const ctx = canvas.getContext("2d");
      ctx.resetTransform();
      ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
      ctx.translate(canvas.width/2, canvas.height/2);
      if (this.store.state.seasonView !== undefined) {
        ctx.rotate(this.store.state.seasonView.angle);
      }

      ctx.lineWidth = LINE_WIDTH;

      const sectorAngle = 2 * Math.PI/this.store.state.gameType.sectors;
      const skyAngle = sectorAngle * this.store.state.session.currentSector;

      const boardRadius = 1400;
      const outerRadius = 1600;
      const textRadius = (boardRadius + outerRadius)/2;
      const textHeight = 150;

      const innerRadius = 450;
      const innerColors = ["#4379d1", "#d14d4d", "#65b85c", "#ccc84b"];

      const lightColor = this.getCSSVariable("--ion-color-light");
      const darkColor = this.getCSSVariable("--ion-color-light-contrast");

      const baseColor = lightColor;
      const skyColor = this.isDarkMode ? "#585858" : "#FFFFCC";

      let iconWidth = 150;

      const objectPadding = 50;
      const minPadding = LINE_WIDTH + 2 * SELECTED_BOX_PADDING;
      const maxIconWidth = 2 * Math.tan(sectorAngle/2) * (innerRadius + objectPadding);
      iconWidth = Math.min(iconWidth, maxIconWidth - LINE_WIDTH - 2 * SELECTED_BOX_PADDING);

      const iconRadii = await this.getIconRadii(innerRadius + objectPadding, boardRadius - innerRadius - 2 * objectPadding, iconWidth, minPadding);
      this.iconRadii = iconRadii;
      this.iconWidth = iconWidth;

      ctx.beginPath();
      ctx.fillStyle = baseColor;
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = skyColor;
      ctx.arc(0, 0, outerRadius, skyAngle, skyAngle + Math.PI, false);
      ctx.arc(0, 0, boardRadius, skyAngle + Math.PI, skyAngle + 2*Math.PI, true);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.stroke();

      for (let i = 0; i < this.store.state.gameType.sectors; i++) {
        // Inner sectors
        ctx.beginPath();
        ctx.fillStyle = innerColors[i % this.store.state.gameType.logicPatternInterval];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, innerRadius, i*sectorAngle, (i+1)*sectorAngle);
        ctx.lineTo(0, 0);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, innerRadius, 0, 2*Math.PI);
      ctx.stroke();

      for (let i = 0; i < this.store.state.gameType.sectors; i++) {
        // Sector line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const x = outerRadius * Math.cos(i * sectorAngle);
        const y = outerRadius * Math.sin(i * sectorAngle);
        ctx.lineTo(x, y);
        ctx.strokeStyle = darkColor;
        ctx.stroke();

        // Sector number label
        ctx.save();

        ctx.rotate(Math.PI/2 + (sectorAngle/2 + i * sectorAngle));

        ctx.font = textHeight + "px Roboto";
        ctx.textAlign = "center";
        ctx.fillStyle = darkColor;
        ctx.textBaseline = "middle";
        ctx.fillText("" + (i+1), 0, -(textRadius-textHeight*0.1));


        for (let j = 0; j < iconRadii.length; j++) {
          const scratchThickness = Math.min(iconRadii[j].width/4, iconRadii[j].height);
          if (iconRadii[j].object !== "C" || this.primes.indexOf(i+1) >= 0) {
            const { state, level } = this.store.state.logic.board[i][iconRadii[j].object];
            if (state === "eliminated") {
              if (this.scratchOut) {
                ctx.drawImage(iconRadii[j].image[0], -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
                ctx.beginPath();
                ctx.rect(-iconRadii[j].width/2 - SELECTED_BOX_PADDING, -iconRadii[j].radius - iconRadii[j].height/2 - scratchThickness/2, iconRadii[j].width + 2 * SELECTED_BOX_PADDING, scratchThickness);
                ctx.fillStyle = this.getCSSVariable(SUSPICION_LEVELS[level].color);
                ctx.fill();
              } else {
                ctx.drawImage(iconRadii[j].fullImage[level], -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
              }
            } else if (state === "equal") {
              ctx.drawImage(iconRadii[j].image[0], -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
              ctx.beginPath();
              ctx.rect(-iconRadii[j].width/2 - SELECTED_BOX_PADDING, -iconRadii[j].radius - iconRadii[j].height - SELECTED_BOX_PADDING, iconRadii[j].width + 2 * SELECTED_BOX_PADDING, iconRadii[j].height + 2 * SELECTED_BOX_PADDING);
              ctx.strokeStyle = this.getCSSVariable(SUSPICION_LEVELS[level].color);
              ctx.stroke();
            } else {
              ctx.drawImage(iconRadii[j].image[0], -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
            }
          }
        }

        ctx.restore();
      }
    }
  },
  watch: {
    seasonView: async function(seasonView: any) {
      if (seasonView) {
        await this.computeCanvas();
      }
    },
    currentSector: function(currentSector: number | undefined) {
      if (currentSector !== undefined) {
        this.redrawSky();
      }
    },
    isDarkMode: function() {
      if (this.store.state.isSession) {
        this.computeCanvas();
      }
    },
    scratchOut: function() {
      if (this.store.state.isSession) {
        this.computeCanvas();
      }
    }
  },
  async mounted() {
    await this.$nextTick();
    await this.computeCanvas();

    this.unsubscribeStore = this.store.subscribe((mutation, state) => {
      if (mutation.type === "logicEliminate") {
        this.drawObjectEliminated(mutation.payload.sector, mutation.payload.object, mutation.payload.level);
      } else if (mutation.type === "logicSet") {
        this.drawObjectEqual(mutation.payload.sector, mutation.payload.object, mutation.payload.level);
      } else if (mutation.type === "logicUnset") {
        this.drawObjectUnset(mutation.payload.sector, mutation.payload.object);
      }
    });

    const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
    canvas.addEventListener("contextmenu", (e: Event) => this.handleRightClick(e));

    let timeout: any = undefined;

    canvas.addEventListener("mousedown", (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      const checkHold = this.handleClick(e);
      if (checkHold) {
        timeout = setTimeout(() => {
          this.handleRightClick(e);
        }, 350);
      }
    });

    canvas.addEventListener("touchstart", (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      const checkHold = this.handleClick(e);
      if (checkHold) {
        timeout = setTimeout(() => {
          this.handleRightClick(e);
        }, 350);
      }
    });

    canvas.addEventListener("mouseleave", (e: Event) => {
      clearTimeout(timeout);
    });

    canvas.addEventListener("mouseup", (e: Event) => {
      clearTimeout(timeout);
    });

    canvas.addEventListener("touchend", (e: Event) => {
      clearTimeout(timeout);
    });
  },
  unmounted() {
    this.unsubscribeStore();
  }
});
</script>

<style scoped>
#container {
  padding: 10px;
  color: white;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#title_container {
  font-family: "Roboto Slab";
  text-transform: uppercase;
  text-align: center;
}

#title_container h3 {
  margin-top: 10px;
  margin-bottom: 0px;
}

#cancel_container_logic {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

#button-container {
  margin-top: 0.5em;
}

#canvas-container {
  margin-top: 0.5em;
}

#logicCanvas {
  padding-left: 0;
  padding-right: 0;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100%;
  height: 100%;
  max-width: 50vh;
  max-height: 50vh;
}

#results-summary {
  background-color: var(--ion-color-light);
  color: var(--ion-color-light-contrast);
  width: calc(100% + 20px);
  border: 1px solid gray;
  padding: 5px;
  overflow-y: auto;
  margin-left: -10px;
  margin-right: -10px;
  margin-bottom: -10px;
  margin-top: 10px;
  height: 100%;
}

.reveal_row {
  display: flex;
  align-content: center;
  align-items: center;
}

.reveal_row span {
  display: flex;
  align-content: center;
  align-items: center;
}

.reveal_row ion-icon {
  font-size: 1.2em;
}

.reveal_row.not_researched {
  background-color: var(--ion-color-dark);
  color: var(--ion-color-dark-contrast);
}

#summary_title {
  margin-left: 6px;
  margin-bottom: 0;
  text-transform: uppercase;
}

ion-col {
  --ion-grid-column-padding: 0px;
}

.title_row {
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}

.used_clue {
  text-decoration: line-through;
}
</style>
