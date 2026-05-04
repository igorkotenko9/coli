<template>
  <VInput
    v-bind="filteredInputProps"
    ref="vInputRef"
    v-model="proxiedModel"
    v-model:external-errors="proxiedExternalErrors"
    class="v-text-field"
    :focused="isFocusedProxy"
    :label="label"
    :warnings="localWarnings"
    :is-tooltip-messages="isTooltipMessages"
    @change:is-errored="vInputChangeIsErroredHandler"
  >
    <template #control="{ inputId }">
      <VField
        ref="vFieldRef"
        class="v-text-field__field"
        v-bind="filteredFieldProps"
        v-model:focused="isFocusedProxy"
        :dirty="isDirty"
        :error="isErrored"
        @click="fieldClickHandler"
        @click:clear="fieldClickClearHandler"
        @mousedown="fieldContainerMousedownHandler"
      >
        <template #prepend-inner="vFieldSlotsProps">
          <slot
            name="prepend-inner"
            v-bind="{ ...vFieldSlotsProps, ...vTextFieldSlotProps }"
          />
        </template>
        <template #default="vFieldSlotsProps">
          <template v-if="$slots.default">
            <div :class="[vFieldSlotsProps.fieldClasses]">
              <slot
                v-bind="{
                  ...vFieldSlotsProps,
                  ...vTextFieldSlotProps,
                }"
              />
              <input
                v-if="maskOptions"
                v-bind="inputAttributes"
                :id="inputId"
                ref="inputRef"
                v-maska="maskOptions"
                v-on="inputListeners"
                class="v-text-field__input"
              />
              <input
                v-else
                v-bind="inputAttributes"
                :id="inputId"
                ref="inputRef"
                v-on="inputListeners"
                class="v-text-field__input"
              />
            </div>
          </template>
          <template v-else>
            <input
              v-if="maskOptions"
              v-bind="inputAttributes"
              :id="inputId"
              ref="inputRef"
              v-maska="maskOptions"
              v-on="inputListeners"
              class="v-text-field__input"
              :class="[vFieldSlotsProps.fieldClasses]"
              @mousedown="handleInputMouseEvents"
              @mouseup="handleInputMouseEvents"
            />
            <input
              v-else
              v-bind="inputAttributes"
              :id="inputId"
              ref="inputRef"
              v-on="inputListeners"
              class="v-text-field__input"
              :class="[vFieldSlotsProps.fieldClasses]"
              @mousedown="handleInputMouseEvents"
              @mouseup="handleInputMouseEvents"
            />
          </template>
        </template>
        <template #append-inner="vFieldSlotsProps">
          <slot
            name="append-inner"
            v-bind="{ ...vFieldSlotsProps, ...vTextFieldSlotProps }"
          />
        </template>
      </VField>
    </template>
    <template #messages>
      <slot name="messages" />
    </template>
  </VInput>
</template>

<script lang="ts">
import { type ExtractPublicPropTypes, type PropType, computed } from "vue";

import { omit, pick } from "lodash";
import {
  type MaskInputOptions,
  type MaskTokens,
  type MaskType,
  type MaskaDetail,
} from "maska";

import { propsFactory } from "@utils";

import { type VFieldEmits, getVFieldProps } from "@fields/VField";
import { type VInputEmits, getVInputProps } from "@fields/VInput";

export type MaskNumber = {
  fraction?: number;
  locale?: string;
  unsigned?: boolean;
};

type HTMLInputModes =
  | "decimal"
  | "email"
  | "none"
  | "numeric"
  | "search"
  | "tel"
  | "text"
  | "url";

export type InputTypes =
  | "email"
  | "number"
  | "numeric"
  | "password"
  | "search"
  | "tel"
  | "text";

