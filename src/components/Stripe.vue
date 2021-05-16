<template>
  <div class="stripe">
    <div class="stripe-top"></div>
    <div class="stripe-bottom"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Stripe'
});
</script>

<style scoped>
.stripe {
  width: 100%;
  height: 30px;
}

.stripe-top {
  width: 100%;
  min-height: 50%;
  border-bottom: 1px solid var(--stripe-color);
}

.stripe-bottom {
  width: 100%;
  min-height: 50%;
}
</style>
