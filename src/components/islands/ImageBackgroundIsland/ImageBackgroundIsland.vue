<template>
  <VIsland class="image-background-island">
    <IslandBox :variation-padding="props.islandVariationPadding">
      <VImage
        class="image-background-island__background"
        :class="[
          props.interactive
            ? `image-background-island__background--interactive`
            : ``,
        ]"
        :src="props.backgroundImage"
      />
      <div class="image-background-island__content">
        <div class="image-background-island__content-top">
          <VContentBadge
            class="image-background-island__badge"
            variation="brown"
            :text="props.type"
          />
        </div>
        <div class="image-background-island__content-bottom">
          <IslandTitle
            v-if="props.title"
            class="image-background-island__title"
            color-variation="white"
            :variation="props.sizeVariation === 'small' ? 'subtitle-3' : 'h3'"
            >{{ props.title }}</IslandTitle
          >
        </div>
      </div></IslandBox
    >
  </VIsland>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

import VContentBadge from "@components/VContentBadge/VContentBadge.vue";
import { type VariationGeneralNews } from "@components/news/PrimaryGeneralNews";

import { type IslandVariationPadding } from "../IslandBox";
import IslandTitle from "../IslandTitle/IslandTitle.vue";

export const getProps = propsFactory({
  backgroundImage: String,
  interactive: {
    type: Boolean,
    default: false,
  },
  islandVariationPadding: {
    type: String as PropType<IslandVariationPadding>,
    default: "default",
  },
  title: { type: String, required: false },
  type: {
    type: String,
  },
  sizeVariation: {
    type: String as PropType<VariationGeneralNews>,
    default: "small",
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import VImage from "@components/VImage/VImage.vue";

import IslandBox from "../IslandBox/IslandBox.vue";
import VIsland from "../VIsland/VIsland.vue";

const props = defineProps(getProps());
</script>

<style scoped lang="scss">
.image-background-island {
  position: relative;

  overflow: hidden;

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;

    width: 100%;
    height: 100%;
    object-fit: cover;

    transition:
      transform 0.8s ease,
      filter 0.8s ease;
    will-change: transform, filter;
  }

  &__content {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: 100%;
  }

  &__content-top {
    display: flex;
    align-self: end;

    padding-block: 16px;
    padding-inline: 16px;
  }

  &__content-bottom {
    padding-block: 8px;
    padding-inline: 16px;

    background-color: rgb(var(--app-color-brown-norm-rgb), 0.7);

    transition-duration: 0.5s;
  }

  /* stylelint-disable-next-line selector-max-compound-selectors */
  &:hover &__background--interactive {
    filter: brightness(0.5);

    transform: scale(1.05);
  }

  /* stylelint-disable-next-line selector-max-compound-selectors */
  &:hover &__content-bottom {
    background-color: rgb(var(--app-color-brown-dark-rgb), 0.7);
  }
}
</style>
