<template>
  <div
    ref="rootRef"
    class="custom-scrollbar"
    :class="{
      'custom-scrollbar--horizontal-scrollable': isScrollable.horizontal,
      'custom-scrollbar--vertical-scrollable': isScrollable.vertical,
      'custom-scrollbar--reversed': reversed,
      'custom-scrollbar--small': size === 'sm',
    }"
    @mouseleave="mouseLeaveScrollbarHandler"
    @mousemove="mouseMoveScrollbarHandler"
  >
    <div
      ref="wrapRef"
      class="custom-scrollbar__wrap"
      :class="{
        'custom-scrollbar__wrap--hidden-default': !native,
      }"
      @scroll="handleScroll"
    >
      <div ref="viewRef" class="custom-scrollbar__view">
        <slot
          :arrived-state="scrollArrivedState"
          :is-scrollable="isScrollable"
        />
      </div>
    </div>
    <template v-if="!native">
      <VTransition v-if="isScrollable.horizontal">
        <Bar
          v-show="always || isVisible.x"
          v-model:cursor-down="cursorDown.x"
          v-model:cursor-leave="cursorLeave.x"
          v-model:is-visible="isVisible.x"
          v-model:scroll="scrollLeft"
          class="custom-scrollbar__bar custom-scrollbar__bar--horizontal"
          :container-size="{
            scrollWidth: wrapScrollWidth,
            scrollHeight: wrapScrollHeight,
            offsetHeight: wrapOffsetHeight,
            offsetWidth: wrapOffsetWidth,
          }"
          :gap="gap"
        />
      </VTransition>
      <VTransition v-if="isScrollable.vertical">
        <Bar
          v-show="always || isVisible.y"
          v-model:cursor-down="cursorDown.y"
          v-model:cursor-leave="cursorLeave.y"
          v-model:is-visible="isVisible.y"
          v-model:scroll="scrollTop"
          class="custom-scrollbar__bar custom-scrollbar__bar--vertical"
          vertical
          :container-size="{
            scrollWidth: wrapScrollWidth,
            scrollHeight: wrapScrollHeight,
            offsetHeight: wrapOffsetHeight,
            offsetWidth: wrapOffsetWidth,
          }"
          :gap="gap"
        />
      </VTransition>
    </template>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

export type ScrollParams = {
  scrollLeft: number;
  scrollTop: number;
};

export const getProps = () =>
  ({
    always: Boolean,
    gap: Number,
    native: Boolean,
    size: String as PropType<"md" | "sm">,
    reversed: {
      type: Boolean,
      default: false,
    },
  }) as const;

export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { useScroll } from "@vueuse/core";

import { useElementSize } from "@hooks/useElementSize";

import VTransition from "@components/animations/VTransition";

import Bar from "./components/CustomScrollbarBar";

defineProps({
  ...getProps(),
});

const emit = defineEmits<{
  scroll: [
    {
      scrollLeft: number;
      scrollTop: number;
    },
  ];
}>();

const rootRef = ref<HTMLDivElement>();
const wrapRef = ref<HTMLDivElement>();

const { x: scrollLeft, y: scrollTop } = useScroll(wrapRef);

const {
  clientWidth: wrapClientWidth,
  clientHeight: wrapClientHeight,
  offsetHeight: wrapOffsetHeight,
  offsetWidth: wrapOffsetWidth,
  scrollHeight: wrapScrollHeight,
  scrollWidth: wrapScrollWidth,
} = useElementSize(wrapRef);

const maxScroll = computed(() => ({
  vertical: Math.max(wrapScrollHeight.value - wrapClientHeight.value, 0),
  horizontal: Math.max(wrapScrollWidth.value - wrapClientWidth.value, 0),
}));

const scrollArrivedRight = computed(
  () =>
    scrollLeft.value >= maxScroll.value.horizontal - 1 &&
    scrollLeft.value <= maxScroll.value.horizontal + 1,
);
const scrollArrivedBottom = computed(
  () =>
    scrollTop.value >= maxScroll.value.vertical - 1 &&
    scrollTop.value <= maxScroll.value.vertical + 1,
);

