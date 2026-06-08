<template>
  <div
    ref="rootRef"
    class="custom-scrollbar-bar"
    :class="[`custom-scrollbar-bar--${bar.key}`]"
    @mousedown="clickTrackHandler"
  >
    <div
      ref="thumbRef"
      class="custom-scrollbar-bar__thumb"
      :class="[`custom-scrollbar-bar__thumb--${bar.key}`]"
      :style="thumbStyle"
      @mousedown="clickThumbHandler"
    />
  </div>
</template>

<script lang="ts">
import { type CSSProperties, type ExtractPropTypes, type PropType } from "vue";

export const BAR_MAP = {
  vertical: {
    offset: "offsetHeight",
    scroll: "scrollTop",
    scrollSize: "scrollHeight",
    size: "height",
    key: "vertical",
    axis: "Y",
    client: "clientY",
    direction: "top",
  },
  horizontal: {
    offset: "offsetWidth",
    scroll: "scrollLeft",
    scrollSize: "scrollWidth",
    size: "width",
    key: "horizontal",
    axis: "X",
    client: "clientX",
    direction: "left",
  },
} as const;

export const getProps = () =>
  ({
    vertical: Boolean,
    gap: {
      type: Number,
      default: 20,
    },
    containerSize: {
      type: Object as PropType<{
        offsetHeight: number;
        offsetWidth: number;
        scrollHeight: number;
        scrollWidth: number;
      }>,
      default: () => ({
        scrollHeight: 0,
        scrollWidth: 0,
        offsetHeight: 0,
        offsetWidth: 0,
      }),
    },
  }) as const;

export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from "vue";

import { isClient } from "@vueuse/shared";

const props = defineProps(getProps());

const scroll = defineModel("scroll", {
  type: Number,
  default: 0,
});

const rootRef = ref<HTMLDivElement>();
const thumbRef = ref<HTMLDivElement>();

const thumbState = ref<Partial<Record<"X" | "Y", number>>>({});
const isVisible = defineModel("isVisible", {
  type: Boolean,
  default: false,
});

const cursorDown = defineModel("cursorDown", {
  type: Boolean,
  default: false,
});
const cursorLeave = defineModel("cursorLeave", {
  type: Boolean,
  default: false,
});
let originalOnSelectStart:
  | ((this: GlobalEventHandlers, ev: Event) => any)
  | null = isClient ? document.onselectstart : null;

const bar = computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);

const thumbsParams = computed(() => {
  if (props.vertical) {
    const offsetHeight = props.containerSize.offsetHeight - props.gap;
    const originalHeight = offsetHeight ** 2 / props.containerSize.scrollHeight;
    const height = Math.max(originalHeight, 50);

    const ratioY =
      originalHeight /
      (offsetHeight - originalHeight) /
      (height / (offsetHeight - height));

    const sizeHeight = height + props.gap < offsetHeight ? `${height}px` : "";

    return {
      ratio: ratioY,
      size: sizeHeight,
    };
  } else {
    const offsetWidth = props.containerSize.offsetWidth - props.gap;
    const originalWidth = offsetWidth ** 2 / props.containerSize.scrollWidth;
    const width = Math.max(originalWidth, 50);

    const ratioX =
      originalWidth /
      (offsetWidth - originalWidth) /
      (width / (offsetWidth - width));

    const sizeWidth = width + props.gap < offsetWidth ? `${width}px` : "";

    return {
      ratio: ratioX,
      size: sizeWidth,
    };
  }
});

const offsetRatio = computed(() => {
  return (
    Number(rootRef.value?.[bar.value.offset]) ** 2 /
    props.containerSize[bar.value.scrollSize] /
    thumbsParams.value.ratio /
    Number(thumbRef.value?.[bar.value.offset])
  );
});

const barOffsetParams = computed(() => {
  if (props.vertical) {
    const offsetHeight = props.containerSize.offsetHeight;

    return ((scroll.value * 100) / offsetHeight) * thumbsParams.value.ratio;
  } else {
    const offsetWidth = props.containerSize.offsetWidth;

    return ((scroll.value * 100) / offsetWidth) * thumbsParams.value.ratio;
  }
});

