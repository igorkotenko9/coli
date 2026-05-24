<template>
  <div class="v-island" :class="islandColorClass">
    <slot />

    <VLoader
      v-if="isLoading"
      class="v-island__loader"
      loader-background="white"
      loader-size="md"
    />
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { computed } from "vue";

import VLoader from "@components/loaders/VLoader";

export type IslandColor = "beige" | "blue" | "pale";

const props = defineProps({
  isLoading: {
    type: Boolean,
  },
  islandColor: {
    type: String as PropType<IslandColor>,
    default: "beige",
  },
});

const islandColorClass = computed(() => `v-island--${props.islandColor}`);
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-island {
  --island-shadow-color: var(--app-color-brown-pale);
  position: relative;

  color: var(--app-color-brown-black);

  background-color: var(--island-background-color);
  overflow: clip;
  border-radius: var(--v-island-border-radius, 16px);
  box-shadow: var(--island-shadow-color);

  &__loader {
    position: absolute;
    inset: 0;

    border-radius: 16px;
  }

  &--beige {
    --island-background-color: var(--app-color-background-dark);
  }

  &--pale {
    --island-background-color: var(--app-color-background);
  }

  &--blue {
    --island-background-color: var(--app-color-primary-light);
  }
}
</style>
