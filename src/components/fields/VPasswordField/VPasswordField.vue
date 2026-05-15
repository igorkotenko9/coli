<template>
  <div class="v-password-field__wrapper">
    <VTextField
      v-bind="props"
      v-model="proxiedModel"
      class="v-password-field"
      label="Пароль"
      pass-switch-button
      tooltip="Пароль должен содержать минимум 8 символов. Допускается ввод латиницы, цифр и спецсимволов"
      tooltip-button-icon="question-mark"
      :pattern="PATTERNS.PASSWORD"
      :placeholder="PLACEHOLDERS.PASSWORD"
      :type="isShowPass ? 'text' : 'password'"
      :validations="localValidations"
      :is-show-password="isShowPass"
      @blur:input="inputBlurHandler"
      @click:switch-pass="inputSwitchPassHandler"
      @focus:input="inputFocusHandler"
    />
    <VTextField
      v-if="needConfirmed"
      v-model="confirmedValue"
      v-model:external-errors="proxiedMatchError"
      class="v-password-field"
      clearable
      label="Подтверждение пароля"
      pass-switch-button
      :pattern="PATTERNS.PASSWORD"
      :placeholder="PLACEHOLDERS.PASSWORD"
      :type="isShowConfirm ? 'text' : 'password'"
      :is-show-password="isShowConfirm"
      @blur:input="inputConfirmBlurHandler"
      @click:switch-pass="inputSwitchConfirmHandler"
      @focus:input="inputConfirmFocusHandler"
      @input="inputConfirmHandler"
    />
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { omit } from "lodash";

import { propsFactory } from "@utils";

import { type VTextFieldEmits, getVTextFieldProps } from "@fields/VTextField";

export const getProps = propsFactory({
  ...omit(getVTextFieldProps({})),
  needConfirmed: {
    type: Boolean,
    default: false,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { computed, ref } from "vue";

import { useVModel } from "@vueuse/core";

import { PATTERNS, PLACEHOLDERS } from "@constants";
import { useValidations } from "@hooks/useValidations";
import { validators } from "@utils";

import VTextField from "@fields/VTextField/VTextField.vue";

const props = defineProps(getProps());

const emit = defineEmits<VTextFieldEmits>();

const proxiedModel = useVModel(props, "modelValue", emit, {
  eventName: "update:model-value",
});

const localValidations = useValidations(props, {
  checkPassword: validators.password,
});

const isShowPass = ref<boolean>(false);
const isShowConfirm = ref<boolean>(false);

const confirmedValue = ref<"modelValue">();

const isConfirmFieldTouched = ref(false);

const inputFocusHandler = (event: FocusEvent) => {
  emit("focus:input", event);
};

const inputBlurHandler = (event: FocusEvent) => {
  emit("blur:input", event);
};

const inputSwitchPassHandler = () => {
  isShowPass.value = !isShowPass.value;
};

const inputSwitchConfirmHandler = () => {
  isShowConfirm.value = !isShowConfirm.value;
};

const inputConfirmBlurHandler = (event: FocusEvent) => {
  isConfirmFieldTouched.value = true;
  emit("blur:input", event);
};

const inputConfirmFocusHandler = (event: FocusEvent) => {
  emit("blur:input", event);
};

const inputConfirmHandler = () => {
  isConfirmFieldTouched.value = true;
};

const proxiedMatchError = computed(() => {
  if (!isConfirmFieldTouched.value) {
    return [];
  }

  return proxiedModel.value == confirmedValue.value
    ? []
    : ["Пароли не совпадают"];
});
</script>

<style scoped lang="scss">
.v-password-field {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
