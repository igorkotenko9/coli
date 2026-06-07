<template>
  <AppLink :to="props.link">
    <ImageBackgroundIsland
      class="primary-general-news"
      interactive
      island-variation-padding="general-news"
      :background-image="props.imageLink"
      :size-variation="props.sizeVariation"
      :title="props.title"
      :type="props.type"
    />
  </AppLink>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

import AppLink from "@components/AppLink/AppLink.vue";
import ImageBackgroundIsland from "@components/islands/ImageBackgroundIsland/ImageBackgroundIsland.vue";
export type VariationNews = "big" | "small";

export const getProps = propsFactory({
  title: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
  },
  sizeVariation: {
    type: String as PropType<VariationNews>,
    required: false,
    default: "small",
  },
  type: {
    type: String,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
const props = defineProps(getProps());
</script>

<style scoped lang="scss">
.primary-general-news {
  display: flex;

  width: -webkit-fill-available;

  &__content-type {
    width: fit-content;
    padding: 4px;

    color: var(--app-color-background);

    background-color: var(--app-color-primary-dark);
  }

  &__data-bottom {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__news-title {
    width: fit-content;
    padding: 4px;

    color: var(--app-color-background);

    background-color: var(--app-color-primary-dark);
  }

  &__content-related {
    width: fit-content;
    padding: 4px;

    color: var(--app-color-background);

    background-color: var(--app-color-primary-dark);
  }
}
</style>
