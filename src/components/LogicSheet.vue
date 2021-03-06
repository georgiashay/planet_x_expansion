<template>
  <div ref="container" id="container" v-if="showLogicSheet" :class="[fullScroll ? 'content-scroll' : 'content-fixed']">
    <ion-fab slot="fixed" vertical="top" horizontal="start" v-if="matchMedia.sm">
      <ion-fab-button
        size="small"
        color="light"
        @click="showNumObjects($event)">
        <ion-icon :src="informationCircleOutline"></ion-icon>
      </ion-fab-button>
      <ion-fab-button
        size="small"
        color="light"
        @click="undoLogic()"
        :disabled="store.state.logic.undoQueue.length === 0">
        <ion-icon :src="arrowUndoOutline"></ion-icon>
      </ion-fab-button>
      <ion-fab-button
        size="small"
        color="light"
        @click="redoLogic()"
        :disabled="store.state.logic.redoQueue.length === 0">
        <ion-icon :src="arrowRedoOutline"></ion-icon>
      </ion-fab-button>
      <ion-fab-button
        size="small"
        color="light"
        @click="clearLogic()">
        <ion-icon :src="trashBinOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-fab slot="fixed" vertical="top" horizontal="end">
      <ion-item>
        <ion-label v-if="matchMedia.sm">Certain</ion-label>
        <ion-label v-else>
          <ion-icon v-if="certaintyLevel == 1" :src="lockClosed"></ion-icon>
          <ion-icon v-else :src="lockOpenOutline"></ion-icon>
        </ion-label>
        <ion-toggle v-model="certaintyLevel"></ion-toggle>
      </ion-item>
    </ion-fab>
    <ion-fab slot="fixed" vertical="top" horizontal="start" v-if="!matchMedia.sm">
      <ion-item style="--background: rgba(0,0,0,0); --border-color: rgba(0,0,0,0)">
        <ion-button
          color="light"
          @click="showNumObjects($event)"
          expand="full">
          <ion-icon :src="informationCircleOutline"></ion-icon>
        </ion-button>
        <ion-button
          color="light"
          expand="full"
          @click="undoLogic()"
          :disabled="store.state.logic.undoQueue.length === 0">
          <ion-icon :src="arrowUndoOutline"></ion-icon>
        </ion-button>
        <ion-button
          color="light"
          expand="full"
          @click="redoLogic()"
          :disabled="store.state.logic.redoQueue.length === 0">
          <ion-icon :src="arrowRedoOutline"></ion-icon>
        </ion-button>
        <ion-button
          color="light"
          expand="full"
          @click="clearLogic()">
          <ion-icon :src="trashBinOutline"></ion-icon>
        </ion-button>
      </ion-item>
    </ion-fab>
    <div id="title_container">
      <h3 v-if="matchMedia.sm">Logic Sheet</h3>
      <h3 v-else>Logic</h3>
    </div>
    <div id="canvas-container">
      <canvas ref="logicCanvas" id="logicCanvas" height="3204" width="3204"/>
    </div>
    <div ref="cancelContainer" id="cancel_container_logic" v-if="!matchMedia.md">
      <ion-nav-link :router-link="'/session/gamemenu'">Return to Game Menu</ion-nav-link>
    </div>
    <results-summary :results-summary="resultsSummary" :full-scroll="fullScroll" :vertical-layout="store.state.settings.verticalResultsSummary">
      <template v-slot:conference="props">
          <ion-checkbox
            :disabled="!props.conference.researched"
            @ionChange="conferenceUsedChanged(props.index, $event)"
            :checked="store.state.logic.conferenceUsed.has(props.index)"
            color="light">
          </ion-checkbox>
          &nbsp;<span :class="store.state.logic.conferenceUsed.has(props.index) ? 'used_clue' : 'unused_clue'">{{props.conference.index + 1}}.&nbsp;<span :class="['category_name', props.conference.researched ? '' : 'not_researched']">{{props.conference.shortText}}</span></span>
      </template>
      <template v-slot:research="props">
          <ion-checkbox
            :disabled="!props.research.researched"
            @ionChange="researchUsedChanged(props.index, $event)"
            :checked="store.state.logic.researchUsed.has(props.index)"
            color="light">
          </ion-checkbox>
          &nbsp;<span :class="store.state.logic.researchUsed.has(props.index) ? 'used_clue' : 'unused_clue'">{{String.fromCharCode(65+props.research.index)}}.&nbsp;<span :class="['category_name', props.research.researched ? '' : 'not_researched']">{{props.research.shortText}}</span></span>
      </template>
      <template v-slot:locate="props">
        {{props.locate.leftObject.initial}}-{{props.locate.sector + 1}}-{{props.locate.rightObject.initial}}: {{props.locate.successful ? "✓" : "X"}}
      </template>
      <template v-slot:survey="props">
        <ion-checkbox
          @ionChange="surveyUsedChanged(props.index, $event)"
          :checked="store.state.logic.surveyUsed.has(props.index)"
          color="light">
        </ion-checkbox>
        &nbsp;<span :class="store.state.logic.surveyUsed.has(props.index) ? 'used_clue' : 'unused_clue'">
          {{props.survey.startSector + 1}}-{{props.survey.endSector + 1}}: {{props.survey.numObject}}{{props.survey.spaceObject.initial}}{{props.survey.spaceObject.initial === "E" ? "?" : ""}}
        </span>
      </template>
      <template v-slot:target="props">
        {{props.target.sector + 1}}:&nbsp;<ion-icon :src="props.target.spaceObject.icon"></ion-icon>&nbsp;{{props.target.spaceObject.name}}{{props.target.spaceObject.initial === "E" ? "?" : ""}}
      </template>
      <template v-slot:theory="props">
        {{props.theory.sector + 1}}:{{props.theory.accurate ? "" : " not"}}&nbsp;<ion-icon :src="props.theory.spaceObject.icon"></ion-icon>&nbsp;{{props.theory.spaceObject.name}}
      </template>
    </results-summary>
  </div>
