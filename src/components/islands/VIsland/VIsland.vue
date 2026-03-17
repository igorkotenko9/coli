<template>
  <div class="v-island">
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
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({
  isLoading: {
    type: Boolean,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import VLoader from "@components/loaders/VLoader";

defineProps(getProps());
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-island {
  --island-shadow-color: var(--app-color-gray-pale);
  position: relative;

  background-color: var(--app-color-gray-ultrapale);
  overflow: clip;
  border-radius: var(--v-island-border-radius, 16px);
  box-shadow: var(--island-shadow-color);

  &__loader {
    position: absolute;
    inset: 0;

    border-radius: 16px;
  }
}
</style>
