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
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

import VTitle from "@components/VTitle/VTitle.vue";
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
  gap: 12px;

  &__title {
    color: var(--app-color-brown-norm);
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
}
</style>