</template>

<script lang="ts">
import { IonNavLink, IonIcon, IonFab, IonFabButton,
          popoverController, IonCheckbox,
          IonToggle, IonItem, IonLabel, IonButton } from '@ionic/vue';
import { informationCircleOutline, arrowUndoOutline,
        arrowRedoOutline, trashBinOutline,
        lockClosed, lockOpenOutline } from "ionicons/icons";
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { initialToSectorElement } from "@/constants.ts";
import NumObjectsPopover from "@/components/NumObjectsPopover.vue";
import DarkMode from "@/mixins/DarkMode.ts";
import { useMatchMedia } from '@cwist/vue-match-media';
import { INNER_WHEEL_COLORS, PRIME_OBJECT } from "@/constants.ts";
import ResultsSummary from "@/components/ResultsSummary.vue";

const LINE_WIDTH = 8;
const SELECTED_BOX_PADDING = 10;

export default defineComponent({
  name: 'LogicSheet',
  components: {
    IonNavLink,
    IonIcon,
    IonFab,
    IonFabButton,
    IonCheckbox,
    IonToggle,
    IonItem,
    IonLabel,
    IonButton,
    ResultsSummary
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
      arrowUndoOutline,
      arrowRedoOutline,
      trashBinOutline,
      lockClosed,
      lockOpenOutline,
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
    rectangleEliminate: function(): boolean {
      return this.store.state.settings.rectangleEliminate;
    },
    scratchUncertain: function(): boolean {
      return this.store.state.settings.scratchUncertain;
    },
    iconSize: function(): number {
      return this.store.state.settings.logicIconSize;
    },
    showLogicSheet: function(): boolean {
      return this.store.getters.gameReady && this.store.state.isSession;
    },
    logic: function(): any {
      return this.store.state.logic;
    },
    uncertainColor: function(): string {
      return this.store.state.settings.levelColors[1];
    },
    fullScroll: function(): boolean {
      return !this.matchMedia.md && this.store.state.settings.fullScrollLogic;
    }
  },
  methods: {
    undoLogic: function() {
      this.store.dispatch("undoLogic");
    },
    redoLogic: function() {
      this.store.dispatch("redoLogic");
    },
    clearLogic: function() {
      this.store.dispatch("clearLogic");
    },
    conferenceUsedChanged: function(index: number, e: CustomEvent) {
      if (e.detail.checked) {
        this.store.dispatch("setConferenceUsed", { index });
      } else {
        this.store.dispatch("setConferenceUnused", { index });
      }
    },
    researchUsedChanged: function(index: number, e: CustomEvent) {
      if (e.detail.checked) {
        this.store.dispatch("setResearchUsed", { index });
      } else {
        this.store.dispatch("setResearchUnused", { index });
      }
    },
    surveyUsedChanged: function(index: number, e: CustomEvent) {
      if (e.detail.checked) {
        this.store.dispatch("setSurveyUsed", { index });
      } else {
        this.store.dispatch("setSurveyUnused", { index });
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
        xhr.onload = function () {
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
        const object = initialToSectorElement[initial];

        const levelPromises = this.store.state.settings.levelColors.map((color: string) => {
          return this.loadSVGWithColor(object.iconShort, this.getCSSVariable(color));
        });

        return Promise.all(levelPromises);
      });

      return Promise.all(imagePromises);
    },
    fullImages: async function(): Promise<Array<any>> {
      const imagePromises = this.store.state.gameType.logicSheetOrder.map((initial: string) => {
        const object = initialToSectorElement[initial];

        const levelPromises = this.store.state.settings.levelColors.map((color: string) => {
          return this.loadSVGWithColor(object.iconFull, this.getCSSVariable(color));
        });

        return Promise.all(levelPromises);
      });

      return Promise.all(imagePromises);
    },
    getIconRadii: async function(startRadius: number, space: number, width: number, minPadding: number) {
      // Get icon images
      const iconImages = await this.iconImages();
      const fullImages = await this.fullImages();
      const numImages = iconImages.length;
      // Get amount of space available for the icons
      const imageSpace = space - minPadding * (numImages - 1);

      // Size images based on first image width
      const firstWidth = iconImages[0][0].width;
      let sizingFactor = width/firstWidth;

      // Check if the images will fit vertically
      let heights = iconImages.map((imgs: any) => imgs[0].height * sizingFactor);
      const totalHeight = heights.reduce((a: number, b: number) => a + b, 0);
      if (totalHeight > imageSpace) {
        // Size the images down if they will not fit vertically
        sizingFactor = sizingFactor * imageSpace/totalHeight;
        heights = iconImages.map((imgs: any) => imgs[0].height * sizingFactor);
      }

      const widths = iconImages.map((imgs: any) => imgs[0].width * sizingFactor);
      // Calculate remaining padding
      const padding = (space - heights.reduce((a: number, b: number) => a + b, 0))/(iconImages.length - 1);

      const radii = [];
      let radius = startRadius;
      // Report this information for each icon
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

      // Get position of click or touch
      if (event instanceof TouchEvent) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      // Get canvas
      const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      // Calculate x and y coordinates
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const cx = x * canvas.width/canvas.offsetWidth - canvas.width/2;
      const cy = y *  canvas.height/canvas.offsetHeight - canvas.height/2;
      // Get angle of the click
      const angle = Math.atan2(cy, cx);

      let seasonAngle = 0;
      if (this.store.state.seasonView !== undefined) {
        seasonAngle = this.store.state.seasonView.angle;
      }
      // Get angle relative to sector 0
      let sectorAngle = angle - seasonAngle;
      sectorAngle = (sectorAngle % (2*Math.PI) + 2*Math.PI) % (2*Math.PI);
      // Calculate sector number
      const sector = Math.floor(sectorAngle/this.sectorAngle);

      // Rotate the coordinates so they are vertical
      const rotatedCoords = this.rotate(cx, -cy, -Math.PI/2 - sector * this.sectorAngle - this.sectorAngle/2 - seasonAngle);
      const rx = rotatedCoords.x;
      const ry = rotatedCoords.y;

      // Ensure the click is within the icon width
      if (Math.abs(rx) <= this.iconWidth/2) {
        // Find an object containing this y coordinate
        const iconRadius = this.iconRadii.find((obj: any) => ry >= obj.radius && ry <= obj.radius + obj.height);
        if (iconRadius !== undefined) {
          if (iconRadius.object !== PRIME_OBJECT.initial || this.primes.indexOf(sector+1) >= 0) {
            return { sector, iconRadius };
          }
        }
      }

      return { sector: undefined, iconRadius: undefined };
    },
    getCSSVariable: function(varName: string) {
      return getComputedStyle(document.body).getPropertyValue(varName) || varName;
    },
    redrawObject: function(sector: number, iconRadius: any, level: number, newStatus: string) {
      const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");

      ctx.save();
      ctx.rotate(Math.PI/2 + (this.sectorAngle/2 + sector * this.sectorAngle));

      // Padding needed to clear out drawn box
      const clearPadding = SELECTED_BOX_PADDING + LINE_WIDTH/2 + 1;
      ctx.fillStyle = this.getCSSVariable("--ion-color-light");
      // Clear icon
      ctx.fillRect(-iconRadius.width/2 - clearPadding, -iconRadius.radius - iconRadius.height - clearPadding, iconRadius.width + 2 * clearPadding, iconRadius.height + 2 * clearPadding);

      if (newStatus === "equal") {
        // Draw icon
        ctx.drawImage(iconRadius.image[0], -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
        // Draw box around icon
        ctx.beginPath();
        ctx.rect(-iconRadius.width/2 - SELECTED_BOX_PADDING, -iconRadius.radius - iconRadius.height - SELECTED_BOX_PADDING, iconRadius.width + 2 * SELECTED_BOX_PADDING, iconRadius.height + 2 * SELECTED_BOX_PADDING);
        ctx.strokeStyle = this.getCSSVariable(this.store.state.settings.levelColors[level]);
        ctx.stroke();
      } else if (newStatus === "none") {
        // Draw icon
        ctx.drawImage(iconRadius.image[0], -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
      } else if (newStatus === "eliminated"){
        if (level > 0 && this.scratchUncertain) {
          // Draw icon
          ctx.drawImage(iconRadius.image[0], -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
          // Draw scratch through icon
          ctx.beginPath();
          ctx.lineWidth = LINE_WIDTH * 3;
          ctx.moveTo(-iconRadius.width/2, -iconRadius.radius - iconRadius.height);
          ctx.lineTo(iconRadius.width/2, -iconRadius.radius);
          ctx.strokeStyle = this.getCSSVariable(this.store.state.settings.levelColors[level]);
          ctx.stroke();
          ctx.lineWidth = LINE_WIDTH;
        } else if (this.rectangleEliminate) {
          // Draw solid rectangle around icon
          ctx.beginPath();
          ctx.rect(-iconRadius.width/2, -iconRadius.radius - iconRadius.height, iconRadius.width, iconRadius.height);
          ctx.fillStyle = this.getCSSVariable(this.store.state.settings.levelColors[level]);
          ctx.fill();
        } else {
          // Draw the filled-in icon
          ctx.drawImage(iconRadius.fullImage[level], -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
        }
      }

      const restorePadding = SELECTED_BOX_PADDING + LINE_WIDTH + 2;
      ctx.restore();

      // Restore sector lines adjacent to the icon
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
      this.store.dispatch("logicToggle", {
        sector,
        object: iconRadius.object,
        level: +!this.certaintyLevel
      });
    },
    checkClick: function(event: Event) {
      const { sector, iconRadius } = this.getClickedObject(event as MouseEvent | TouchEvent);
      let checkHold = false;
      if (sector !== undefined) {
        // Check for hold events if the object is eliminated or none
        checkHold = this.store.state.logic.board[sector][iconRadius.object].state !== "equal";
      }
      return { sector, iconRadius, checkHold };
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
      const skyColor = this.isDarkMode ? "#585858" : "silver";

      // Fill in background
      ctx.beginPath();
      ctx.fillStyle = baseColor;
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI, false);
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI, true);
      ctx.fill();

      // Fill in sky
      ctx.beginPath();
      ctx.fillStyle = skyColor;
      ctx.arc(0, 0, outerRadius, skyAngle, skyAngle + Math.PI, !this.isDarkMode);
      ctx.arc(0, 0, boardRadius, skyAngle + Math.PI, skyAngle + 2*Math.PI, this.isDarkMode);
      ctx.fill();

      // Fill in circle around board
      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI);
      ctx.stroke();

      // Fill in circle around numbers
      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.stroke();

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
      const innerColors = INNER_WHEEL_COLORS;

      const lightColor = this.getCSSVariable("--ion-color-light");
      const darkColor = this.getCSSVariable("--ion-color-light-contrast");

      const baseColor = lightColor;
      const skyColor = this.isDarkMode ? "#585858" : "silver";

      let iconWidth = 150;

      const objectPadding = 50;
      const absoluteMinPadding = LINE_WIDTH + 2 * SELECTED_BOX_PADDING;
      const minPadding = (1 - this.iconSize) * (objectPadding - absoluteMinPadding) + absoluteMinPadding;
      const maxIconWidth = 2 * Math.tan(sectorAngle/2) * (innerRadius + objectPadding);
      iconWidth = Math.min(iconWidth, maxIconWidth - LINE_WIDTH - 2 * SELECTED_BOX_PADDING);

      const iconRadii = await this.getIconRadii(innerRadius + objectPadding, boardRadius - innerRadius - 2 * objectPadding, iconWidth, minPadding);
      this.iconRadii = iconRadii;
      this.iconWidth = iconWidth;

      // Fill in background
      ctx.beginPath();
      ctx.fillStyle = baseColor;
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.fill();

      // Fill in sky
      ctx.beginPath();
      ctx.fillStyle = skyColor;
      ctx.arc(0, 0, outerRadius, skyAngle, skyAngle + Math.PI, !this.isDarkMode);
      ctx.arc(0, 0, boardRadius, skyAngle + Math.PI, skyAngle + 2*Math.PI, this.isDarkMode);
      ctx.fill();

      // Draw circle around board
      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI);
      ctx.stroke();

      // Draw circle around numbers
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

      // Draw inner circle
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
          if (iconRadii[j].object !== PRIME_OBJECT.initial || this.primes.indexOf(i+1) >= 0) {
            const { state, level } = this.store.state.logic.board[i][iconRadii[j].object];
            if (state === "eliminated") {
              if (level > 0 && this.scratchUncertain) {
                // Draw icon
                ctx.drawImage(iconRadii[j].image[0], -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
                // Scratch out icon
                ctx.beginPath();
                ctx.lineWidth = LINE_WIDTH * 3;
                ctx.moveTo(-iconRadii[j].width/2, -iconRadii[j].radius - iconRadii[j].height);
                ctx.lineTo(iconRadii[j].width/2, -iconRadii[j].radius);
                ctx.strokeStyle = this.getCSSVariable(this.store.state.settings.levelColors[level]);
                ctx.stroke();
                ctx.lineWidth = LINE_WIDTH;
              } else if (this.rectangleEliminate) {
                // Draw icon
                ctx.drawImage(iconRadii[j].image[0], -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
                // Draw filled-in rectangle
                ctx.beginPath();
                ctx.rect(-iconRadii[j].width/2, -iconRadii[j].radius - iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
                ctx.fillStyle = this.getCSSVariable(this.store.state.settings.levelColors[level]);
                ctx.fill();
              } else {
                // Draw filled-in icon
                ctx.drawImage(iconRadii[j].fullImage[level], -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
              }
            } else if (state === "equal") {
              // Draw icon
              ctx.drawImage(iconRadii[j].image[0], -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
              // Draw rectangle around icon
              ctx.beginPath();
              ctx.rect(-iconRadii[j].width/2 - SELECTED_BOX_PADDING, -iconRadii[j].radius - iconRadii[j].height - SELECTED_BOX_PADDING, iconRadii[j].width + 2 * SELECTED_BOX_PADDING, iconRadii[j].height + 2 * SELECTED_BOX_PADDING);
              ctx.strokeStyle = this.getCSSVariable(this.store.state.settings.levelColors[level]);
              ctx.stroke();
            } else {
              // Draw icon
              ctx.drawImage(iconRadii[j].image[0], -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
            }
          }
        }

        ctx.restore();
      }
    },
    attachListeners: function() {
      this.unsubscribeStore = this.store.subscribe((mutation) => {
        if (mutation.type === "logicEliminate") {
          this.drawObjectEliminated(mutation.payload.sector, mutation.payload.object, mutation.payload.level);
        } else if (mutation.type === "logicSet") {
          this.drawObjectEqual(mutation.payload.sector, mutation.payload.object, mutation.payload.level);
        } else if (mutation.type === "logicUnset") {
          this.drawObjectUnset(mutation.payload.sector, mutation.payload.object);
        }
      });

      const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
      canvas.addEventListener("contextmenu", (e: Event) => {
        // e.stopPropagation();
        e.preventDefault();
        const { sector, iconRadius } = this.getClickedObject(e as MouseEvent | TouchEvent);
        this.toggleObjectEqual(sector, iconRadius);
      });

      let timeout: any = undefined;
      let clickSector: number = undefined;
      let clickIconRadius: any = undefined;

      canvas.addEventListener("mousedown", (e: MouseEvent) => {
        if (e.button === 2 || e.which === 3) {
          // Context menu
          return;
        }
        e.stopPropagation();
        e.preventDefault();
        const { sector, iconRadius, checkHold } = this.checkClick(e);
        if (sector === undefined) {
          return;
        }
        clickSector = sector;
        clickIconRadius = iconRadius;
        if (checkHold) {
          const currentState = this.store.state.logic.board[sector][iconRadius.object];
          const setLevel = +!this.certaintyLevel;
          if (currentState.state !== "eliminated") {
            // Show object as eliminated temporarily (was none)
            // Will become official if not determined to be a hold
            this.redrawObject(sector, iconRadius, setLevel, "eliminated")
          }
          timeout = setTimeout(() => {
            this.toggleObjectEqual(sector, iconRadius);
            timeout = undefined;
          }, 350);
        } else {
          this.toggleObject(sector, iconRadius);
        }
      });

      canvas.addEventListener("touchstart", (e: TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const { sector, iconRadius, checkHold } = this.checkClick(e);
        clickSector = sector;
        clickIconRadius = iconRadius;
        if (sector === undefined) {
          return;
        }
        if (checkHold) {
          const currentState = this.store.state.logic.board[sector][iconRadius.object];
          const setLevel = +!this.certaintyLevel;
          if (currentState.state !== "eliminated") {
            // Show object as eliminated temporarily (was none)
            // Will become official if not determined to be a hold
            this.redrawObject(sector, iconRadius, setLevel, "eliminated")
          }
          timeout = setTimeout(() => {
            this.toggleObjectEqual(sector, iconRadius);
            timeout = undefined;
          }, 350);
        } else {
          this.toggleObject(sector, iconRadius);
        }
      });

      canvas.addEventListener("mouseleave", () => {
        if (timeout !== undefined) {
          clearTimeout(timeout);
          timeout = undefined;
          this.toggleObject(clickSector, clickIconRadius);
        }
      });

      canvas.addEventListener("mouseup", () => {
        if (timeout !== undefined) {
          clearTimeout(timeout);
          timeout = undefined;
          this.toggleObject(clickSector, clickIconRadius);
        }
      });

      canvas.addEventListener("touchend", () => {
        if (timeout !== undefined) {
          clearTimeout(timeout);
          timeout = undefined;
          this.toggleObject(clickSector, clickIconRadius);
        }
      });
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
    rectangleEliminate: function() {
      if (this.store.state.isSession) {
        this.computeCanvas();
      }
    },
    scratchUncertain: function() {
      if (this.store.state.isSession) {
        this.computeCanvas();
      }
    },
    iconSize: function() {
      if (this.store.state.isSession) {
        this.computeCanvas();
      }
    },
    showLogicSheet: async function(showSheet: boolean) {
      if (showSheet) {
        await this.$nextTick();
        this.attachListeners();
      }
    },
    logic: function() {
      if (this.store.state.isSession) {
        this.computeCanvas();
      }
    },
    uncertainColor: function() {
      if (this.store.state.isSession) {
        this.computeCanvas();
      }
    }
  },
  async mounted() {
    await this.$nextTick();
    await this.computeCanvas();
    this.attachListeners();
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
}

.content-fixed {
  overflow: hidden;
}

.content-scroll {
  overflow-y: auto;
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
  margin-left: -10px;
  margin-right: -10px;
  margin-bottom: -10px;
  margin-top: 10px;
  height: 100%;
}


.reveal_row span {
  display: flex;
  align-content: center;
  align-items: center;
}

.reveal_row ion-icon {
  font-size: 1.2em;
}

span.category_name.not_researched {
  background-color: var(--ion-color-dark);
  color: var(--ion-color-dark-contrast);
}

.used_clue {
  text-decoration: line-through;
}
</style>
