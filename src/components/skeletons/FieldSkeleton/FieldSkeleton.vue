<template>
  <div class="field-skeleton">
    <div class="field-skeleton__label" />
    <div class="field-skeleton__field" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.field-skeleton {
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__label,
  &__field {
    flex-shrink: 0;

    background-color: var(--app-color-gray-pale);
    border-radius: 8px;
  }

  &__label {
    max-width: 180px;
    height: 16px;
  }

  &__field {
    height: 40px;
  }
}
</style>
