<template>
  <div class="general-news">
    <VTitle class="general-news__title" variation="h1">Главные новости</VTitle>
    <div class="general-news__items-block">
      <div class="general-news__items general-news__items--primary">
        <template v-for="item in props.generalNewsData" :key="item.id">
          <PrimaryGeneralNews
            v-if="item.main"
            class="general-news__item general-news__item--primary"
            size-variation="big"
            :image-link="item.image"
            :link="item.link"
            :title="item.title"
            :type="item.type"
          />
        </template>
      </div>
      <CustomScrollbarWithButtons always>
        <div class="general-news__items general-news__items--compact">
          <template v-for="item in props.generalNewsData" :key="item.id">
            <PrimaryGeneralNews
              v-if="!item.main"
              class="general-news__item general-news__item--compact"
              :image-link="item.image"
              :link="item.link"
              :title="item.title"
              :type="item.type"
            />
          </template>
        </div>
      </CustomScrollbarWithButtons>
    </div>
    <VButton
      class="general-news__show-more-button"
      icon-name="arrow-rude-tail"
      icon-position="right"
      mode="link"
      size="small"
      url="/news"
      variation="supporting"
      >Больше новостей</VButton
    >
    <div class="general-news__divider" />
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

import VTitle from "@components/VTitle/VTitle.vue";
import VButton from "@components/buttons/VButton/VButton.vue";
import CustomScrollbarWithButtons from "@components/scroll/CustomScrollbarWithButtons/CustomScrollbarWithButtons.vue";

import PrimaryGeneralNews from "../PrimaryGeneralNews/PrimaryGeneralNews.vue";

export const getProps = propsFactory({
  generalNewsData: { type: Object as PropType<newsData> },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;

export type newsData = {
  id: string;
  image: string;
  link: string;
  main?: boolean;
  title: string;
  type: string;
}[];
</script>

<script setup lang="ts">
const props = defineProps(getProps());
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.general-news {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__title {
    color: var(--app-color-primary-norm);
  }

  &__items-block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @include mixins.xl-max {
      display: flex;
      flex-direction: column;
    }
  }

  &__items {
    &--primary {
      display: flex;
    }

    &--compact {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;

      @include mixins.xl-max {
        display: flex;
      }
    }
  }

  &__item {
    &--primary {
      display: flex;
      flex-grow: 1;

      min-height: 300px;
    }

    &--compact {
      display: flex;

      min-width: 100%;
      min-height: 200px;

      @include mixins.xl-max {
        min-width: 300px;
        max-width: 300px;
      }
    }
  }

  &__show-more-button {
    align-self: center;

    width: max-content;
  }

  &__divider {
    width: 100%;
    height: 2px;

    background-image: linear-gradient(
      to right,
      transparent 0%,
      var(--app-color-primary-norm) 10%,
      var(--app-color-primary-norm) 90%,
      transparent 100%
    );
    border-radius: 1px;
    opacity: 0.9;
  }
}
</style>