export const getProps = propsFactory({
  ...omit(getVInputProps(), ["modelValue"]),
  ...getVFieldProps(),
  modelValue: [String, Number] as PropType<null | number | string>,
  type: {
    type: String as PropType<InputTypes>,
    default: "text" as const,
  },
  clearable: {
    type: Boolean,
    default: true as const,
  },
  hoverAppendArrow: {
    type: Boolean,
    default: false,
  },
  autofocus: Boolean,
  name: String,
  mask: [String, Array, Function, null] as PropType<MaskType>,
  maskPostProcess: Function as PropType<MaskInputOptions["postProcess"]>,
  maskPreProcess: Function as PropType<MaskInputOptions["preProcess"]>,
  maskEager: {
    type: Boolean,
    default: true as const,
  },
  maskTokens: Object as PropType<MaskTokens | null>,
  maskNumber: {
    type: Object as PropType<MaskNumber | null>,
  },
  autocomplete: String,
  value: null,
  pattern: String,
  maxlength: [String, Number],
  inputmode: String as PropType<HTMLInputModes>,
  placeholder: [String, null] as PropType<null | string>,
  max: Number as PropType<null | number>,
  isTooltipMessages: {
    type: Boolean,
  },
});
export function filterProps(attrs: Record<string, unknown>) {
  const keys = Object.keys(getProps());
  return computed(() => pick(attrs, keys));
}
export type Props = ExtractPublicPropTypes<ReturnType<typeof getProps>>;

export type Emits = VFieldEmits &
  VInputEmits & {
    "blur:input": [FocusEvent];
    "click:control": [MouseEvent];
    "click:input": [];
    "focus:input": [FocusEvent];
    input: [InputEvent];
    "keydown:input": [KeyboardEvent];
    "keydown-delete:input": [
      KeyboardEvent,
      HTMLInputElement,
      KeyboardEvent["key"],
    ];
    maska: [MaskaDetail];
    "mousedown:control": [MouseEvent];
    "paste:input": [Event];
    "update:model-value": [unknown];
  };
</script>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

import { useIntersectionObserver, useVModel } from "@vueuse/core";
import { vMaska } from "maska/vue";

import { focusInput } from "@utils";

import VField, { filterVFieldProps } from "@fields/VField";
import VInput, { filterVInputProps } from "@fields/VInput";

const props = defineProps(getProps());
const emit = defineEmits<Emits>();

const filteredFieldProps = filterVFieldProps(props);
const filteredInputProps = filterVInputProps(props);

const proxiedModel = useVModel(props, "modelValue", emit, {
  eventName: "update:model-value",
});
const proxiedExternalErrors = useVModel(props, "externalErrors", emit, {
  eventName: "update:external-errors",
});

const isFocused = ref<boolean>(false);
const isFocusedProxy = computed({
  get: () => {
    return typeof props.focused === "boolean" ? props.focused : isFocused.value;
  },
  set: (value: boolean) => {
    isFocused.value = value;

    if (typeof props.focused === "boolean") {
      emit("update:focused", value);
    }
  },
});

const isDirty = computed<boolean>(() => {
  return (
    Boolean(proxiedModel.value != null && String(proxiedModel.value).length) ||
    props.dirty
  );
});

const inputRef = ref<HTMLInputElement | null>(null);

const observer = useIntersectionObserver(
  inputRef,
  async ([entry]: IntersectionObserverEntry[]) => {
    if (entry?.isIntersecting && props.autofocus) {
      await nextTick();

      setTimeout(() => {
        focusInputField();
      }, 100);

      observer.stop();
    }
  },
  {
    immediate: true,
  },
);

const inputBlurHandler = (event: FocusEvent) => {
  isFocused.value = false;
  emit("blur:input", event);
};

const setFieldSelectionToEnd = () => {
  if (
    props.type &&
    ["password", "search", "tel", "text", "url"].includes(props.type) &&
    inputRef.value
  ) {
    nextTick(() => {
      let caretPosition: number = 0;

      if (proxiedModel.value && typeof proxiedModel.value === "string") {
        caretPosition = proxiedModel.value.length;
      }

      if (inputRef.value && proxiedModel.value) {
        inputRef.value.setSelectionRange(caretPosition, caretPosition);
      }
    });
  }
};

const isMouseDown = ref(false);
const lastFocusPosition = ref<null | number>(null);

const handleInputMouseEvents = (event: MouseEvent) => {
  if (event.type === "mousedown") {
    isMouseDown.value = true;
    if (isFocusedProxy.value) {
      lastFocusPosition.value = inputRef.value?.selectionStart ?? null;
    } else {
      event.preventDefault();
      focusInputField();
    }
  } else if (event.type === "mouseup") {
    if (isMouseDown.value && !isFocusedProxy.value) {
      setCaretToEnd();
    }
    isMouseDown.value = false;
  }
};

