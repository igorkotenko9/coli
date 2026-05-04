<template>
  <Component
    :is="tag"
    class="v-label"
    :class="{
      'v-label--required': required,
    }"
    :for="forId"
  >
    <span class="v-label__text">
      <slot>{{ label }}</slot>
    </span>
  </Component>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";
export const getProps = () => ({
  label: String,
  required: Boolean,
  forId: String,
  tag: {
    type: String as PropType<"div" | "label">,
    default: "label" as const,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
defineProps(getProps());
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-label {
  display: flex;
  gap: 2px;
  align-items: center;

  width: max-content;
  max-width: 100%;

  color: var(--app-color-gray-blue);

  overflow: hidden;

  @include mixins.body-1;

  &--required {
    &::after {
      content: "*";

      flex-shrink: 0;

      color: var(--app-color-red-light);
    }
  }

  &__text {
    max-width: 100%;

    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
