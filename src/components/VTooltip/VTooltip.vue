<template>
  <div class="v-tooltip">
    <div
      ref="controlRef"
      class="v-tooltip__control"
      @click="controlClickHandler"
      @pointerenter="controlPointerEnterHandler"
      @pointerleave="controlPointerLeaveHandler"
    >
      <slot :is-active="active" :is-pressed="!isCloseOnLeave" />
    </div>

    <Teleport v-if="isContenttSlotFilled" to="#overlays">
      <Transition name="v-tooltip__content-">
        <div
          v-if="active && isDefaultSlotFilled"
          ref="tooltipContentRef"
          class="v-tooltip__content"
          :class="sizeClass"
          :style="{ ...floatingStyles, ...styleContent }"
          tabindex="-1"
        >
          <slot name="content" />
          <VIcon
            v-if="trigger !== 'hover'"
            class="v-tooltip__close"
            icon-name="cancel"
            @click="closeButtonClickHandler"
          />
          <div ref="arrowRef" class="v-tooltip__arrow" :style="arrowStyle" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { type Placement } from "@floating-ui/vue";

import { propsFactory } from "@utils";

type Triggers = "click" | "hover";

export const getProps = propsFactory({
  readonly: Boolean,
  anchorElement: HTMLElement as PropType<HTMLElement | null>,
  active: Boolean,
  offset: {
    type: Number,
    default: 8,
  },
  disabled: Boolean,
  placement: {
    type: String as PropType<Placement>,
    default: "top",
  },
  size: String as PropType<"lg" | "md" | "sm">,
  trigger: {
    type: [String, Array] as PropType<Triggers | Triggers[]>,
    default: "click",
  },
  styleContent: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
export type Emits = {
  "close-without-focus": [];
  "update:active": [boolean];
};
</script>

<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue";

import {
  arrow,
  autoUpdate,
  flip,
  hide,
  offset,
  shift,
  useFloating,
} from "@floating-ui/vue";
import { onClickOutside, useVModel } from "@vueuse/core";

import { useFloatingArrow } from "@hooks/useFloatingArrow";
import { useSlotFullness } from "@hooks/useSlotFullness";

import VIcon from "@components/VIcon";

const props = defineProps(getProps());
const emit = defineEmits<Emits>();

const anchorElementRef = toRef(props, "anchorElement");
const controlRef = ref<HTMLElement | null>(null);
const anchor = computed(() => anchorElementRef.value || controlRef.value);

const tooltipContentRef = ref<HTMLElement | null>(null);
const arrowRef = ref<HTMLElement>();

const proxiedActive = useVModel(props, "active", emit, {
  eventName: "update:active",
});

const isDefaultSlotFilled = useSlotFullness("default");
const isContenttSlotFilled = useSlotFullness("content");

const { placement, floatingStyles, middlewareData } = useFloating(
  anchor,
  tooltipContentRef,
  {
    placement: props.placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(props.offset),
      flip(),
      shift(),
      arrow({ element: arrowRef, padding: 26 }),
      hide((state) => ({
        padding: state.rects.reference.width * 0.1,
      })),
    ],
    open: proxiedActive,
  },
);

const { arrowStyle } = useFloatingArrow(arrowRef, placement, middlewareData);

watch(
  () => middlewareData.value.hide,
  (newValue) => {
    if (newValue?.referenceHidden && proxiedActive.value) {
      proxiedActive.value = false;
      isCloseOnLeave.value = true;
    }
  },
);

const isCloseOnLeave = ref<boolean>(true);

onClickOutside(
  anchor,
  (event) => {
    if (
      !event.composedPath().includes(tooltipContentRef.value as HTMLElement)
    ) {
      proxiedActive.value = false;

      isCloseOnLeave.value = true;
    }
  },
  {
    ignore: [tooltipContentRef],
  },
);

const checkTrigger = (trigger: Triggers) => {
  return (
    props.trigger === trigger ||
    (Array.isArray(props.trigger) && props.trigger.includes(trigger))
  );
};

const closeButtonClickHandler = () => {
  if (props.disabled) return;

  isCloseOnLeave.value = true;
  proxiedActive.value = false;
};

const controlClickHandler = () => {
  if (props.disabled || !isContenttSlotFilled.value) return;

  if (checkTrigger("click")) {
    isCloseOnLeave.value = !isCloseOnLeave.value;
    proxiedActive.value = checkTrigger("hover")
      ? !isCloseOnLeave.value
      : !proxiedActive.value;
  }
};

const controlPointerEnterHandler = () => {
  if (props.disabled) return;

  if (checkTrigger("hover")) {
    proxiedActive.value = true;
  }
};

const controlPointerLeaveHandler = () => {
  if (props.disabled) return;

  if (checkTrigger("hover") && isCloseOnLeave.value) {
    proxiedActive.value = false;
  }
};

const sizeClass = computed(
  () => (props.size && `v-tooltip__content--${props.size}`) || null,
);
</script>

<style scoped lang="scss">
@use "@style/variables" as vars;
@use "@style/mixins" as mixins;

.v-tooltip {
  &__control {
    height: 100%;
  }

  &__content {
    --icon-close-size: 24px;

    position: relative;
    z-index: vars.$z-index-tooltip;

    display: flex;
    gap: 10px;
    align-items: center;

    max-width: 300px;
    padding: 10px;

    color: var(--app-color-secondary-text);
    text-wrap: pretty;
    overflow-wrap: anywhere;

    background-color: var(--app-color-white);
    isolation: isolate;
    border-radius: 8px;
    box-shadow: var(--app-shadow-soft);

    @include mixins.caption-1;

    &--sm {
      --icon-close-size: 20px;
    }

    &--enter-from,
    &--leave-to {
      opacity: 0;
    }

    &--enter-active,
    &--leave-active {
      transition: opacity var(--app-transition-duration-1)
        var(--app-transition-timing-function);
    }
  }

  &__arrow {
    position: absolute;
    z-index: -1;

    width: 16px;
    height: 16px;

    background-color: inherit;

    rotate: 45deg;
  }

  &__close {
    flex-shrink: 0;
    align-self: flex-start;

    width: var(--icon-close-size);
    height: var(--icon-close-size);
    padding: 2px;

    color: var(--app-color-primary-norm);

    &:hover {
      color: var(--app-color-primary-dark);
    }

    &:active {
      color: var(--app-color-primary-light);
    }

    cursor: pointer;
  }
}
</style>
