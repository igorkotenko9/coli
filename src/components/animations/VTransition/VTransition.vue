<template>
  <component
    :is="currentRoot"
    v-bind="attributes.props"
    v-on="attributes.listeners"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { type PropType, useAttrs } from "vue";

import { isHTMLElement } from "@utils";

export type AnimationName = "dropdown" | "fade" | "list" | "slide";
export type Mode = "in-out" | "out-in";
export type Tags = "div" | "ul";

const props = defineProps({
  isGroup: {
    type: Boolean,
    default: false,
  },
  animationName: {
    type: String as PropType<AnimationName>,
    default: "fade",
  },
  mode: {
    type: String as PropType<Mode>,
    default: null,
  },
  tag: {
    type: String as PropType<Tags>,
  },
});

defineOptions({ inheritAttrs: false });

// TODO: добавить пропсы обычных компонентов Transition
import {
  Transition,
  TransitionGroup,
  type TransitionGroupProps,
  type TransitionProps,
  computed,
} from "vue";

const attrs = useAttrs();

const currentRoot = computed(() =>
  props.isGroup ? TransitionGroup : Transition,
);

const fixElementPosition = (el: Element | HTMLElement) => {
  if (!el || !isHTMLElement(el)) return;

  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);

  const offsetLeft = `${el.offsetLeft - Number.parseFloat(marginLeft)}px`;
  const offsetTop = `${el.offsetTop - Number.parseFloat(marginTop)}px`;

  Object.assign(el.style, {
    left: offsetLeft,
    top: offsetTop,
    width,
    height,
    position: "absolute",
  });
};

const attributes = computed<{
  listeners: Record<string, (...args: any[]) => void>;
  props: TransitionGroupProps | TransitionProps;
}>(() => {
  const baseProps = {
    class: [attrs.class],
    name: `${props.animationName}-`,
  };

  if (props.isGroup) {
    const baseGroupListeners = {
      beforeLeave: fixElementPosition,
    };

    const baseGroupProps = {
      ...baseProps,
      class: [...baseProps.class, props.animationName],
      tag: props.tag || (attrs.class && "div"),
    };

    return {
      props: baseGroupProps,
      listeners: baseGroupListeners,
    };
  } else {
    const baseListeners = {
      beforeLeave: fixElementPosition,
    };

    return {
      props: {
        ...baseProps,
        mode: props.mode,
      },
      listeners: baseListeners,
    };
  }
});
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
// important нужны, чтобы стили анимации точно применились без влияния каскада
// stylelint-disable declaration-no-important
// *** dropdown ***
.dropdown {
  &--enter-enter-from,
  &--leave-leave-to {
    opacity: 0 !important;

    transform: scaleY(0.7) !important;
  }

  &--enter-leave-active,
  &--leave-enter-active {
    transition-property: all !important;
    transition-duration: 0.2s !important;
    transition-timing-function: ease-out !important;
    transform-origin: top center !important;
  }

  &--enter-leave-to,
  &--leave-enter-from {
    opacity: 1 !important;

    transform: scaleY(1) !important;
  }
}

// *** fade ***
.fade {
  &--enter-active,
  &--leave-active {
    transition-property: opacity !important;
    transition-duration: var(--app-transition-duration-1) !important;
    transition-timing-function: var(
      --app-transition-timing-function
    ) !important;
  }

  &--enter-from,
  &--leave-to {
    position: absolute !important;
    right: 0 !important;
    left: 0 !important;

    opacity: 0 !important;
  }
}

// *** list ***
.list {
  &--move,
  &--enter-active,
  &--leave-active {
    transition-property: all !important;
    transition-duration: 0.5s !important;
    transition-timing-function: ease !important;
  }

  &--enter-from,
  &--leave-to {
    opacity: 0 !important;

    transform: translateX(30px) !important;
  }

  &--leave-active {
    position: absolute !important;
  }
}

// *** slide ***
.slide {
  position: relative;

  overflow: hidden !important;

  &--move,
  &--enter-active,
  &--leave-active {
    transition: all var(--app-transition-duration-1)
      var(--app-transition-timing-function) !important;
    transition-property: opacity, transform !important;
  }

  &--enter-from,
  &--leave-to {
    opacity: 0 !important;
  }

  &--leave-active {
    position: absolute !important;
    z-index: -1;
  }
}
</style>
