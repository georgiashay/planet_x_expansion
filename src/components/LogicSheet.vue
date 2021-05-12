<template>
  <div id="container" v-if="store.getters.gameReady && store.state.isSession">
    <div id="title_container">
      <h3>Logic Sheet</h3>
    </div>
    <canvas id="logicCanvas" height="3200" width="3200"/>
    <div id="cancel_container" v-if="breakpoint !== 'md'">
      <ion-nav-link :router-link="'/session/gamemenu'">Return to Game Menu</ion-nav-link>
    </div>
  </div>
</template>

<script lang="ts">
import { IonNavLink } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { initialToSpaceObject } from "@/constants.ts";
import ScreenSize from "@/mixins/ScreenSize.ts";

export default defineComponent({
  name: 'LogicSheet',
  components: {
    IonNavLink
  },
  mixins: [ScreenSize],
  data() {
    const store = useStore();
    return {
      store,
      paths: undefined,
      iconRadii: undefined,
      iconWidth: undefined
    }
  },
  computed: {
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
    iconImages: async function(): Promise<Array<any>> {
      const imagePromises = [];
      for (const objectInitial of this.store.state.gameType.logicSheetOrder) {
        const img = new Image();
        img.src = initialToSpaceObject[objectInitial].iconShort;

        const imgProm = new Promise((resolve, reject) => {
          img.onload = function() {
            resolve(img);
          }
        });
        imagePromises.push(imgProm);
      }
      return Promise.all(imagePromises);
    },
    fullImages: async function(): Promise<Array<any>> {
      const imagePromises = [];
      for (const objectInitial of this.store.state.gameType.logicSheetOrder) {
        const img = new Image();
        img.src = initialToSpaceObject[objectInitial].iconFull;

        const imgProm = new Promise((resolve, reject) => {
          img.onload = function() {
            resolve(img);
          }
        });
        imagePromises.push(imgProm);
      }
      return Promise.all(imagePromises);
    },
    getIconRadii: async function(startRadius: number, space: number, width: number) {
      const iconImages = await this.iconImages();
      const fullImages = await this.fullImages();
      const heights = iconImages.map((img: any) => img.height * (width/img.width));
      const padding = (space - heights.reduce((a: number, b: number) => a + b, 0))/iconImages.length;

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
      const canvas = document.getElementById("logicCanvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const cx = x * canvas.width/canvas.offsetWidth - canvas.width/2;
      const cy = y *  canvas.height/canvas.offsetHeight - canvas.height/2;
      const angle = Math.atan2(cy, cx);

      let sectorAngle = angle;
      if (this.store.state.seasonView !== undefined) {
        sectorAngle -= this.store.state.seasonView.angle;
      }
      sectorAngle = (sectorAngle % (2*Math.PI) + 2*Math.PI) % (2*Math.PI);
      const sector = Math.floor(sectorAngle/this.sectorAngle);

      const rotatedCoords = this.rotate(cx, -cy, -Math.PI/2 - sector * this.sectorAngle - this.sectorAngle/2 + this.store.state.seasonView.angle);
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
    toggleObjectEqual: function(sector: number, iconRadius: any) {
      const canvas = document.getElementById("logicCanvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");

      ctx.save();
      ctx.rotate(Math.PI/2 + (this.sectorAngle/2 + sector * this.sectorAngle));

      ctx.fillStyle = "#222428";
      ctx.fillRect(-iconRadius.width/2 - 3, -iconRadius.radius - iconRadius.height - 3, iconRadius.width + 6, iconRadius.height + 6);

      if (this.store.state.logicBoard[sector] === undefined) {
        ctx.drawImage(iconRadius.image, -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
        ctx.beginPath();
        ctx.rect(-iconRadius.width/2, -iconRadius.radius - iconRadius.height, iconRadius.width, iconRadius.height);
        ctx.strokeStyle = "white";
        ctx.stroke();
      } else if (this.store.state.logicBoard[sector].equalTo === iconRadius.object) {
        ctx.drawImage(iconRadius.image, -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
      } else {
        ctx.drawImage(iconRadius.image, -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
        ctx.beginPath();
        ctx.rect(-iconRadius.width/2, -iconRadius.radius - iconRadius.height, iconRadius.width, iconRadius.height);
        ctx.strokeStyle = "white";
        ctx.stroke();
      }

      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      const x = (iconRadius.radius + iconRadius.height + 8) * Math.cos(sector * this.sectorAngle);
      const y = (iconRadius.radius + iconRadius.height + 8) * Math.sin(sector * this.sectorAngle);
      ctx.lineTo(x, y);

      ctx.moveTo(0, 0);
      const x2 = (iconRadius.radius + iconRadius.height + 8) * Math.cos((sector + 1) * this.sectorAngle);
      const y2 = (iconRadius.radius + iconRadius.height + 8) * Math.sin((sector + 1) * this.sectorAngle);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "white";
      ctx.stroke();

      this.store.commit("logicToggleEqual", {
        sector,
        object: iconRadius.object
      });
    },
    toggleObject: function(sector: number, iconRadius: any) {
      const canvas = document.getElementById("logicCanvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");

      ctx.save();
      ctx.rotate(Math.PI/2 + (this.sectorAngle/2 + sector * this.sectorAngle));

      ctx.fillStyle = "#222428";
      ctx.fillRect(-iconRadius.width/2 - 3, -iconRadius.radius - iconRadius.height - 3, iconRadius.width + 6, iconRadius.height + 6);

      if (this.store.state.logicBoard[sector] === undefined) {
        ctx.drawImage(iconRadius.fullImage, -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
      } else if (this.store.state.logicBoard[sector].eliminated.indexOf(iconRadius.object) >= 0
                  || this.store.state.logicBoard[sector].equalTo === iconRadius.object) {
        ctx.drawImage(iconRadius.image, -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
      } else {
        ctx.drawImage(iconRadius.fullImage, -iconRadius.width/2, -iconRadius.radius-iconRadius.height, iconRadius.width, iconRadius.height);
      }

      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      const x = (iconRadius.radius + iconRadius.height + 8) * Math.cos(sector * this.sectorAngle);
      const y = (iconRadius.radius + iconRadius.height + 8) * Math.sin(sector * this.sectorAngle);
      ctx.lineTo(x, y);

      ctx.moveTo(0, 0);
      const x2 = (iconRadius.radius + iconRadius.height + 8) * Math.cos((sector + 1) * this.sectorAngle);
      const y2 = (iconRadius.radius + iconRadius.height + 8) * Math.sin((sector + 1) * this.sectorAngle);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "white";
      ctx.stroke();

      const checkHold = this.store.state.logicBoard[sector] !== undefined
                          && this.store.state.logicBoard[sector].equalTo != iconRadius.object;

      this.store.commit("logicToggle", {
        sector,
        object: iconRadius.object
      });

      return checkHold;
    },
    computeCanvas: async function() {
      if (!this.store.getters.gameReady || !this.store.state.isSession) {
        return;
      }
      const canvas = document.getElementById("logicCanvas") as HTMLCanvasElement;
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

      ctx.lineWidth = 4;

      const sectorAngle = 2 * Math.PI/this.store.state.gameType.sectors;

      const boardRadius = 1400;
      const outerRadius = 1600;
      const textRadius = (boardRadius + outerRadius)/2;
      const textHeight = 150;

      const innerRadius = 450;
      const innerColors = ["#4379d1", "#d14d4d", "#65b85c", "#ccc84b"];

      const iconRadii = await this.getIconRadii(innerRadius + 20, boardRadius - innerRadius - 40, 150);
      this.iconRadii = iconRadii;
      this.iconWidth = 150;

      ctx.beginPath();
      ctx.fillStyle = "#222428";
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.arc(0, 0, innerRadius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.arc(0, 0, boardRadius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.arc(0, 0, outerRadius, 0, 2*Math.PI);
      ctx.stroke();

      for (let i = 0; i < this.store.state.gameType.sectors; i++) {
        // Sector line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const x = outerRadius * Math.cos(i * sectorAngle);
        const y = outerRadius * Math.sin(i * sectorAngle);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "white";
        ctx.stroke();

        // Inner sectors
        ctx.beginPath();
        ctx.fillStyle = innerColors[i % this.store.state.gameType.logicPatternInterval];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, innerRadius, i*sectorAngle, (i+1)*sectorAngle);
        ctx.lineTo(0, 0);
        ctx.fill();

        // Sector number label
        ctx.save();

        ctx.rotate(Math.PI/2 + (sectorAngle/2 + i * sectorAngle));

        ctx.font = textHeight + "px Roboto";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.fillText("" + (i+1), 0, -(textRadius-textHeight*0.1));

        for (let j = 0; j < iconRadii.length; j++) {
          if (iconRadii[j].object !== "C" || this.primes.indexOf(i+1) >= 0) {
            if (this.store.state.logicBoard[i] !== undefined && this.store.state.logicBoard[i].eliminated.indexOf(iconRadii[j].object) >= 0) {
              ctx.drawImage(iconRadii[j].fullImage, -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
            } else if (this.store.state.logicBoard[i] !== undefined && this.store.state.logicBoard[i].equalTo === iconRadii[j].object) {
              ctx.drawImage(iconRadii[j].image, -iconRadii[j].width/2, -iconRadii[j].radius-iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
              ctx.beginPath();
              ctx.rect(-iconRadii[j].width/2, -iconRadii[j].radius - iconRadii[j].height, iconRadii[j].width, iconRadii[j].height);
              ctx.strokeStyle = "white";
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
  mounted() {
    this.computeCanvas();
    const canvas = document.getElementById("logicCanvas") as HTMLCanvasElement;
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

#cancel_container {
  text-align: center;
  width: 100%;
  margin-top: 10px;
  text-decoration: underline;
}

#canvas-container {
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
</style>
