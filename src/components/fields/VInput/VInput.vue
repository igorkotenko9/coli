<template>
  <div class="v-input" :class="orientationDynamicClasses">
    <div v-if="isPrepended" key="prepend" class="v-input__prepend">
      <VIcon
        v-if="prependIcon"
        key="prepend-icon"
        class="v-input__icon"
        role="button"
        :icon-name="prependIcon"
        @click="$emit('click:prepend')"
      />
      <slot name="prepend" v-bind="slotsProps" />
    </div>

    <div v-if="isShowTop" class="v-input__top">
      <VLabel
        v-if="isShowLabel"
        class="v-input__label"
        :for-id="id"
        :required="required"
      >
        <template #default>
          <slot name="label" v-bind="slotsProps">
            {{ label }}
          </slot>
        </template>
      </VLabel>
    </div>

    <div ref="controlRef" class="v-input__control">
      <slot name="control" v-bind="slotsProps" />
    </div>

    <div v-if="isAppended" key="append" class="v-input__append">
      <VIcon
        v-if="appendIcon"
        key="append-icon"
        class="v-input__icon"
        :class="{
          test: true === showTooltip,
        }"
        role="button"
        :icon-name="appendIcon"
        @click="$emit('click:append')"
      />
      <slot name="append" v-bind="slotsProps" />
    </div>

    <div v-if="hasMessages" class="v-input__messages">
      <template v-if="showErrors && hasErrors">
        <InputMessages
          v-if="!isTooltipMessages"
          variation="error"
          :messages="errorsMessages"
        />
      </template>

      <template v-if="hasWarnings">
        <InputMessages
          v-if="!isTooltipMessages"
          variation="warning"
          :messages="warnings"
        />
      </template>

      <slot name="messages" />
    </div>
  </div>
</template>

<script lang="ts">
// TODO: поработать над наследованием ненужных атрибутов. Типизировать слоты. Заменить модели
import { type ExtractPublicPropTypes, type PropType, onMounted } from "vue";

import {
  type ErrorObject,
  type ValidationRule,
  type ValidationRuleWithParams,
} from "@vuelidate/core";
import { pick } from "lodash";

import { propsFactory } from "@utils";

import { type VIconIconsNames } from "@components/VIcon";

export interface Validations {
  [key: string]: ValidationRule | ValidationRuleWithParams;
}

export type ValidationEventsTypes = "blur" | "input" | "instant" | "manual";

export interface SlotsProps {
  hasErrors: boolean;
  inputId: string;
}

export type Emits = {
  "change:is-errored": [boolean];
  "click:append": [];
  "click:prepend": [];
  "update:external-errors": [null | string[]];
  "update:warnings": [null | string[]];
};

export const getProps = propsFactory({
  modelValue: {
    type: null as unknown as PropType<unknown>,
    required: true as const,
  },
  label: String as PropType<null | string>,
  required: Boolean,
  focused: {
    type: Boolean,
    default: null,
  },
  // validation
  errors: Array as PropType<ErrorObject[]>,
  warnings: Array as PropType<null | string[]>,
  validations: Object as PropType<Validations>,
  showErrors: {
    type: Boolean,
    default: true,
  },
  externalErrors: Array as PropType<null | string[]>,
  validateOn: {
    type: String as PropType<ValidationEventsTypes>,
    default: "blur",
  },
  // icons
  appendIcon: String as PropType<VIconIconsNames>,
  prependIcon: String as PropType<VIconIconsNames>,
  // tooltip
  tooltip: String as PropType<null | string>,
  showTooltip: {
    type: Boolean,
    default: true,
  },
  isTooltipMessages: {
    type: Boolean,
  },
  orientation: {
    type: String as PropType<"horizontal" | "vertical">,
    default: "vertical",
  },
});

export type Props = ExtractPublicPropTypes<ReturnType<typeof getProps>>;

