<template>
  <div class="page-loader">
    <VLoader />
  </div>
</template>

<script setup lang="ts">
import VLoader from "../VLoader/VLoader.vue";
</script>

<style scoped lang="scss">
@use "@style/variables" as vars;

.page-loader {
  position: absolute;
  z-index: vars.$z-index-page-loader;

  width: 100%;
  height: 100%;

  background-color: var(--app-color-gray-blue);
  opacity: 0.7;
}
</style>
