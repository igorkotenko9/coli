<template>
  <VTitle class="island-title" tag="div" variation="h3">
    <slot />
  </VTitle>
</template>

<script setup lang="ts">
import VTitle from "@components/VTitle";
</script>

<style scoped lang="scss">
.island-title {
  color: var(--app-color-secondary-text-dark);
}
</style>
