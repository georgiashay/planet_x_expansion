<template>
  <div id="container" v-if="store.getters.gameReady && store.state.isSession">
    <ion-fab slot="fixed" top right>
      <ion-fab-button
        size="small"
        color="light"
        @click="showNumObjects($event)">
        <ion-icon :src="informationCircleOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <div id="title_container">
      <h3>Logic Sheet</h3>
    </div>
    <canvas ref="logicCanvas" id="logicCanvas" height="3204" width="3204"/>
    <div ref="cancelContainer" id="cancel_container_logic" v-if="screenSizeLessThan('md')">
      <ion-nav-link :router-link="'/session/gamemenu'">Return to Game Menu</ion-nav-link>
    </div>
    <div ref="resultsSummary" id="results-summary">
      <h5 id="summary_title">Results Summary</h5>
      <ion-grid>
        <ion-row v-if="resultsSummary.conferences.length > 0" class="title_row">
          <b>Conferences</b>
        </ion-row>
        <ion-row v-if="resultsSummary.conferences.length > 0">
          <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
            v-for="(conference, index) in resultsSummary.conferences"
            :key="index"
            class="reveal_row">
              {{conference.index + 1}}. {{conference.shortText}}
          </ion-col>
        </ion-row>
        <ion-row v-if="resultsSummary.research.length > 0" class="title_row">
          <b>Research</b>
        </ion-row>
        <ion-row v-if="resultsSummary.research.length > 0">
          <ion-col size-xs="6" size-sm="4" size-md="3" size-lg="4" size-xl="3"
            v-for="(research, index) in resultsSummary.research"
            :key="index"
            class="reveal_row">
              {{research.shortText}}
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
              {{survey.startSector + 1}}-{{survey.endSector + 1}}: {{survey.numObject}}<ion-icon :src="survey.spaceObject.icon"></ion-icon>&nbsp;{{survey.numObject === 1 ? survey.spaceObject.name : survey.spaceObject.plural}}
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
              {{theory.sector + 1}}: {{theory.accurate ? "" : "not"}}&nbsp;<ion-icon :src="theory.spaceObject.icon"></ion-icon>&nbsp;{{theory.spaceObject.name}}
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { IonNavLink, IonGrid, IonRow, IonCol,
          IonIcon, IonFab, IonFabButton,
          popoverController } from '@ionic/vue';
