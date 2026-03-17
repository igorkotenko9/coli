<template>
  <div class="island-header">
    <IslandTitle v-if="title" class="island-header__title">
      {{ title }}
    </IslandTitle>

    <div v-if="hasSlotContentDefault" class="island-header__main">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlotFullness } from "@hooks/useSlotFullness";

import IslandTitle from "@components/islands/IslandTitle";

defineProps({
  title: { type: String, required: false },
  backTo: { type: String },
});

const hasSlotContentDefault = useSlotFullness("default");
</script>

<style scoped lang="scss">
.island-header {
  display: flex;
  gap: 16px;
  align-items: center;

  padding: 20px 30px;

  &__main {
    width: var(--island-header-main-width, auto);
    margin-left: auto;
  }
}
</style>
