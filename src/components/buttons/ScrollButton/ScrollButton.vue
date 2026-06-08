<template>
  <button class="scroll-button" type="button">
    <VIcon class="scroll-button__icon" icon-name="arrow-rude-tail" />
  </button>
</template>

<script setup lang="ts">
import VIcon from "@components/VIcon";
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.scroll-button {
  --button-width: 30px;
  --button-height: 56px;

  display: grid;
  flex-shrink: 0;
  place-content: center flex-end;

  width: var(--button-width);
  height: var(--button-height);

  color: var(--app-color-background);

  background-color: var(--app-color-primary-norm);
  border-radius: 150px 0 0 150px;

  transition-property: color, background-color, top, opacity;
  transition-duration: var(--app-transition-duration-1);

  @include mixins.hover {
    color: var(--app-color-secondary-text);

    background-color: var(--app-color-primary-dark);
  }

  &__icon {
    --icon-size: 24px;

    width: var(--icon-size);
    height: var(--icon-size);
    padding: 6px;

    color: inherit;
  }
}
</style>
