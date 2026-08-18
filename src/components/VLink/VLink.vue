<template>
  <LinkButton
    class="v-link"
    :class="[linkStyle, linkActivity]"
    :inert="inert"
    :mode="mode"
    :target="target"
    :to="to"
  >
    <span class="v-link__content">
      <VIcon v-if="iconName" class="v-link__icon" :icon-name="iconName" />
      <slot />
    </span>
  </LinkButton>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

export type Variation = "default" | "tablet" | "task" | "text" | "uppercase";

export const getVLinkProps = propsFactory({
  to: { type: String, required: false },
  mode: {
    type: String as PropType<ExtendedMode>,
    required: false,
    default: "link",
  },
  target: { type: String as PropType<LinkTargets> },
  variation: {
    type: String as PropType<Variation>,
    default: "default",
  },
  inert: { type: Boolean },
  iconName: { type: String as PropType<VIconIconsNames> },
});

export type Props = ExtractPropTypes<ReturnType<typeof getVLinkProps>>;
</script>

<script setup lang="ts">
import { computed } from "vue";

import LinkButton from "@components/LinkButton";
import {
  type ExtendedMode,
  type LinkTargets,
} from "@components/LinkButton/LinkButton.vue";
import VIcon from "@components/VIcon";
import { type VIconIconsNames } from "@components/VIcon";

const props = defineProps({
  ...getVLinkProps(),
});

const linkStyle = computed(() => {
  return `v-link--${props.variation}`;
});

const linkActivity = computed(() => {
  if (props.inert) {
    return `v-link--disabled`;
  }
  return "";
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-link {
  --content-gap: var(--v-link-content-gap, 10px);
  --icon-width: var(--v-link-icon-width, 16px);
  --icon-height: var(--v-link-icon-height, 16px);

  text-overflow: ellipsis;

  // Тут и ниже отключил линтеры, что бы исключить варианты стилизации для div и span
  /* stylelint-disable-next-line selector-max-type */
  &:not(span, div) {
    cursor: pointer;
  }

  &--default {
    @include mixins.body-1;
    color: var(--app-color-secondary-dark);
    text-decoration-line: underline;

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):hover {
      color: var(--app-color-primary-norm);
    }

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):active {
      color: var(--app-color-secondary-text);
    }
  }

  &--uppercase {
    @include mixins.caption-1;
    color: var(--app-color-secondary-norm);
    text-transform: uppercase;

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):hover {
      color: var(--app-color-primary-norm);
    }

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):active {
      color: var(--app-color-secondary-text);
    }
  }

  &--text {
    @include mixins.body-2;
    color: var(--app-color-secondary-dark);

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):hover {
      color: var(--app-color-primary-norm);
      text-decoration-line: underline;
    }

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):active {
      color: var(--app-color-secondary-text);
    }
  }

  &--tablet {
    @include mixins.caption-1;
    color: var(--app-color-primary-dark);

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):active {
      color: var(--app-color-secondary-dark);
      text-decoration-line: underline;
    }

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):hover {
      text-decoration-line: underline;
    }
  }

  &--task {
    @include mixins.body-1;
    color: var(--app-color-gray-black);

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):hover {
      color: var(--app-color-primary-norm);
      text-decoration-line: underline;
    }

    /* stylelint-disable-next-line selector-max-type */
    &:not(span, div):active {
      color: var(--app-color-secondary-text);
      text-decoration-line: underline;
    }
  }

  &--disabled {
    color: var(--app-color-gray-light);

    pointer-events: none;
    cursor: not-allowed;
  }

  &__content {
    display: flex;
    gap: var(--content-gap);
    align-items: center;
  }

  &__icon {
    flex-shrink: 0;

    width: var(--icon-width);
    height: var(--icon-height);
  }
}
</style>
