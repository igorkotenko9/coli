<template>
  <VTitle
    class="island-title"
    :class="rootDynamicClasses"
    tag="div"
    :variation="variation"
  >
    <slot />
  </VTitle>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({
  colorVariation: {
    type: String as PropType<ColorVariations>,
    default: "default",
  },
  variation: {
    type: String as PropType<TitleVariations>,
    default: "h3",
  },
});

export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;

type ColorVariations = "default" | "white";
</script>

<script setup lang="ts">
import { computed } from "vue";

import VTitle from "@components/VTitle";
import { type TitleVariations } from "@components/VTitle";

const props = defineProps(getProps());

const rootDynamicClasses = computed(() => {
  return [`island-title--${props.colorVariation}`];
});
</script>

<style scoped lang="scss">
.island-title {
  &--default {
    color: var(--app-color-brown-stroke);
  }

  &--white {
    color: var(--app-color-white);
  }
}
</style>
