<template>
  <div class="button-skeleton" :class="skeletonVariationClass" />
</template>

<script setup lang="ts">
import { type PropType, computed } from "vue";
type VariationButton =
  | "accent"
  | "disabled"
  | "primary"
  | "secondary-light"
  | "white";

const props = defineProps({
  variation: {
    type: String as PropType<VariationButton>,
    default: "primary",
  },
});

const skeletonVariationClass = computed(() =>
  props.variation ? `button-skeleton--${props.variation}` : null,
);
</script>

<style scoped lang="scss">
.button-skeleton {
  position: relative;

  min-width: 200px;
  height: 40px;

  border-radius: 5px;

  &--primary {
    background-color: var(--app-color-primary-norm);
  }

  &--accent {
    background-color: var(--app-color-red-norm);
  }

  &--secondary-light {
    background-color: var(--app-color-secondary-light);
  }

  &--white {
    background-color: var(--app-color-white);
  }

  &--disabled {
    background-color: var(--app-color-gray-light);
  }
}
</style>