export function filterProps<T extends Omit<Props, "modelValue">>(attrs: T) {
  const keys = Object.keys(getProps());
  return computed(() => pick(attrs, keys));
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { useVuelidate } from "@vuelidate/core";
import { helpers, requiredIf } from "@vuelidate/validators";

import { getUid } from "@hooks/getCurrentInstance";
import { useSlotFullness } from "@hooks/useSlotFullness";

import InputMessages from "@components/InputMessages";
import VIcon from "@components/VIcon";
import VLabel from "@components/fields/VLabel";

const props = defineProps(getProps());
const emit = defineEmits<Emits>();

const uid = getUid();
const id = computed<string>(() => `input-${uid}`);

const hasErrorsFromProps = computed(() =>
  Boolean(props.errors?.length || props.externalErrors?.length),
);

const validationsRules = computed(() => ({
  modelValue: {
    requiredIf: helpers.withMessage(
      () =>
        props.label
          ? `Поле "${props.label}" не заполнено`
          : "Пожалуйста, заполните это поле",
      requiredIf(() => {
        return Boolean(props.required);
      }),
    ),
    hasNoExternalErrors: () => !hasErrorsFromProps.value,
    ...props?.validations,
  },
}));

const orientationDynamicClasses = computed(() => {
  return props.orientation && `v-input--${props.orientation}`;
});

const v$ = useVuelidate(validationsRules, props);
const validate = (): void => {
  v$.value.$touch();
};
const resetValidation = (): void => {
  v$.value.$reset();
};

if (props.validateOn === "blur") {
  watch(
    () => props.focused,
    (val) => {
      if (val) {
        resetValidation();
      } else {
        validate();
      }
    },
  );

  watch(
    () => props.focused,
    (val) => {
      if (!val) {
        validate();
      }
    },
  );
}

if (props.validateOn === "instant") {
  onMounted(() => {
    validate();
  });
}

watch(
  () => props.modelValue,
  () => {
    if (props.externalErrors?.length) {
      emit("update:external-errors", null);
    }

    if (props.warnings?.length) {
      emit("update:warnings", null);
    }
  },
);

const allErrors = computed<(ErrorObject | string)[] | null>(() => {
  return props.errors?.length ||
    v$.value.$errors.length ||
    props.externalErrors?.length
    ? [
        ...(props.errors || []),
        ...v$.value.$errors,
        ...(props.externalErrors || []),
      ]
    : null;
});

const errorsMessages = computed<null | string[]>(() => {
  const messages =
    allErrors.value?.map((error) =>
      typeof error === "string" ? error : (error.$message as string),
    ) || null;

  const messagesWithoutEmpty = messages?.filter(Boolean);

  return messagesWithoutEmpty?.length ? messagesWithoutEmpty : null;
});

const hasErrors = computed<boolean>(() => Boolean(allErrors.value?.length));
const hasWarnings = computed<boolean>(() => Boolean(props.warnings?.length));

watch(
  errorsMessages,
  (val: any) => {
    emit("change:is-errored", val && val.length > 0);
  },
  {
    immediate: true,
  },
);

const slotsProps = computed<SlotsProps>(() => ({
  hasErrors: hasErrors.value,
  inputId: id.value,
}));

const hasAppendSlotContent = useSlotFullness("append");
const hasPrependSlotContent = useSlotFullness("prepend");
const hasMessagesSlotContent = useSlotFullness("messages");

const isAppended = computed<boolean>(
  () => hasAppendSlotContent.value || Boolean(props.appendIcon),
);
const isPrepended = computed<boolean>(
  () => hasPrependSlotContent.value || Boolean(props.prependIcon),
);
const hasMessages = computed<boolean>(
  () => hasMessagesSlotContent.value || hasErrors.value || hasWarnings.value,
);

const isShowLabel = computed<boolean>(() => Boolean(props.label));
const isShowTooltip = computed<boolean>(() =>
  Boolean(props.tooltip && props.showTooltip),
);
const isShowTop = computed<boolean>(
  () => isShowLabel.value || isShowTooltip.value,
);

const controlRef = ref<HTMLElement | null>(null);

defineExpose({
  resetValidation,
  validate,
  controlRef,
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-input {
  --input-control-width: var(--v-input-control-width);
  --input-append-margin-left: var(--v-input-append-margin-left, 5px);

  display: grid;
  grid-template-areas:
    ". top ."
    "prepend control append"
    ". messages .";
  grid-template-rows:
    auto minmax(
      calc(var(--field-control-height) + (var(--field-border-width) * 2)),
      max-content
    )
    auto;
  grid-template-columns: max-content minmax(0, 1fr) max-content;

  &--horizontal {
    grid-template-areas:
      "top prepend control append"
      ". . messages .";
    grid-template-rows:
      auto auto
      auto;
    grid-template-columns: max-content max-content minmax(0, 1fr) max-content;
  }

  &__top {
    display: flex;
    grid-area: top;
    gap: 4px;

    padding-right: 8px;
    margin-bottom: 5px;
  }

  &__prepend,
  &__append {
    display: flex;
    align-items: center;

    max-height: 40px;

    color: var(--global-color-gray-2);
  }

  &__prepend {
    grid-area: prepend;

    margin-right: 5px;
  }

  &__control {
    position: relative;

    grid-area: control;

    width: var(--input-control-width);
  }

  &__append {
    grid-area: append;

    margin-left: var(--input-append-margin-left);
  }

  &__tooltip-scroll {
    --custom-scrollbar-wrap-max-height: 80px;
    --custom-scrollbar-track-bar-border-color: transparent;
  }

  &__icon {
    display: grid;
    place-content: center;

    width: 24px;
    height: 24px;

    color: var(--app-color-gray-blue);
  }

  &__messages {
    grid-area: messages;
  }
}
</style>
