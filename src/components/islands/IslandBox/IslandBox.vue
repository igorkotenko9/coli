<template>
  <div class="island-box">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.island-box {
  padding-block: 30px 40px;
  padding-inline: 30px;
}
</style>
