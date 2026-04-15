<template>
  <div class="v-menu">
    <div ref="controlRef" class="v-menu__control">
      <slot name="control" :keydown-handler="controlKeydownHandler" />
    </div>
    <Teleport to="overlays">
      <Transition :duration="150" :name="showAnimation"
        ><div
          v-if="isShowDropdown"
          ref="dropdownRef"
          class="v-menu__dropdown"
          :style="{
            ...floatingStyles,
            '--animation-transform-origin-y': placementForTransformOrigin,
          }"
          tabindex="-1"
          @focusin="dropdownFocusinHandler"
          @keydown="dropdownKeydownHandler"
        >
          <div
            class="v-menu__dropdown-content-wrapper"
            :class="{
              'v-menu__dropdown-content-wrapper--column': hoverAppendArrow,
            }"
            :style="{
              '--animation-transform-origin-y': placementForTransformOrigin,
            }"
          >
            <div
              class="v-menu__dropdown-content"
              :style="{
                '--animation-transform-origin-y': placementForTransformOrigin,
                maxWidth: availableViewportWidth,
              }"
            >
              <slot name="dropdown" :field-width="fieldWidth" />
            </div>
          </div></div
      ></Transition>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { type OffsetOptions, type Placement } from "@floating-ui/vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({
  animationName: {
    type: String as PropType<"fade" | "scale">,
    default: "scale",
  },
  placement: {
    type: String as PropType<Placement>,
    default: "bottom-end",
  },
  anchorElement: HTMLElement as PropType<HTMLElement | null>,
  disabled: Boolean,
  dropdownOffset: {
    type: [Number, Object] as PropType<OffsetOptions>,
    default: 5,
  },
  hoverAppendArrow: {
    type: Boolean,
    default: false,
  },
  isShowDropdown: Boolean,
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;

export type Emits = {
  "close-without-focus": [];
  "focusin:dropdown": [FocusEvent];
  "update:is-show-dropdown": [boolean];
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/vue";
import { onClickOutside, useVModel } from "@vueuse/core";

import { helpers } from "@utils";

const props = defineProps(getProps());
const emit = defineEmits<Emits>();

const proxiedIsShowDropdown = useVModel(props, "isShowDropdown", emit, {
  eventName: "update:is-show-dropdown",
});

const showAnimation = computed(() => props.animationName || undefined);
const anchorElementRef = computed(
  () => props.anchorElement || controlRef.value,
);
const controlRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

const fieldWidth = ref<string>();
const availableViewportWidth = ref<string>();
const availableViewportHeight = ref<string>();

const { floatingStyles, middlewareData, placement } = useFloating(
  anchorElementRef,
  dropdownRef,
  {
    placement: props.placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(
        props.hoverAppendArrow
          ? (props.dropdownOffset as number) - 17
          : props.dropdownOffset,
      ),
      flip(),
      size({
        apply({ rects, availableWidth, availableHeight }) {
          fieldWidth.value = `${rects.reference.width}px`;
          availableViewportWidth.value = `${availableWidth}px`;
          availableViewportHeight.value = `${availableHeight}px`;
        },
      }),
      shift(), // Возможно, стоит убрать
    ],
    open: proxiedIsShowDropdown,
  },
);

watch(
  () => middlewareData.value.hide,
  (newValue) => {
    if (newValue?.referenceHidden && proxiedIsShowDropdown.value) {
      proxiedIsShowDropdown.value = false;
    }
  },
);

onClickOutside(
  anchorElementRef,
  (event) => {
    if (!event.composedPath().includes(dropdownRef.value as HTMLElement)) {
      proxiedIsShowDropdown.value = false;

      emit("close-without-focus");
    }
  },
  {
    ignore: [dropdownRef],
  },
);

const placementForTransformOrigin = computed<string>(() => {
  const direction = placement.value.split("-")?.[0];

  switch (direction) {
    case "top": {
      return "bottom";
    }
    case "bottom": {
      return "top";
    }
    default: {
      return "top";
    }
  }
});

const controlKeydownHandler = (event: KeyboardEvent) => {
  if (dropdownRef.value && proxiedIsShowDropdown.value) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      helpers.focusChild(dropdownRef.value, "next");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      helpers.focusChild(dropdownRef.value, "prev");
    }
  } else if (["ArrowDown", "ArrowUp"].includes(event.key)) {
    proxiedIsShowDropdown.value = true;
    event.preventDefault();
    setTimeout(() => setTimeout(() => controlKeydownHandler(event)));
  }
};

const dropdownKeydownHandler = (event: KeyboardEvent) => {
  if (props.disabled) return;

  const dropdownElement = dropdownRef.value;
  if (!dropdownElement) return;

  if (event.key === "Tab") {
    const focusableChildren = helpers.focusableChildren(dropdownElement, false);
    const nextElement = helpers.getNextElement(
      focusableChildren,
      event.shiftKey ? "prev" : "next",
      (el: HTMLElement) => el.tabIndex >= 0,
    );

    if (!nextElement) {
      proxiedIsShowDropdown.value = false;

      if (
        anchorElementRef.value &&
        "focusInputField" in anchorElementRef.value &&
        typeof anchorElementRef.value.focusInputField === "function"
      ) {
        anchorElementRef.value.focusInputField();
      }
    }
  }
};

const dropdownFocusinHandler = (event: FocusEvent) => {
  emit("focusin:dropdown", event);
};
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;
@use "@style/variables" as vars;

.fade {
  &-enter-active,
  &-leave-active {
    transition-property: opacity;
    transition-duration: var(--app-transition-duration-1);
    transition-timing-function: var(--app-transition-timing-function);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

.scale {
  &-enter-active,
  &-leave-active {
    /* stylelint-disable-next-line selector-max-compound-selectors */
    .animation-inner {
      transition-property: opacity, scale, grid-template-rows;
      transition-duration: var(--app-transition-duration-1);
      transition-timing-function: var(--app-transition-timing-function);
      transform-origin: center var(--animation-transform-origin-y, top);
    }

    /* stylelint-disable-next-line selector-max-compound-selectors */
    .animation-inner-inner {
      transition:
        opacity var(--app-transition-duration-1)
          var(--app-transition-timing-function) 0.1s,
        scale var(--app-transition-duration-1)
          var(--app-transition-timing-function) 0.1s,
        grid-template-rows var(--app-transition-duration-1)
          var(--app-transition-timing-function) 0.1s;
      transform-origin: left var(--animation-transform-origin-y, top);
    }
  }

  &-enter-from,
  &-leave-to {
    /* stylelint-disable-next-line selector-max-compound-selectors */
    .animation-inner {
      scale: 1 0;

      opacity: 0;
    }

    /* stylelint-disable-next-line selector-max-compound-selectors */
    .animation-inner-inner {
      opacity: 0;
      scale: 1 0.95;
    }
  }
}

.v-menu {
  &__control {
    height: 100%;
  }

  &__dropdown {
    z-index: vars.$z-index-tooltip;
  }

  &__dropdown-content-wrapper {
    border-width: 1px;

    color: var(--app-color-gray-blue);

    background-color: var(--app-color-white);
    overflow: hidden;
    border-color: var(--app-color-gray-stroke);
    border-radius: 16px;
    box-shadow: var(--app-shadow-soft);

    @include mixins.body-2;

    &--column {
      border-radius: 8px;
    }
  }

  &__dropdown-content {
    overflow: auto;
  }
}
</style>
