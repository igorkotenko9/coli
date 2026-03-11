<template>
  <div class="easy-loader">
    <div
      class="easy-loader__inner"
      :class="{
        'easy-loader__inner--two-lined-round': variation === 'two-lined-round',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { type PropType } from "vue";

defineProps({
  variation: String as PropType<"two-lined-round">,
});
</script>

<style scoped lang="scss">
@keyframes l20-1 {
  0% {
    clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%);
  }

  12.5% {
    clip-path: polygon(
      50% 50%,
      0 0,
      50% 0%,
      100% 0%,
      100% 0%,
      100% 0%,
      100% 0%
    );
  }

  25% {
    clip-path: polygon(
      50% 50%,
      0 0,
      50% 0%,
      100% 0%,
      100% 100%,
      100% 100%,
      100% 100%
    );
  }

  50% {
    clip-path: polygon(
      50% 50%,
      0 0,
      50% 0%,
      100% 0%,
      100% 100%,
      50% 100%,
      0% 100%
    );
  }

  62.5% {
    clip-path: polygon(
      50% 50%,
      100% 0,
      100% 0%,
      100% 0%,
      100% 100%,
      50% 100%,
      0% 100%
    );
  }

  75% {
    clip-path: polygon(
      50% 50%,
      100% 100%,
      100% 100%,
      100% 100%,
      100% 100%,
      50% 100%,
      0% 100%
    );
  }

  100% {
    clip-path: polygon(
      50% 50%,
      50% 100%,
      50% 100%,
      50% 100%,
      50% 100%,
      50% 100%,
      0% 100%
    );
  }
}

@keyframes l20-2 {
  0% {
    transform: scaleY(1) rotate(0deg);
  }

  49.99% {
    transform: scaleY(1) rotate(135deg);
  }

  50% {
    transform: scaleY(-1) rotate(0deg);
  }

  100% {
    transform: scaleY(-1) rotate(-135deg);
  }
}

@keyframes l1 {
  0% {
    transform: rotate(0.45turn);
  }

  50% {
    transform: rotate(3.95turn);
  }

  100% {
    transform: rotate(8.45turn);
  }
}

.easy-loader {
  width: var(--easy-loader-width);
  height: var(--easy-loader-height);
  aspect-ratio: 1;

  &__inner {
    width: inherit;
    height: inherit;
    border: 2px solid currentcolor;

    border-radius: 50%;

    animation:
      l20-1 0.8s infinite linear alternate,
      l20-2 1.6s infinite linear;

    &--two-lined-round {
      border-color: currentcolor transparent;

      animation: l1 3s infinite;
    }
  }
}
</style>
