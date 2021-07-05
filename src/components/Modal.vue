<template>
  <transition name="modal" appear>
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container" >
          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
// https://v3.vuejs.org/examples/modal.html#modal-component
import { defineComponent } from 'vue';
export default defineComponent({
  name: "Modal"
});
</script>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  transition: opacity 0.2s ease;
  background-color: rgba(0, 0, 0, 0.15);
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 1em 0;
  background-color: var(--ion-color-light);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: transform 0.2s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  color: var(--ion-color-dark);
}

.modal-body {
}

.modal-default-button {
  margin-top: 1rem;
}

.modal-enter-active .modal-container {
  transform: scale(0);
}

.modal-enter-to .modal-container {
  transform: scale(1);
}

.modal-enter-active.modal-mask {
  opacity: 0;
}

.modal-enter-to.modal-mask {
  opacity: 1;
}

</style>
