<template>
  <VTooltip
    v-model:active="active"
    class="help-tooltip"
    :class="sizeClass"
    v-bind="$props"
  >
    <template #default>
      <div
        class="help-tooltip__icon-wrapper"
        :class="{
          'help-tooltip__icon-wrapper--active': active,
          'help-tooltip__icon-wrapper--errored': errored,
        }"
      >
        <VIcon
          class="help-tooltip__icon"
          :class="{ 'help-tooltip__icon--large': props.logoSize === 'lg' }"
          :icon-name="iconName"
        />
      </div>
    </template>
    <template #content>
      <slot name="content" />
    </template>
  </VTooltip>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { omit } from "lodash";

import { type IconsIds } from "@/generated/icons";
import { propsFactory } from "@utils";

import { type VTooltipProps, getVTooltipProps } from "@components/VTooltip";

export const getProps = propsFactory({
  ...omit(
    getVTooltipProps({
      offset: 12,
    }),
    ["anchorElement", "active", "styleContent"],
  ),
  errored: Boolean,
  size: {
    type: String as PropType<VTooltipProps["size"]>,
    default: "md",
  },
  logoSize: {
    type: String as PropType<"lg" | "st">,
    default: "st",
  },
  iconName: {
    type: String as PropType<IconsIds>,
    default: "alert-mark-small",
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { computed, ref } from "vue";

import VIcon from "@components/VIcon";
import VTooltip from "@components/VTooltip";

const props = defineProps(getProps());

const active = ref<boolean>(false);
const sizeClass = computed(
  () => (props.size && `help-tooltip--${props.size}`) || null,
);
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.help-tooltip {
  --icon-sign-color: var(--app-color-white);
  --icon-sign-hover-color: var(--app-color-white);
  --icon-sign-active-color: var(--app-color-primary-dark);
  --icon-background-color: var(--app-color-primary-norm);
  --icon-background-hover-color: var(--app-color-primary-dark);
  --icon-background-active-color: var(--app-color-white);
  --icon-border-width: 1px;
  --icon-border-color: var(--icon-background-color);
  --icon-border-hover-color: var(--icon-background-hover-color);
  --icon-border-active-color: var(--icon-sign-active-color);
  --icon-size: 18px;

  display: inline-flex;

  width: max-content;
  max-width: 100%;
  padding: 3px;

  &--sm {
    --icon-size: 12px;
    padding: 2px;
  }

  &__icon-wrapper {
    width: var(--icon-size);
    height: var(--icon-size);
    border: var(--icon-border-width) solid var(--icon-border-color);

    color: var(--icon-sign-color);

    background-color: var(--icon-background-color);
    overflow: hidden;
    border-radius: 50%;

    transition: all var(--app-transition-duration-1) ease;
    transition-property: background-color, color, border-color;

    cursor: pointer;

    &:hover {
      color: var(--icon-sign-hover-color);

      background-color: var(--icon-background-hover-color);
      border-color: var(--icon-border-hover-color);
    }

    &--errored {
      --icon-sign-active-color: var(--app-color-red-norm);
      --icon-background-color: var(--app-color-red-norm);
      --icon-background-hover-color: var(--app-color-red-dark);
      --icon-background-active-color: var(--app-color-red-stroke);
      --icon-border-color: var(--icon-background-color);
      --icon-border-hover-color: var(--icon-background-hover-color);
      --icon-border-active-color: var(--icon-sign-active-color);
    }

    &--active {
      --icon-background-hover-color: var(--icon-background-active-color);
      --icon-border-hover-color: var(--icon-border-hover-color);
      --icon-sign-hover-color: var(--icon-sign-active-color);

      color: var(--icon-sign-active-color);

      background-color: var(--icon-background-active-color);
      border-color: var(--icon-border-active-color);
    }
  }

  &__icon {
    width: 100%;
    height: 100%;
    scale: 1.2;

    color: currentcolor;

    &--large {
      scale: 1.8;
    }
  }
}
</style>
