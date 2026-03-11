<template>
  <div class="the-base-page-tech">
    <PageLoader v-if="isPageLoader" />
    <div class="the-base-page-tech__content">
      <div class="the-base-page-tech__block">
        <div class="the-base-page-tech__section-header">VButton</div>
        <div class="the-base-page-tech__grid">
          <div class="the-base-page-tech__column">
            <VButton>Сохранить</VButton>
            <VButton disabled>Сохранить</VButton>
          </div>
          <div class="the-base-page-tech__column">
            <VButton variation="accent">Удалить</VButton>
            <VButton disabled variation="accent">Удалить</VButton>
          </div>
          <div class="the-base-page-tech__column">
            <VButton icon-name="checkbox-checked">Принять</VButton>
            <VButton icon-name="close" icon-position="right" variation="accent"
              >Отказать</VButton
            >
          </div>
          <div v-if="isSimpleLoading" class="the-base-page-tech__column">
            <VButton is-loading variation="primary">Загрузить</VButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import VButton from "@components/buttons/VButton/VButton.vue";
import PageLoader from "@components/loaders/PageLoader/PageLoader.vue";

const isPageLoader = ref<boolean>(false);
const isSimpleLoading = ref<boolean>(false);
</script>

<style scoped lang="scss">
.the-base-page-tech {
  color: var(--app-color-secondary-text);

  &__content {
    display: flex;
    flex-direction: column;
    gap: 32px;

    padding: 32px;
  }

  &__block {
    display: flex;
    flex-direction: column;
    gap: 8px;

    padding: 12px;

    border-radius: 12px;
  }

  &__section-header {
    margin-bottom: 8px;
  }

  &__buttons {
    display: flex;
    gap: 12px;
  }

  &__grid {
    display: flex;
    gap: 32px;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: space-between;
    align-items: flex-start;
  }
}
</style>
