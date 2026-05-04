<template>
  <VMessages class="input-messages" :class="variationClasses" v-bind="props" />
</template>

<script setup lang="ts">
import { type PropType, computed } from "vue";

import VMessages from "@components/VMessages";

const props = defineProps({
  variation: String as PropType<"error" | "warning">,
  messages: {
    type: [String, Array] as PropType<null | string | string[]>,
  },
});

const variationClasses = computed<string>(() =>
  props.variation ? `input-messages--${props.variation}` : "",
);
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.input-messages {
  display: flex;
  flex-direction: column;
  gap: 2px;

  color: var(--global-color-black);

  @include mixins.caption-1;

  &--error {
    color: var(--app-color-red-norm);
  }

  &--warning {
    color: var(--app-color-yellow-dark);
  }
}
</style>
