<template>
  <component :is="tag" class="v-title" :class="additionalClasses">
    <slot />
  </component>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

export type Tags = "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
export type Variations = "body1" | "h1" | "h2" | "h3" | "subtitle-1";

export const getVTitleProps = propsFactory({
  tag: {
    type: String as PropType<Tags>,
    default: "div",
  },
  variation: {
    type: String as PropType<Variations>,
    required: true,
  },
});

export type Props = ExtractPropTypes<ReturnType<typeof getVTitleProps>>;
</script>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  ...getVTitleProps(),
});

const additionalClasses = computed<object>(() => {
  return { [`v-title--${props.variation}`]: props.variation };
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-title {
  text-wrap: balance;
  /* stylelint-disable-next-line declaration-property-value-keyword-no-deprecated */
  word-break: break-word;

  &--h1 {
    @include mixins.h1;
  }

  &--h2 {
    @include mixins.h2;
  }

  &--h3 {
    @include mixins.h3;
  }

  &--body1 {
    @include mixins.body-1;
  }

  &--subtitle-1 {
    @include mixins.subtitle-1;
  }
}
</style>
