<template>
  <div class="skeleton-container">
    <slot />
  </div>
</template>

<script lang="ts"></script>

<script setup lang="ts"></script>

<style scoped lang="scss">
@keyframes shine-background {
  0% {
    background-position: 100%;
  }

  100% {
    background-position: -100%;
  }
}

.skeleton-container {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);

  &::before {
    content: "";

    position: absolute;
    inset: 0;
    z-index: 1;

    background-image: linear-gradient(
      100deg,
      transparent 40%,
      rgb(255 255 255 / 0.9) 50%,
      transparent 60%
    );
    background-attachment: fixed;
    background-size: 200% 100%;

    animation-name: shine-background;
    animation-duration: 1.5s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
}
</style>
