<template>
  <div
    ref="fieldRef"
    class="v-field"
    :class="{
      'v-field--active': isActive,
      'v-field--disabled': isDisabled,
      'v-field--loading': isLoading,
      'v-field--focused': isFocused,
      'v-field--appended': isAppendInner,
      'v-field--prepended': isPrependInner,
      'v-field--errored': error,
      'v-field--row': hoverAppendArrow,
    }"
  >
    <div class="v-field__content">
      <div
        v-if="isPrependInner"
        key="prepend"
        class="v-field__prepend-inner"
        :class="{ 'v-field__content--row': hoverAppendArrow }"
      >
        <VIcon
          v-if="prependInnerIcon"
          key="prepend-inner-icon"
          class="v-field__icon"
          :icon-name="prependInnerIcon"
        />
        <slot name="prepend-inner" v-bind="slotsProps" />
      </div>
      <slot v-bind="defaultSlotProps" />
      <div v-if="isAppendInner" key="append" class="v-field__append-inner">
        <Transition name="v-field__clearable-">
          <div v-show="isShowClearButton" class="v-field__clearable">
            <button
              class="v-field__clear-button"
              type="button"
              @click.prevent.stop="emit('click:clear')"
            >
              <VIcon
                class="v-field__icon v-field__icon--clear"
                :class="{
                  'v-field__icon--red': error,
                }"
                icon-name="cancel"
              />
            </button>
          </div>
        </Transition>
        <VIcon
          v-if="appendInnerIcon && !isLoading && !hoverAppendArrow"
          key="append-inner-icon"
          class="v-field__icon"
          :icon-name="appendInnerIcon"
        />
        <SimpleLoader
          v-if="isLoading"
          class="v-field__icon v-field__icon--loader"
          variation="two-lined-round"
        />
        <slot v-else name="append-inner" v-bind="slotsProps" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { type ExtractPublicPropTypes, type PropType } from "vue";

import { pick } from "lodash";

import { propsFactory } from "@utils";

import VIcon, { type VIconIconsNames } from "@components/VIcon";
import SimpleLoader from "@components/loaders/SimpleLoader/SimpleLoader.vue";

export type SlotsProps = {
  isHovered: boolean;
};

export type DefaultSlotProps = SlotsProps & {
  fieldClasses: string[];
};

export type Emits = {
  "click:clear": [];
  "update:focused": [boolean];
};

export const getProps = propsFactory(
  {
    active: Boolean,
    required: Boolean,
    disabled: Boolean,
    loading: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
    dirty: Boolean,
    error: Boolean,
    readonly: Boolean,
    focused: {
      type: Boolean,
      default: null,
    },
    prependInnerIcon: String as PropType<VIconIconsNames>,
    appendInnerIcon: String as PropType<VIconIconsNames>,
    hoverAppendArrow: {
      type: Boolean,
      default: false,
    },
  },
  "VField",
);

export function filterProps(attrs: Record<string, unknown>) {
  const keys = Object.keys(getProps());
  return computed(() => {
    return pick(attrs, keys);
  });
}

export type Props = ExtractPublicPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { computed, ref } from "vue";

import { useElementHover, useVModel } from "@vueuse/core";

import { useSlotFullness } from "@hooks/useSlotFullness";

const props = defineProps(getProps());
const emit = defineEmits<Emits>();

const fieldRef = ref<HTMLInputElement | null>(null);
const isElementHovered = useElementHover(fieldRef);
const isActive = computed<boolean>(() => props.active);
const isDisabled = computed<boolean>(() => props.disabled);
const isHovered = computed<boolean>(
  () => isElementHovered.value && !props.disabled,
);
const isFocused = useVModel(props, "focused", emit, {
  eventName: "update:focused",
});

const hasPrependInnerSlotContent = useSlotFullness("prepend-inner");
const hasAppendInnerSlotContent = useSlotFullness("append-inner");

const isLoading = computed<boolean>(() => props.loading);

const isShowClearButton = computed<boolean>(
  () => props.dirty && props.clearable && !isDisabled.value,
);

const isPrependInner = computed<boolean>(
  () => hasPrependInnerSlotContent.value || Boolean(props.prependInnerIcon),
);
const isAppendInner = computed<boolean>(
  () =>
    hasAppendInnerSlotContent.value ||
    props.clearable ||
    Boolean(props.appendInnerIcon),
);

const fieldInSlotClass = ref<string>("v-field__input");

const slotsProps = computed<SlotsProps>(() => {
  return {
    isHovered: isHovered.value,
  };
});

