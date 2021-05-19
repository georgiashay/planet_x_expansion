<template>
  <div id="container">
    <div id="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
#container {
  padding: var(--container-padding);
  max-width: var(--max-container-width);
  margin-right: auto;
  margin-left: auto;
  color: var(--container-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100%;
}

#content {
  margin: 0;
  padding: 0;
}
</style>
