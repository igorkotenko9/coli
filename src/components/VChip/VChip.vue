<template>
  <div class="v-chip" :inert="inert || isLoading">
    <div class="v-chip__content" :class="chipsClasses">
      <SimpleLoader v-if="isLoading" class="v-chip__loading" />
      <VIcon v-else-if="invalidate" class="v-chip__icon" icon-name="alert" />
      <div v-else-if="!isLoading && $slots.start" class="v-chip__icons-block">
        <slot name="start" />
      </div>

      <span class="v-chip__text">
        {{ text }}
      </span>
      <div v-if="$slots.end" class="v-chip__icons-block">
        <slot name="end" />
      </div>
    </div>
    <div v-if="props.invalidate" class="v-chip__error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

export type VariationChip = "action" | "filter" | "input" | "label";

export const getProps = propsFactory({
  variation: {
    type: String as PropType<VariationChip>,
    required: true as const,
  },
  mainIconName: {
    type: String as PropType<VIconIconsNames>,
  },
  text: {
    type: String,
    required: true as const,
  },
  inert: {
    type: Boolean,
  },
  isLoading: {
    type: Boolean,
  },
  invalidate: {
    type: Boolean,
  },
  error: {
    type: String,
  },
  interactive: {
    type: Boolean,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { type PropType, computed } from "vue";

import VIcon from "@components/VIcon";
import { type VIconIconsNames } from "@components/VIcon";
import SimpleLoader from "@components/loaders/SimpleLoader";

const props = defineProps({
  ...getProps(),
});

const chipsClasses = computed(() =>
  [
    props.variation && `v-chip--${props.variation}`,
    props.inert && "v-chip--disabled",
    props.interactive && "v-chip--interactive",
    props.invalidate && "v-chip--invalidate",
  ].filter(Boolean),
);
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-chip {
  --icon-color: var(--app-color-secondary-dark);
  --text-color: var(--app-color-gray-blue);

  display: flex;
  flex-direction: column;
  gap: 5px;

  min-height: 34px;

  background-color: transparent;

  cursor: pointer;

  &__content {
    display: flex;
    align-items: center;

    max-height: 100%;
    padding: 5px;

    background-color: var(--app-color-background);
    border-radius: 40px;
  }

  &__loading {
    width: 24px;
    height: 24px;

    color: var(--app-color-primary-norm);
  }

  &__text {
    display: -webkit-box;
    -webkit-line-clamp: var(--v-chip-text-line-clamp, unset);
    -webkit-box-orient: vertical;

    flex-grow: 1;

    max-width: 100%;
    max-height: 100%;
    padding-block: 2px;
    padding-inline: 8px;

    color: var(--text-color);

    overflow: hidden;
  }

  &__icon {
    flex-shrink: 0;

    width: 24px;
    height: 24px;

    color: var(--icon-color);
  }

  &__icons-block {
    display: flex;
    flex-shrink: 0;

    color: var(--icon-color);
  }

  &--filter {
    @include mixins.subtitle-1;

    --text-color: var(--app-color-secondary-dark);

    &:hover {
      background-color: var(--app-color-secondary-light);
    }
  }

  &--filter:is(&--interactive) {
    &:active {
      --icon-color: var(--app-color-white);
      --text-color: var(--app-color-white);

      background-color: var(--app-color-secondary-dark);
    }
  }

  &--label {
    @include mixins.subtitle-1;

    --text-color: var(--app-color-secondary-dark);

    background-color: var(--app-color-green-light);

    &:hover {
      background-color: var(--app-color-yellow-light);
    }
  }

  &--label:is(&--interactive) {
    &:active {
      --text-color: var(--app-color-white);

      background-color: var(--app-color-secondary-dark);
    }
  }

  &--input,
  &--action {
    --icon-color: var(--app-color-secondary-dark);
    --text-color: var(--app-color-gray-blue);

    @include mixins.body-2;

    &:hover {
      background-color: var(--app-color-secondary-light);
    }
  }

  &--input:is(&--interactive),
  &--action:is(&--interactive) {
    &:active {
      --icon-color: var(--app-color-white);
      --text-color: var(--app-color-white);

      background-color: var(--app-color-secondary-dark);
    }
  }

  &__error {
    @include mixins.caption-1;

    --text-color: var(--app-color-red-dark);
  }

  &--disabled {
    --icon-color: var(--app-color-gray-norm);
    --text-color: var(--app-color-gray-blue);
  }

  &--invalidate {
    --icon-color: var(--app-color-red-norm);
    --text-color: var(--app-color-red-norm);

    background-color: var(--app-color-red-pale);
    box-shadow: 0 0 0 1px var(--app-color-red-norm);

    &:hover {
      background-color: var(--app-color-red-pale);
    }

    &:active {
      --icon-color: var(--app-color-red-norm);
      --text-color: var(--app-color-red-norm);
    }
  }
}
</style>