const defaultSlotProps = computed<DefaultSlotProps>(() => {
  const classes = [fieldInSlotClass.value];

  if (isDisabled.value) {
    classes.push(`${fieldInSlotClass.value}--text-gray`);
  }

  if (props.hoverAppendArrow === true) {
    classes.push(`${fieldInSlotClass.value}--column`);
  }

  return {
    ...slotsProps.value,
    fieldClasses: classes,
  };
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-field {
  // border
  --field-border-width: var(--v-field-border-width, 1px);
  --field-border-color: var(
    --v-field-border-color,
    var(--app-color-gray-stroke)
  );
  --field-hover-border-color: var(
    --v-field-hover-border-color,
    var(--app-color-secondary-norm)
  );
  --field-active-border-color: var(
    --v-field-active-border-color,
    var(--app-color-primary-norm)
  );

  // border radius
  --field-border-radius: var(--v-field-border-radius, 8px);

  // padding
  --field-padding-top: var(--v-field-padding-top, 8px);
  --field-padding-bottom: var(--v-field-padding-bottom, 8px);
  --field-padding-left: var(--v-field-padding-left, 10px);
  --field-padding-right: var(--v-field-padding-right, 10px);
  --field-padding-top-border: calc(
    var(--field-padding-top) - var(--field-border-width)
  );
  --field-padding-bottom-border: calc(
    var(--field-padding-bottom) - var(--field-border-width)
  );
  --field-padding-left-border: calc(
    var(--field-padding-left) - var(--field-border-width)
  );
  --field-padding-right-border: calc(
    var(--field-padding-right) - var(--field-border-width)
  );

  // input padding
  --input-padding-bottom: var(
    --v-field-input-padding-bottom,
    var(--field-padding-bottom-border)
  );
  --input-padding-left: var(
    --v-field-input-padding-left,
    calc(15px - var(--field-border-width))
  );
  --input-padding-right: var(
    --v-field-input-padding-right,
    calc(15px - var(--field-border-width))
  );
  --input-padding-top: var(
    --v-field-input-padding-top,
    var(--field-padding-top-border)
  );

  // transition
  --field-transition-property: var(
    --v-field-transition-property,
    box-shadow,
    background-color,
    color,
    border-color
  );
  --field-transitions-timing-function: var(
    --v-field-transitions-timing-function,
    var(--app-transition-timing-function)
  );
  --field-transitions-duration: var(--v-field-transitions-duration, 0.15s);
  --field-cursor: var(--v-field-cursor, text);

  // colors
  --field-text-color: var(--v-field-text-color, var(--app-color-gray-blue));
  --field-background-color: var(
    --v-field-background-color,
    var(--app-color-white)
  );
  --field-active-background-color: var(--v-field-active-background-color);
  --field-icons-color: var(--app-color-gray-stroke);
  --field-placeholder-color: var(
    --v-field-placeholder-color,
    var(--app-color-gray-norm)
  );

  // typography
  --field-placeholder-weight: var(--v-field-placeholder-weight, 400);
  --field-placeholder-size: var(--v-field-placeholder-size, 12px);
  --field-font-size: var(--v-field-font-size, 14px);
  --field-line-height: var(--v-field-line-height, 23px);
  --field-font-weight: var(--v-field-font-weight, 400);
  --field-text-align: var(--v-field-text-align, left);

  position: relative;

  display: flex;
  align-items: stretch;

  border-width: var(--field-border-width);

  background-color: var(--field-background-color);
  border-color: var(--field-border-color);
  border-radius: var(--field-border-radius);

  transition-property: var(--field-transition-property);
  transition-duration: var(--field-transitions-duration);
  transition-timing-function: var(--field-transitions-timing-function);

  cursor: var(--field-cursor);

  @include mixins.body-1;

  @include mixins.hover {
    --field-icons-color: var(--app-color-secondary-norm);
    --field-border-color: var(--field-hover-border-color);
  }

  &--focused {
    --field-icons-color: var(--field-active-border-color);
    --field-border-color: var(--field-active-border-color);
    --field-background-color: var(--field-active-background-color);
    --field-cursor: text;

    @include mixins.hover {
      --field-icons-color: var(--field-active-border-color);
      --field-border-color: var(--field-active-border-color);
      --field-background-color: var(--field-active-background-color);
    }
  }

  &--appended {
    --input-padding-right: 5px;
    padding-right: var(--field-padding-right-border);
  }

  &--prepended {
    --input-padding-left: 5px;

    padding-left: var(--field-padding-left-border);
  }

  &--readonly {
    --field-border-color: var(--app-color-gray-light);
    --field-background-color: #f0f2fa;

    @include mixins.hover {
      --field-border-color: var(--app-color-gray-light);
      --field-background-color: #f0f2fa;
    }
  }

  &--disabled {
    --field-cursor: not-allowed;
    --field-border-color: var(--app-color-gray-light);
    --field-background-color: var(--app-color-gray-pale);

    pointer-events: none;

    @include mixins.hover {
      --field-border-color: var(--app-color-gray-light);
      --field-background-color: var(--app-color-gray-pale);
    }
  }

  &--errored {
    --field-border-color: var(--app-color-red-norm);
    --field-icons-color: var(--app-color-red-norm);

    @include mixins.hover {
      --field-border-color: var(--app-color-red-norm);
      --field-icons-color: var(--app-color-red-norm);
    }
  }

  &--loading {
    --field-cursor: progress;
  }

  &--row {
    padding-right: 0;
  }

  &__content {
    display: flex;
    flex-grow: 1;
    align-items: stretch;

    overflow: hidden;

    &--row {
      flex-direction: row;
    }
  }

  &__append-inner,
  &__prepend-inner {
    display: flex;
    flex-shrink: 0;
    gap: 4px;
    align-items: center;
    align-self: var(--field-align-self, flex-start);

    padding-block: var(--field-padding-top-border)
      var(--field-padding-bottom-border);

    color: var(--field-icons-color);

    transition-property: color;
    transition-duration: var(--field-transitions-duration);
    transition-timing-function: var(--field-transitions-timing-function);
  }

  &__clearable {
    display: grid;
    flex-shrink: 0;
    place-content: center;

    max-width: 24px;

    overflow: hidden;

    transition-property: width, opacity, transform, max-width, translate;
    transition-duration: var(--app-transition-duration-1);
    transition-timing-function: var(--app-transition-timing-function);

    &--enter-from,
    &--leave-to {
      opacity: 0;
      translate: 50%;
    }
  }

  &__clear-button {
    display: grid;
    place-content: center;
  }

  &__icon {
    display: grid;
    flex-shrink: 0;
    place-content: center;

    width: 24px;
    height: 24px;

    color: inherit;

    &--clear {
      padding: 4px;

      color: var(--app-color-secondary-norm, inherit);
    }

    &--loader {
      color: inherit;
    }
  }
}
</style>