const scrollArrivedTop = computed(() => scrollTop.value === 0);
const scrollArrivedLeft = computed(() => scrollLeft.value === 0);

const scrollArrivedState = computed(() => {
  return {
    left: scrollArrivedLeft.value,
    right: scrollArrivedRight.value,
    top: scrollArrivedTop.value,
    bottom: scrollArrivedBottom.value,
  };
});

const isScrollable = computed(() => ({
  vertical: Math.floor(maxScroll.value.vertical) > 1,
  horizontal: Math.floor(maxScroll.value.horizontal) > 1,
}));

const handleScroll = () => {
  emit("scroll", {
    scrollTop: scrollTop.value,
    scrollLeft: scrollLeft.value,
  });
};

const cursorLeave = ref({
  x: false,
  y: false,
});
const isVisible = ref({
  x: false,
  y: false,
});
const cursorDown = ref({
  x: false,
  y: false,
});

const mouseMoveScrollbarHandler = () => {
  cursorLeave.value = { x: false, y: false };
  isVisible.value = {
    x: isScrollable.value.horizontal,
    y: isScrollable.value.vertical,
  };
};

const mouseLeaveScrollbarHandler = () => {
  cursorLeave.value = { x: true, y: true };
  isVisible.value = {
    ...cursorDown.value,
  };
};

defineExpose({
  scrollbarRef: rootRef,
  scrollbarWrapperRef: wrapRef,
  scrollTop,
  scrollLeft,
  maxScroll,
  isScrollable,
  scrollArrivedState,
  setScrollLeft: (value: number) => {
    scrollLeft.value = value;
  },
  setScrollTop: (value: number) => {
    scrollTop.value = value;
  },
});
</script>

<style lang="scss" scoped>
.custom-scrollbar {
  --track-bar-thickness: var(--custom-scrollbar-track-bar-thickness, 20px);
  --track-bar-padding: var(--custom-scrollbar-track-bar-padding, 20px);
  --track-bar-border-color: var(
    --custom-scrollbar-track-bar-border-color,
    var(--app-color-gray-stroke)
  );
  --wrap-max-height: var(--custom-scrollbar-wrap-max-height, 80vh);

  position: relative;

  display: grid;
  grid-template-areas: "view vertical-bar" "horizontal-bar .";
  grid-template-rows: 1fr var(--horizontal-bar-row-height, 0);
  grid-template-columns: 1fr var(--vertical-bar-column-width, 0);

  height: 100%;

  overflow: hidden;

  transition: all var(--app-transition-duration-1)
    var(--app-transition-timing-function);
  transition-property: grid-template-rows, grid-template-columns;

  &--small {
    --track-bar-thickness: 5px;
    --track-bar-padding: 0;
  }

  &--reversed {
    grid-template-areas: "vertical-bar view" "horizontal-bar .";
    grid-template-columns: var(--vertical-bar-column-width) 1fr;
    column-gap: 4px;
  }

  &--horizontal-scrollable {
    --horizontal-bar-row-height: var(--track-bar-thickness);
  }

  &--vertical-scrollable {
    --vertical-bar-column-width: var(--track-bar-thickness);
  }

  &__wrap {
    display: flex;
    flex-direction: column;
    grid-area: view;

    height: 100%;
    max-height: var(--wrap-max-height);

    overflow: auto;

    &--hidden-default {
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  &__view {
    flex-grow: 1;
  }

  &__bar {
    --custom-scrollbar-bar-thickness: var(--track-bar-thickness);
    --custom-scrollbar-bar-padding: var(--track-bar-padding);
    --custom-scrollbar-bar-border-color: var(--track-bar-border-color);

    display: flex;

    &--horizontal {
      grid-area: horizontal-bar;
      align-items: center;
    }

    &--vertical {
      grid-area: vertical-bar;
      justify-content: center;
    }
  }
}
</style>