import { informationCircleOutline } from "ionicons/icons";
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { initialToSpaceObject } from "@/constants.ts";
import ScreenSize from "@/mixins/ScreenSize.ts";
import NumObjectsPopover from "@/components/NumObjectsPopover.vue";

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
    IonFabButton
  },
  mixins: [ScreenSize],
  data() {
    const store = useStore();
    return {
      store,
      paths: undefined,
      iconRadii: undefined,
      iconWidth: undefined,
      informationCircleOutline
    }
  },
  computed: {
    currentSector: function(): any {
      return this.store.state.session.currentSector;
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
    logicBoard: function(): number {
      return this.store.state.logicBoard;
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
    }
  },
  methods: {
    positionSummary: function() {
      const resultsSummary = this.$refs.resultsSummary as HTMLElement;
      const cancelContainer = this.$refs.cancelContainer as HTMLElement;
      const canvas = this.$refs.logicCanvas as HTMLElement;
      if (cancelContainer && resultsSummary) {
        const cancelBox = cancelContainer.getBoundingClientRect();
        const resultsBox = resultsSummary.getBoundingClientRect();
        resultsSummary.style.maxHeight = (resultsBox.bottom - cancelBox.bottom - 10) + "px";
      } else if (canvas && resultsSummary) {
        const canvasBox = canvas.getBoundingClientRect();
        const resultsBox = resultsSummary.getBoundingClientRect();
        resultsSummary.style.maxHeight = (resultsBox.bottom - canvasBox.bottom - 10) + "px";
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
        return this.loadSVGWithColor(object.iconShort, this.getCSSVariable("--ion-color-light-contrast"));
      });

      return Promise.all(imagePromises);
    },
    fullImages: async function(): Promise<Array<any>> {
      const imagePromises = this.store.state.gameType.logicSheetOrder.map((initial: string) => {
        const object = initialToSpaceObject[initial];
        return this.loadSVGWithColor(object.iconFull, this.getCSSVariable("--ion-color-light-contrast"));
      });

      return Promise.all(imagePromises);
    },
    getIconRadii: async function(startRadius: number, space: number, width: number) {
      const iconImages = await this.iconImages();
      const fullImages = await this.fullImages();
      const heights = iconImages.map((img: any) => img.height * (width/img.width));
      const padding = (space - heights.reduce((a: number, b: number) => a + b, 0))/(iconImages.length - 1);

      const radii = [];
      let radius = startRadius;
      for (let i = 0; i < iconImages.length; i++) {
        radii.push({
          radius,
          image: iconImages[i],
          fullImage: fullImages[i],
          height: heights[i],
          width,
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
    getClickedObject: function(event: MouseEvent) {
      const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
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
      const { sector, iconRadius } = this.getClickedObject(event as MouseEvent);
      if (sector !== undefined) {
        return this.toggleObject(sector, iconRadius);
      }
    },
    handleRightClick: function(event: Event) {
      const { sector, iconRadius } = this.getClickedObject(event as MouseEvent);
      if (sector !== undefined) {
        this.toggleObjectEqual(sector, iconRadius);
      }
      event.preventDefault();
    },
    getCSSVariable: function(varName: string) {
      return getComputedStyle(document.body).getPropertyValue(varName);
    },
    redrawObject: function(sector: number, iconRadius: any, newStatus: string) {
      const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");

      ctx.save();
      ctx.rotate(Math.PI/2 + (this.sectorAngle/2 + sector * this.sectorAngle));

      const clearPadding = SELECTED_BOX_PADDING + LINE_WIDTH/2 + 1;
      ctx.fillStyle = this.getCSSVariable("--ion-color-light");
      ctx.fillRect(-iconRadius.width/2 - clearPadding, -iconRadius.radius - iconRadius.height - clearPadding, iconRadius.width + 2 * clearPadding, iconRadius.height + 2 * clearPadding);

      if (newStatus === "equal") {
        ctx.drawImage(iconRadius.image, -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
        ctx.beginPath();
        ctx.rect(-iconRadius.width/2 - SELECTED_BOX_PADDING, -iconRadius.radius - iconRadius.height - SELECTED_BOX_PADDING, iconRadius.width + 2 * SELECTED_BOX_PADDING, iconRadius.height + 2 * SELECTED_BOX_PADDING);
        ctx.strokeStyle = this.getCSSVariable("--ion-color-dark");
        ctx.stroke();
      } else if (newStatus === "none") {
        ctx.drawImage(iconRadius.image, -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
      } else if (newStatus === "eliminated"){
        ctx.drawImage(iconRadius.fullImage, -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
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
    drawObjectEliminated: function(sector: number, spaceObject: string) {
      const iconRadius = this.getIconRadius(spaceObject);
      this.redrawObject(sector, iconRadius, "eliminated");
    },
    drawObjectEqual: function(sector: number, spaceObject: string) {
      const iconRadius = this.getIconRadius(spaceObject);
      this.redrawObject(sector, iconRadius, "equal");
    },
    drawObjectUneliminated: function (sector: number, spaceObject: string) {
      const iconRadius = this.getIconRadius(spaceObject);
      this.redrawObject(sector, iconRadius, "none");

    },
    drawObjectUnsetEqual: function (sector: number, spaceObject: string) {
      const iconRadius = this.getIconRadius(spaceObject);
      this.redrawObject(sector, iconRadius, "none");
    },
    toggleObjectEqual: function(sector: number, iconRadius: any) {
      this.store.dispatch("logicToggleEqual", {
        sector,
        object: iconRadius.object
      });
    },
    toggleObject: function(sector: number, iconRadius: any) {
      const checkHold = this.store.state.logicBoard[sector].equalTo !== iconRadius.object;

      this.store.dispatch("logicToggle", {
        sector,
        object: iconRadius.object
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

      const mediumColor = darkColor.trim().toUpperCase() === "#FFFFFF" ? "gray" : "lemonchiffon";

      ctx.beginPath();
      ctx.fillStyle = lightColor;
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI, false);
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI, true);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = mediumColor;
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

      const mediumColor = darkColor.trim().toUpperCase() === "#FFFFFF" ? "gray" : "lemonchiffon";

      let iconWidth = 150;

      const objectPadding = 50;
      const maxIconWidth = 2 * Math.tan(sectorAngle/2) * (innerRadius + objectPadding);
      iconWidth = Math.min(iconWidth, maxIconWidth);

      const iconRadii = await this.getIconRadii(innerRadius + objectPadding, boardRadius - innerRadius - 2 * objectPadding, iconWidth);
      this.iconRadii = iconRadii;
      this.iconWidth = iconWidth;

      ctx.beginPath();
      ctx.fillStyle = lightColor;
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = mediumColor;
      ctx.arc(0, 0, outerRadius, skyAngle, skyAngle + Math.PI, false);
      ctx.arc(0, 0, boardRadius, skyAngle + Math.PI, skyAngle + 2*Math.PI, true);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = darkColor;
      ctx.arc(0, 0, innerRadius, 0, 2*Math.PI);
      ctx.stroke();

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
          if (iconRadii[j].object !== "C" || this.primes.indexOf(i+1) >= 0) {
            if (this.store.state.logicBoard[i].eliminated.has(iconRadii[j].object)) {
              ctx.drawImage(iconRadii[j].fullImage, -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
            } else if (this.store.state.logicBoard[i].equalTo === iconRadii[j].object) {
              ctx.drawImage(iconRadii[j].image, -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
              ctx.beginPath();
              ctx.rect(-iconRadii[j].width/2-10, -iconRadii[j].radius - iconRadii[j].height - 10, iconRadii[j].width + 20, iconRadii[j].height + 20);
              ctx.strokeStyle = darkColor;
              ctx.stroke();
            } else {
              ctx.drawImage(iconRadii[j].image, -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
            }
          }
        }

        ctx.restore();
      }
    }
  },
  watch: {
    seasonView: async function() {
      await this.computeCanvas();
    },
    currentSector: function() {
      this.redrawSky();
    }
  },
  async mounted() {
    this.store.subscribe((mutation, state) => {
      if (mutation.type === "logicEliminate") {
        this.drawObjectEliminated(mutation.payload.sector, mutation.payload.object);
      } else if (mutation.type === "logicUneliminate") {
        this.drawObjectUneliminated(mutation.payload.sector, mutation.payload.object);
      } else if (mutation.type === "logicSet") {
        this.drawObjectEqual(mutation.payload.sector, mutation.payload.object);
      } else if (mutation.type === "logicUnset") {
        this.drawObjectUnsetEqual(mutation.payload.sector, mutation.payload.object);
      }
    });

    await this.$nextTick();
    await this.computeCanvas();

    const canvas = this.$refs.logicCanvas as HTMLCanvasElement;
    canvas.addEventListener("contextmenu", (e: Event) => this.handleRightClick(e));

    let timeout: any = undefined;

    canvas.addEventListener("mousedown", (e: Event) => {
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

    window.addEventListener("resize", this.positionSummary);

    this.positionSummary();
  },
  unmounted() {
    window.removeEventListener("resize", this.positionSummary);
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
  margin-top: 5vh;
}

#title_container h1 {
  font-size: 50px;
  line-height: 56px;
}

#cancel_container_logic {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

#canvas-container_logic {
  width: 100%;
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
}

#results-summary {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: var(--ion-color-light);
  color: var(--ion-color-light-contrast);
  width: 100%;
  border: 1px solid gray;
  overflow: scroll;
  padding: 5px;
}

.reveal_row {
  display: flex;
  align-content: center;
  align-items: center;
}

.reveal_row ion-icon {
  font-size: 1.2em;
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
</style>
