<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="the-404">
    <VTitle class="the-404__title" tag="div" variation="h1"> 404 </VTitle>
    <VIcon icon-name="settings" />
    <div class="the-404__subtitle">Страница в разработке</div>
  </div>
</template>

<script setup lang="ts">
import VIcon from "@components/VIcon/VIcon.vue";
import VTitle from "@components/VTitle";
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.the-404 {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;

  height: 92vh;

  color: var(--app-color-primary-norm);

  &__subtitle {
    @include mixins.subtitle-1;
  }
}
</style>
