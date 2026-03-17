<template>
  <LinkButton
    class="v-button"
    :class="rootDynamicClasses"
    :button-type="buttonType"
    :mode="mode"
  >
    <span class="v-button__content">
      <VIcon
        v-if="iconName && !isLoading"
        class="v-button__icon"
        :class="iconDynamicClasses"
        :icon-name="iconName"
      />
      <slot v-if="!isLoading" />
      <EasyLoader v-if="isLoading" class="v-button__loader" />
    </span>
  </LinkButton>
</template>

<script setup lang="ts">
import { type PropType, computed } from "vue";

import { type ButtonTypes, type LinkButtonModes } from "@components/LinkButton";
import LinkButton from "@components/LinkButton/LinkButton.vue";
import VIcon from "@components/VIcon";
import { type VIconIconsNames } from "@components/VIcon";
import EasyLoader from "@components/loaders/EasyLoader/EasyLoader.vue";

export type SizeButton = "large" | "middle" | "small";
export type VariationButton = "accent" | "primary";
export type IconPositions = "left" | "right";

const props = defineProps({
  buttonType: {
    type: String as PropType<ButtonTypes>,
    default: "button",
  },
  mode: {
    type: String as PropType<LinkButtonModes>,
    default: "button",
  },
  size: {
    type: String as PropType<SizeButton>,
    default: "large",
  },
  variation: {
    type: String as PropType<VariationButton>,
    default: "primary",
  },
  iconName: {
    type: String as PropType<VIconIconsNames>,
  },
  iconPosition: {
    type: String as PropType<IconPositions>,
    default: "left",
  },
  isLoading: {
    type: Boolean,
  },
  disabled: Boolean,
});

const rootDynamicClasses = computed(() => {
  return [
    props.disabled && "v-button--disabled",
    props.variation && `v-button--${props.variation}`,
    props.size && `v-button--${props.size}`,
  ].filter(Boolean);
});

const iconDynamicClasses = computed(() => {
  return [
    props.variation && `v-button__icon--${props.variation}`,
    props.iconPosition && `v-button__icon--${props.iconPosition}`,
  ].filter(Boolean);
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-button {
  --icon-width: 16px;
  --icon-height: 16px;
  --current-color: var(--icon-color, var(--app-color-gray-light));

  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;

  color: var(--current-color);

  overflow: hidden;
  border-radius: 6px;

  transition-property: all;
  transition-duration: 0.1s;

  cursor: pointer;

  @include mixins.button;

  // * Размеры *
  &--large {
    min-width: 200px;
    padding: 12px 32px;
  }

  &--small {
    min-width: 110px;
    padding: 5px 10px;
  }

  &--middle {
    min-width: 120px;
    padding: 10px;
  }

  // * Варианты *
  &--primary {
    --ripple-color: var(--app-color-primary-light);
    --icon-color: var(--app-color-white);

    background-color: var(--app-color-primary-norm);

    &:hover {
      background-color: var(--app-color-primary-dark);
    }

    &:active {
      --icon-color: var(--app-color-black);
    }
  }

  &--primary:is(&--disabled) {
    --icon-color: var(--app-color-gray-dark);

    background-color: var(--app-color-gray-light);
  }

  &--accent {
    --ripple-color: var(--app-color-red-light);
    --icon-color: var(--app-color-white);

    background-color: var(--app-color-red-norm);

    &:hover {
      background-color: var(--app-color-red-dark);
    }

    &:active {
      --icon-color: var(--app-color-black);
    }
  }

  &--accent:is(&--disabled) {
    --icon-color: var(--app-color-gray-dark);

    background-color: var(--app-color-gray-light);
  }

  // * Общие стили субсостояний *
  &--disabled {
    cursor: not-allowed;
  }

  // * Элементы *
  &__content {
    position: relative;
    z-index: 2;

    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
  }

  &__loader {
    width: var(--easy-loader-width, 16px);
    height: var(--easy-loader-height, 16px);
  }

  &__icon {
    width: var(--icon-width);
    min-width: var(--icon-width);
    height: var(--icon-height);

    &--right {
      order: 1;
    }
  }
}
</style>
