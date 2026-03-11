<template>
  <div class="v-loader" :class="loaderBackgroundClass">
    <div class="v-loader__spinner" :class="loaderSizeClass">
      <div
        v-for="i in 12"
        :key="i"
        class="v-loader__spinner-item"
        :class="loaderColorClass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType, computed } from "vue";

type LoaderColor = "blue" | "dark-blue" | "manual" | "white";

type LoaderSizes = "lg" | "md" | "sm";

type LoaderBackground = "white";

const props = defineProps({
  loaderBackground: {
    type: String as PropType<LoaderBackground>,
  },
  loaderColor: {
    type: String as PropType<LoaderColor>,
    default: "dark-blue",
  },
  loaderSize: {
    type: String as PropType<LoaderSizes>,
    default: "lg",
  },
});

const loaderBackgroundClass = computed(
  () => `v-loader--${props.loaderBackground}`,
);

const loaderSizeClass = computed(
  () => `v-loader__spinner--${props.loaderSize}`,
);

const loaderColorClass = computed(
  () => `v-loader__spinner-item--${props.loaderColor}`,
);
</script>

<style scoped lang="scss">
@use "@style/variables" as vars;

@keyframes lds-spinner {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes lds-spinner {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.v-loader {
  z-index: vars.$z-index-loader;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  max-width: 100%;
  height: 100%;

  &--white {
    background-color: rgb(255 255 255 / 0.6);
  }

  &__spinner {
    position: relative;

    width: 40px;
    height: 40px;

    transform: scale(1.5);

    &--md {
      transform: scale(1);
    }

    &--sm {
      transform: scale(0.5);
    }

    &-item {
      position: absolute;
      top: 0;
      left: 17px;

      width: 2.5px;
      height: 7.5px;

      transform-origin: 3px 20px;
      animation-name: lds-spinner;
      animation-duration: 1s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;

      &--dark-blue {
        background-color: var(--app-color-primary-norm);
      }

      &--blue {
        background-color: var(--app-color-secondary-dark);
      }

      &--white {
        background-color: var(--app-color-white);
      }

      &--manual {
        background-color: currentcolor;
      }

      &:nth-child(1) {
        transform: rotate(0deg);
        animation-delay: -0.92s;
      }

      &:nth-child(2) {
        transform: rotate(30deg);
        animation-delay: -0.83s;
      }

      &:nth-child(3) {
        transform: rotate(60deg);
        animation-delay: -0.75s;
      }

      &:nth-child(4) {
        transform: rotate(90deg);
        animation-delay: -0.66s;
      }

      &:nth-child(5) {
        transform: rotate(120deg);
        animation-delay: -0.58s;
      }

      &:nth-child(6) {
        transform: rotate(150deg);
        animation-delay: -0.5s;
      }

      &:nth-child(7) {
        transform: rotate(180deg);
        animation-delay: -0.41s;
      }

      &:nth-child(8) {
        transform: rotate(210deg);
        animation-delay: -0.33s;
      }

      &:nth-child(9) {
        transform: rotate(240deg);
        animation-delay: -0.25s;
      }

      &:nth-child(10) {
        transform: rotate(270deg);
        animation-delay: -0.16s;
      }

      &:nth-child(11) {
        transform: rotate(300deg);
        animation-delay: -0.08s;
      }

      &:nth-child(12) {
        transform: rotate(330deg);
        animation-delay: 0s;
      }
    }
  }
}
</style>