const thumbStyle = computed<CSSProperties>(() => ({
  [bar.value.size]: thumbsParams.value.size,
  transform: `translate${bar.value.axis}(${barOffsetParams.value}%)`,
}));

const clickThumbHandler = (e: MouseEvent) => {
  // prevent click event of middle and right button
  e.stopPropagation();
  if (e.ctrlKey || [1, 2].includes(e.button)) return;

  window.getSelection()?.removeAllRanges();
  startDrag(e);

  const el = e.currentTarget as HTMLDivElement;
  if (!el) return;
  thumbState.value[bar.value.axis] =
    el[bar.value.offset] -
    (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
};

const clickTrackHandler = (e: MouseEvent) => {
  if (!thumbRef.value || !rootRef.value) return;

  const offset = Math.abs(
    (e.target as HTMLElement).getBoundingClientRect()[bar.value.direction] -
      e[bar.value.client],
  );
  const thumbHalf = thumbRef.value[bar.value.offset] / 2;
  const thumbPositionPercentage =
    ((offset - thumbHalf) * 100 * offsetRatio.value) /
    rootRef.value[bar.value.offset];

  scroll.value =
    (thumbPositionPercentage * props.containerSize[bar.value.scrollSize]) / 100;
};

const startDrag = (e: MouseEvent) => {
  e.stopImmediatePropagation();

  cursorDown.value = true;
  document.addEventListener("mousemove", mouseMoveDocumentHandler);
  document.addEventListener("mouseup", mouseUpDocumentHandler);
  originalOnSelectStart = document.onselectstart;
  document.addEventListener("selectstart", () => false);
};

const mouseMoveDocumentHandler = (e: MouseEvent) => {
  if (!rootRef.value || !thumbRef.value) return;
  if (cursorDown.value === false) return;

  const prevPage = thumbState.value[bar.value.axis];
  if (!prevPage) return;

  const offset =
    (rootRef.value.getBoundingClientRect()[bar.value.direction] -
      e[bar.value.client]) *
    -1;
  const thumbClickPosition = thumbRef.value[bar.value.offset] - prevPage;
  const thumbPositionPercentage =
    ((offset - thumbClickPosition) * 100 * offsetRatio.value) /
    rootRef.value[bar.value.offset];

  scroll.value =
    (thumbPositionPercentage * props.containerSize[bar.value.scrollSize]) / 100;
};

const mouseUpDocumentHandler = () => {
  cursorDown.value = false;
  thumbState.value[bar.value.axis] = 0;
  document.removeEventListener("mousemove", mouseMoveDocumentHandler);
  document.removeEventListener("mouseup", mouseUpDocumentHandler);
  restoreOnselectstart();
  if (cursorLeave.value) isVisible.value = false;
};

onBeforeUnmount(() => {
  restoreOnselectstart();
  document.removeEventListener("mouseup", mouseUpDocumentHandler);
});

const restoreOnselectstart = () => {
  if (document.onselectstart !== originalOnSelectStart && originalOnSelectStart)
    document.addEventListener("selectstart", originalOnSelectStart);
};
</script>

<style lang="scss" scoped>
.custom-scrollbar-bar {
  --scrollbar-bar-thickness: var(--custom-scrollbar-bar-thickness, 20px);
  --scrollbar-bar-padding: var(--custom-scrollbar-bar-padding, 20px);
  --scrollbar-bar-border-color: var(
    --custom-scrollbar-bar-border-color,
    var(--app-color-primary-norm)
  );

  position: relative;
  inset: initial;
  z-index: 2;

  background-color: transparent;

  &--horizontal {
    height: var(--scrollbar-bar-thickness);
    padding-inline: var(--scrollbar-bar-padding);

    border-color: var(--scrollbar-bar-border-color);
  }

  &--vertical {
    width: var(--scrollbar-bar-thickness);
    padding-block: var(--scrollbar-bar-padding);
    border-left-width: 1px;

    border-color: var(--scrollbar-bar-border-color);
  }

  &__thumb {
    position: relative;

    display: block;

    width: 0;
    height: 0;

    background-color: var(--app-color-primary-norm);
    border-radius: 100px;

    transition: var(--el-transition-duration) background-color;

    cursor: pointer;
    user-select: none;

    &--horizontal {
      height: 10px;
    }

    &--vertical {
      width: 10px;
    }
  }
}
</style>
