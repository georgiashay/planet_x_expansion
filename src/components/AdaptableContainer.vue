<template>
  <div id="container">
    <div id="top_spacer"></div>
    <div id="content">
      <slot></slot>
    </div>
    <div id="bottom_spacer"></div>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  max-width: var(--max-container-width);
  color: var(--container-color);
  margin-right: auto;
  margin-left: auto;
}

#top_spacer {
  flex-basis: calc(var(--default-content-position) - var(--container-padding));
}

#bottom_spacer {
  flex-basis: calc((var(--default-content-position) - var(--container-padding)) * var(--reduce-gap-after-centered));
}

#content {
  margin: 0;
  padding: var(--container-padding);
}
</style>
