<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="the-main-page">
    <div class="the-main-page__block">
      <VTitle class="the-main-page__title" variation="h1">Новости</VTitle>
      <div class="the-main-page__news">
        <BaseIsland title="Главная новость"
          ><VHtmlText text="Текст новости"
        /></BaseIsland>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VHtmlText from "@components/VHtmlText/VHtmlText.vue";
import VTitle from "@components/VTitle/VTitle.vue";
import BaseIsland from "@components/islands/BaseIsland/BaseIsland.vue";
</script>

<style scoped lang="scss">
.the-main-page {
  &__block {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__title {
    color: var(--app-color-primary-light);
  }
}
</style>