const setCaretToEnd = () => {
  if (inputRef.value && typeof proxiedModel.value === "string") {
    const len = proxiedModel.value.length;
    inputRef.value.setSelectionRange(len, len);
  }
};

watch(
  () => props.type,
  () => {
    setFieldSelectionToEnd();
  },
);

function focusInputField() {
  if (props.disabled) return;
  if (inputRef.value !== document.activeElement) {
    focusInput(inputRef.value);
    setCaretToEnd();
  }
  if (!isFocusedProxy.value) {
    isFocusedProxy.value = true;
  }
}

const handleInputBlur = () => {
  lastFocusPosition.value = null;
  isFocusedProxy.value = false;
};

const inputFocusHandler = () => {
  focusInputField();
};

const fieldContainerMousedownHandler = (event: MouseEvent) => {
  emit("mousedown:control", event);

  if (event.target === inputRef.value) return;

  focusInputField();
  event.preventDefault();
};

const fieldClickHandler = (event: MouseEvent) => {
  if (!isFocusedProxy.value) {
    focusInputField();
    setCaretToEnd();
  }
  emit("click:control", event);
};

const fieldClickClearHandler = () => {
  proxiedModel.value = null;
  localWarnings.value = null;
  emit("click:clear");
};

const maskOptions = computed<MaskInputOptions | null>(() => {
  if (props.mask) {
    const maskOptionsContainer: MaskInputOptions = {
      mask: props.mask,
      eager: props.maskEager,
      onMaska: (detail: MaskaDetail) => {
        emit("maska", {
          masked: detail.masked,
          unmasked: detail.unmasked,
          completed: detail.completed,
        });
      },
    };

    if (props.maskNumber) {
      maskOptionsContainer.number = props.maskNumber;
    }

    if (props.maskTokens) {
      maskOptionsContainer.tokens = props.maskTokens;
    }

    if (props.maskPreProcess) {
      maskOptionsContainer.preProcess = props.maskPreProcess;
    }
    if (props.maskPostProcess) {
      maskOptionsContainer.postProcess = props.maskPostProcess;
    }

    return maskOptionsContainer;
  } else {
    return null;
  }
});

const isErrored = ref<boolean>(false);

const vInputChangeIsErroredHandler = (errorStatus: boolean) => {
  isErrored.value = errorStatus;
};

const vTextFieldSlotProps = computed<{ isErrored: boolean }>(() => ({
  isErrored: isErrored.value,
}));

const localWarnings = ref<null | string[]>(null);

const inputHandler = (event: InputEvent) => {
  const target = event.target as HTMLInputElement;

  if (target.value === proxiedModel.value) return;

  if (localWarnings.value?.length) {
    localWarnings.value = null;
  }

  const isNotPassPattern =
    props.pattern &&
    !new RegExp(props.pattern).test(target.value) &&
    target.value;

  const isMaxNumberValue =
    props.max && Number(target.value) >= props.max && target.value;

  if (isNotPassPattern || isMaxNumberValue) {
    event.stopPropagation();
    event.preventDefault();

    if (isNotPassPattern) {
      target.value = proxiedModel.value as string;
    } else if (isMaxNumberValue) {
      target.value = String(props.max);
      proxiedModel.value = String(props.max);
    }
  } else {
    proxiedModel.value = target.value;
  }

  emit("input", event);
};

const inputkeydownDeleteHandler = (event: KeyboardEvent) => {
  const target = event.target as HTMLInputElement;

  emit("keydown-delete:input", event, target, event.key);
};

const inputkeydownHandler = (event: KeyboardEvent) => {
  emit("keydown:input", event);

  if (event.key === "Delete" || event.key === "Backspace") {
    inputkeydownDeleteHandler(event);
  }
};

const inputPasteHandler = (event: ClipboardEvent) => {
  event.preventDefault();

  const pastedText = event.clipboardData?.getData("text") || "";
  const currentText =
    proxiedModel.value == null ? "" : String(proxiedModel.value);
  const maxLength = Number(props.maxlength);

  let newText = currentText + pastedText;
  if (newText.length > maxLength) {
    newText = newText.slice(0, maxLength);
    localWarnings.value = [
      `Невозможно ввести в поле более ${props.maxlength} символов`,
    ];
  }

  proxiedModel.value = newText;

  emit("paste:input", event);
};

