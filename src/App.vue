<template>
  <div class="app">
    <div id="overlays" class="app_overlays" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.app {
  position: relative;

  display: grid;
  grid-template-columns: auto minmax(0, 1fr);

  min-height: 100vh;

  background-color: var(--app-color-background);

  &__overlays {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10000;
  }
}
</style>
