<template>
  <LinkButton
    class="icon-button"
    :class="[buttonVariationClass, { 'icon-button--active': isActive }]"
    :button-type="props.buttonType"
    :download="download"
    :mode="mode"
  >
    <VIcon
      class="icon-button__icon"
      :class="[iconVariationClass]"
      :icon-name="props.iconName"
    />
    <slot name="dropdown" />
  </LinkButton>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

import { type ButtonTypes, type LinkButtonModes } from "@components/LinkButton";
import { type VIconIconsNames } from "@components/VIcon";
export type VariationButton = "circle" | "primary" | "simplified";

export const getIconButtonProps = propsFactory({
  mode: {
    type: String as PropType<LinkButtonModes>,
    required: false,
    default: "button",
  },
  variation: {
    type: String as PropType<VariationButton>,
    required: false,
    default: "primary",
  },
  buttonType: {
    type: String as PropType<ButtonTypes>,
    required: false,
    default: "button",
  },
  iconName: {
    type: String as PropType<VIconIconsNames>,
    required: true,
    default: "close",
  },
  isActive: {
    type: Boolean,
  },
  download: {
    type: Boolean,
    default: false,
  },
});

export type Props = ExtractPropTypes<ReturnType<typeof getIconButtonProps>>;
</script>

<script setup lang="ts">
import { computed } from "vue";

import LinkButton from "@components/LinkButton";
import VIcon from "@components/VIcon";

const props = defineProps({
  ...getIconButtonProps(),
});

const buttonVariationClass = computed(() => `icon-button--${props.variation}`);

const iconVariationClass = computed(
  () => `icon-button__icon--${props.variation}`,
);
</script>

<style scoped lang="scss">
.icon-button {
  --icon-size: var(--icon-button-icon-size, 24px);

  display: flex;

  border-radius: 4px;

  &__icon {
    display: var(--icon-display);

    width: var(--icon-size);
    height: var(--icon-size);

    color: var(--icon-color, var(--app-color-gray-light));
  }

  &--primary {
    --icon-color: var(--app-color-secondary-dark);

    &:hover {
      --icon-color: var(--app-color-secondary-text);

      background-color: var(--app-color-gray-pale);
    }

    &:active {
      --icon-color: var(--app-color-primary-dark);

      background-color: var(--app-color-secondary-light);
    }

    &:disabled {
      --icon-color: var(--app-color-gray-light);
    }
  }

  &--simplified {
    --icon-color: var(--app-color-gray-norm);
  }

  &--active {
    --icon-color: var(--app-color-primary-dark);

    background-color: var(--app-color-secondary-light);
  }

  &--circle {
    border-radius: 50%;

    &:hover {
      --icon-color: var(--app-color-secondary-text);

      background-color: var(--app-color-gray-pale);
    }

    &:active {
      --icon-color: var(--app-color-primary-dark);

      background-color: var(--app-color-secondary-light);
    }

    &:disabled {
      --icon-color: var(--app-color-gray-light);
    }
  }
}
</style>
