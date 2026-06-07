<template>
  <div class="island-box" :class="rootDynamicClasses">
    <slot />
  </div>
</template>

<script lang="ts">
import { type PropType } from "vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({
  variationPadding: {
    type: String as PropType<VariationPadding>,
    default: "default",
  },
});

export type VariationPadding = "default" | "general-news";
</script>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps(getProps());

const rootDynamicClasses = computed(() => {
  return [`island-box--${props.variationPadding}`];
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.island-box {
  &--default {
    padding-block: 30px 40px;
    padding-inline: 30px;
  }

  &--general-news {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    padding: 0;
  }
}
</style>
