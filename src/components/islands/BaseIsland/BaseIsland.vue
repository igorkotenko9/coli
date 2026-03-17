<template>
  <VIsland class="base-island">
    <IslandBox class="base-island__island-box">
      <div class="base-island__header">
        <IslandTitle v-if="title" class="base-island__title">
          {{ title }}
        </IslandTitle>

        <div class="base-island__main">
          <slot name="header-content" />
        </div>
      </div>

      <slot />
    </IslandBox>
  </VIsland>
</template>

<script setup lang="ts">
import IslandBox from "@components/islands/IslandBox";
import IslandTitle from "@components/islands/IslandTitle";
import VIsland from "@components/islands/VIsland";

defineProps({
  title: { type: String, required: false },
});
</script>

<style scoped lang="scss">
.base-island {
  &__island-box {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__header {
    display: flex;
    gap: 24px;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
