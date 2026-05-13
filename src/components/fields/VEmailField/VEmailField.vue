<template>
  <VTextField
    v-bind="props"
    v-model="proxiedModel"
    hint-text="Разрешен ввод цифр 0-9, символов латинского алфавита A-Z, a-z, и спец. символов"
    type="email"
    :placeholder="PLACEHOLDERS.EMAIL"
    :validations="localValidations"
    @blur:input="inputBlurHandler"
    @focus:input="inputFocusHandler"
  />
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { omit } from "lodash";

import { propsFactory } from "@utils";

import { type VTextFieldEmits, getVTextFieldProps } from "@fields/VTextField";

export const getProps = propsFactory({
  ...omit(
    getVTextFieldProps({
      showHint: true,
      autocomplete: "email",
      label: "E-mail",
      maxlength: "40",
    }),
    ["type", "mask"],
  ),
});

export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";

import { PLACEHOLDERS } from "@/constants";
import { useValidations } from "@hooks/useValidations";
import { validators } from "@utils";

import VTextField from "@fields/VTextField";

const props = defineProps({
  ...getProps(),
});

const emit = defineEmits<VTextFieldEmits>();

const proxiedModel = useVModel(props, "modelValue", emit, {
  eventName: "update:model-value",
});

const localValidations = useValidations(props, {
  checkEmailSymbols: validators.checkEmailSymbols,
  email: validators.email,
});

const inputFocusHandler = (event: FocusEvent) => {
  emit("focus:input", event);
};

const inputBlurHandler = (event: FocusEvent) => {
  emit("blur:input", event);
};
</script>

<style scoped lang="scss"></style>