const showedPlaceholder = computed<string>(() => props.placeholder || "");

const vFieldRef = ref<InstanceType<typeof VField>>();
const vInputRef = ref<InstanceType<typeof VInput>>();

const inputAttributes = computed(() => ({
  value: proxiedModel.value,
  type: props.type,
  required: props.required,
  disabled: props.disabled,
  readonly: props.readonly,
  autocomplete: props.autocomplete,
  pattern: props.pattern,
  maxlength: props.maxlength,
  inputmode: props.inputmode,
  placeholder: showedPlaceholder.value,
}));

const inputListeners = computed(() => ({
  input: inputHandler,
  keydown: inputkeydownHandler,
  paste: inputPasteHandler,
  blur: (event: FocusEvent) => {
    handleInputBlur();
    inputBlurHandler(event);
  },
  focus: inputFocusHandler,
  beforeinput: (event: any) => {
    if (
      Number(String(proxiedModel.value)?.length) === Number(props.maxlength)
    ) {
      const hasInsert = /(?:insert)/i.test(event.inputType);

      if (hasInsert) {
        localWarnings.value = [
          `Невозможно ввести в поле более ${props.maxlength} символов`,
        ];
      }
    }
  },
}));

defineExpose({
  focusInputField,
  isFocused,
  fieldRef: vFieldRef,
  inputElementRef: inputRef,
  controlElementRef: computed<HTMLElement | null>(
    () => vInputRef.value?.controlRef || null,
  ),
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;
@use "@fields/VField";

.v-text-field {
  --text-field-input-padding-block: var(--v-text-field-input-padding-block);
  --text-field-input-padding-inline: var(--v-text-field-input-padding-inline);
  --text-field-input-alignment: var(--v-text-field-input-alignment);
  --text-field-border-radius: var(--v-text-field-border-radius);
  --text-field-transition-property: var(--v-text-field-transition-property);
  --text-field-active-background-color: var(
    --v-text-field-active-background-color
  );
  --text-field-padding-right: var(--v-text-field-appended-padding-right);
  --text-field-color: var(--v-text-field-color);
  --text-field-border-color: var(--v-text-field-border-color);
  --text-field-hover-border-color: var(--v-text-field-hover-border-color);
  --text-field-height: var(--v-text-field-height);
  --text-field-active-border-color: var(--v-text-field-active-border-color);
  --text-field-cursor: var(--v-text-field-cursor);
  --text-field-font-size: var(--v-text-field-font-size);
  --text-field-line-height: var(--v-text-field-line-height);
  --text-field-font-weight: var(--v-text-field-font-weight);
  --text-field-placeholder-color: var(--v-text-field-placeholder-color);
  --text-field-placeholder-weight: var(--v-text-field-placeholder-weight);
  --text-field-placeholder-size: var(--v-text-field-placeholder-size);
  --v-input-control-width: var(--v-text-field-input-control-width);

  &__field {
    --v-field-padding-right: var(--text-field-padding-right);
    --v-field-input-padding-top: var(--text-field-input-padding-block);
    --v-field-input-padding-bottom: var(--text-field-input-padding-block);
    --v-field-input-padding-left: var(--text-field-input-padding-inline);
    --v-field-input-padding-right: var(--text-field-input-padding-inline);
    --v-field-text-align: var(--text-field-input-alignment);
    --v-field-border-radius: var(--text-field-border-radius);
    --v-field-transition-property: var(--text-field-transition-property);
    --v-field-active-background-color: var(
      --text-field-active-background-color
    );
    --v-field-border-color: var(--text-field-border-color);
    --v-field-hover-border-color: var(--text-field-hover-border-color);
    --v-field-text-color: var(--text-field-color);
    --v-field-active-border-color: var(--text-field-active-border-color);
    --v-field-cursor: var(--text-field-cursor);
    --v-field-font-size: var(--text-field-font-size);
    --v-field-line-height: var(--text-field-line-height);
    --v-field-font-weight: var(--text-field-font-weight);
    --v-field-placeholder-color: var(--text-field-placeholder-color);
    --v-field-placeholder-weight: var(--text-field-placeholder-weight);
    --v-field-placeholder-size: var(--text-field-placeholder-size);

    height: var(--text-field-height);
  }
}
</style>
