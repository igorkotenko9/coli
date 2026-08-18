<template>
  <div class="checkbox-skeleton">
    <div class="checkbox-skeleton__icon" />
    <div class="checkbox-skeleton__text" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.checkbox-skeleton {
  position: relative;

  display: flex;
  gap: 10px;

  &__icon,
  &__text {
    border-radius: 2px;
  }

  &__icon {
    flex-shrink: 0;

    width: 16px;
    height: 16px;

    background-color: var(--app-color-gray-pale);
  }

  &__text {
    flex-grow: 1;

    max-width: 100%;
    height: 16px;

    background-color: var(--app-color-gray-pale);
  }
}
</style>
