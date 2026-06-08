<template>
  <CustomScrollbar2 v-bind="$props" ref="scrollbarRef" class="custom-scrollbar">
    <template #default="slotsProps">
      <template v-if="slotsProps.isScrollable.horizontal">
        <ScrollButton
          v-if="!slotsProps.arrivedState.left"
          ref="toStartButtonRef"
          class="scrolling-button scrolling-button--to-start"
          :style="floatingToStartButtonStyles"
        />
        <ScrollButton
          v-if="!slotsProps.arrivedState.right"
          ref="toEndButtonRef"
          class="scrolling-button scrolling-button--to-end"
          :style="floatingToEndButtonStyles"
        />
      </template>
      <slot v-bind="slotsProps" name="default" />
    </template>
  </CustomScrollbar2>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

import { getCustomScrollbarProps } from "@components/scroll/CustomScrollbar";
export const getProps = propsFactory({
  ...getCustomScrollbarProps(),
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { type ComponentExposed } from "vue-component-type-helpers";

import {
  autoUpdate,
  limitShift,
  offset,
  shift,
  useFloating,
} from "@floating-ui/vue";
import { useElementHover, useIntervalFn } from "@vueuse/core";

import ScrollButton from "@components/buttons/ScrollButton";
import CustomScrollbar2 from "@components/scroll/CustomScrollbar";

defineProps(getProps());
const scrollbarRef = ref<ComponentExposed<typeof CustomScrollbar2>>();

const scrollDelta = ref<number>(3);
const horizontalScrollStatus = computed(() => ({
  isEnd: scrollbarRef.value?.scrollArrivedState.right,
  isStart: scrollbarRef.value?.scrollArrivedState.left,
}));
const currentScrollDirection = computed<"toEnd" | "toStart" | null>(() => {
  return isToEndButtonHovered.value && !isToStartButtonHovered.value
    ? "toEnd"
    : horizontalScrollStatus.value.isStart
      ? null
      : "toStart";
});
const currentDelta = computed(() =>
  currentScrollDirection.value === "toEnd"
    ? scrollDelta.value
    : currentScrollDirection.value === "toStart"
      ? scrollDelta.value * -1
      : 0,
);

const scrollbarElementInnerRef = computed(
  () => scrollbarRef.value?.scrollbarWrapperRef,
);

const currentScroll = computed(() => scrollbarRef.value?.scrollLeft || 0);

const shouldScroll = computed<boolean>(
  () =>
    (isToStartButtonHovered.value && !horizontalScrollStatus.value.isStart) ||
    (isToEndButtonHovered.value && !horizontalScrollStatus.value.isEnd),
);

const toStartButtonRef = ref<InstanceType<typeof ScrollButton>>();
const toEndButtonRef = ref<InstanceType<typeof ScrollButton>>();

const isToStartButtonHovered = useElementHover(
  () => toStartButtonRef.value?.$el,
);
const isToEndButtonHovered = useElementHover(() => toEndButtonRef.value?.$el);

watch([toStartButtonRef, toEndButtonRef], () => {
  if (!toStartButtonRef.value && isToStartButtonHovered.value) {
    isToStartButtonHovered.value = false;
  }

  if (!toEndButtonRef.value && isToEndButtonHovered.value) {
    isToEndButtonHovered.value = false;
  }
});

// TODO: доработать так, чтобы кнопки были в центре экрана
const floatingMiddleware = ref([
  offset(({ rects }) => {
    return {
      mainAxis:
        rects.reference.height > window.innerHeight
          ? -window.innerHeight / 2 - rects.floating.height / 2
          : -rects.reference.height / 2 - rects.floating.height / 2,
    };
  }),
  shift(({ rects }) => ({
    crossAxis: true,
    mainAxis: false,
    limiter: limitShift({
      crossAxis: true,
      mainAxis: false,
      offset: {
        crossAxis: rects.floating.height,
      },
    }),
  })),
]);

const { floatingStyles: floatingToStartButtonStyles } = useFloating(
  scrollbarElementInnerRef,
  toStartButtonRef,
  {
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: floatingMiddleware,
  },
);

const { floatingStyles: floatingToEndButtonStyles } = useFloating(
  scrollbarElementInnerRef,
  toEndButtonRef,
  {
    placement: "bottom-end",
    whileElementsMounted: autoUpdate,
    middleware: floatingMiddleware,
  },
);

const scrollContainer = useIntervalFn(
  () => {
    scrollbarRef.value?.setScrollLeft(currentScroll.value + currentDelta.value);
  },
  1,
  {
    immediate: false,
  },
);

watch(shouldScroll, (isShouldScroll) => {
  if (isShouldScroll) {
    scrollContainer.resume();
  } else {
    scrollContainer.pause();
  }
});

defineExpose({
  scrollbarElementInnerRef,
});
</script>

<style scoped lang="scss">
.scrolling-button {
  z-index: 9;

  will-change: transform;

  &--to-start {
    scale: -1 1;
  }
}
</style>
