<template>
  <div ref="rootElementRef" class="lazy-block">
    <SimpleLoader class="lazy-block__loader" />
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref } from "vue";

import {
  type UseIntersectionObserverOptions,
  useIntersectionObserver,
} from "@vueuse/core";

import SimpleLoader from "@components/loaders/SimpleLoader";

export interface Props {
  options?: UseIntersectionObserverOptions;
}

const props = defineProps({
  options: {
    type: Object as PropType<UseIntersectionObserverOptions>,
    default: () => ({
      rootMargin: "0px 0px 0px 0px",
      threshold: 0.5,
    }),
  },
});

const emit = defineEmits<{
  intersecting: [];
}>();

const rootElementRef = ref<HTMLDivElement>();

useIntersectionObserver(
  rootElementRef,
  ([entry]) => {
    if (entry?.isIntersecting) {
      emit("intersecting");
    }
  },
  props.options,
);
</script>

<style scoped lang="scss">
.lazy-block {
  display: grid;
  flex-shrink: 0;
  place-content: center;

  height: max-content;
  padding-inline: 10px;

  overflow: hidden;

  &__loader {
    --simple-loader-width: 16px;
    --simple-loader-height: 16px;
  }
}
</style>
