<template>
  <ion-item color="light">
    <ion-label position="floating">{{label}}</ion-label>
    <ion-input
      :key="updateToggleKey"
      :value="value"
      @input.stop="valueChanged"
      type="number"
      :min="min"
      :max="max" tabIndex="2">
    </ion-input>
    <div class="up-down-container" tabIndex="1">
      <div class="up-button" @click.stop="incrementValue">
        <ion-icon :src="caretUpOutline"/>
      </div>
      <div class="down-button" @click.stop="decrementValue">
        <ion-icon :src="caretDownOutline"/>
      </div>
    </div>
  </ion-item>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { IonInput, IonItem, IonLabel, IonIcon } from '@ionic/vue';
import { caretUpOutline, caretDownOutline } from 'ionicons/icons';

export default defineComponent({
  name: "IncrementInput",
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    label: {
      type: String,
      default: "Number"
    }
  },
  components: {
    IonInput,
    IonItem,
    IonLabel,
    IonIcon
  },
  data: function() {
    return {
      updateToggleKey: true,
      caretUpOutline,
      caretDownOutline
    }
  },
  methods: {
    valueChanged: function(event: any) {
      if (event.target.value) {
        // Input value is a string
        let newValue: number = parseInt(event.target.value);
        if (!isNaN(newValue)) {
          // Clamp between minimum and maximum
          newValue = this.clampValue(newValue);
          const needsForceUpdate = (newValue == this.value);
          this.$emit("input", newValue);
          if (needsForceUpdate) {
            // Change :key on ion-input so text gets re-rendered with clamped
            // value
            this.updateToggleKey = !this.updateToggleKey;
          }
        }
      }
    },
    incrementValue: function() {
      const newValue = this.clampValue(this.value as number + 1);
      this.$emit("input", newValue);
    },
    decrementValue: function() {
      const newValue = this.clampValue(this.value as number - 1);
      this.$emit("input", newValue);
    },
    clampValue: function(value: number): number {
      if (value > this.max) {
        return this.max as number;
      }
      if (value < this.min) {
        return this.min as number;
      }
      return value;
    }
  }
});
</script>
<style scoped>
.up-down-container {
  height: 100%;
  width: 32px;
  right: 0;
  position: absolute;
  padding-top: 28px;
  padding-bottom: 8px;
  padding-right: 12px;
  z-index: 10;
}

.up-button {
  background-color: var(--ion-color-dark);
  width: 100%;
  height: 50%;
  color: var(--ion-color-medium);
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
}

@media (prefers-color-scheme: dark) {
  .up-button:hover {
    background-color: silver;
    color: #505050;
  }

  .down-button:hover {
    background-color: silver;
    color: #505050;
  }
}

@media (prefers-color-scheme: light) {
  .up-button:hover {
    background-color: #707070;
    color: #d0d0d0;
  }

  .down-button:hover {
    background-color: #707070;
    color: #d0d0d0;
  }
}

body.dark .up-button:hover {
  background-color: silver;
  color: #505050;
}

body.dark .down-button:hover {
  background-color: silver;
  color: #505050;
}

body:not(.dark) .up-button:hover {
  background-color: #707070;
  color: #d0d0d0;
}

body:not(.dark) .down-button:hover {
  background-color: #707070;
  color: #d0d0d0;
}

.down-button {
  background-color: var(--ion-color-dark);
  width: 100%;
  height: 50%;
  color: var(--ion-color-medium);
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
}

.up-down-container ion-icon {
  font-size: 0.8em;
}
</style>
