<template>
  <VTextField
    v-bind="props"
    v-model="proxiedModel"
    type="tel"
    :mask="MASKS.PHONE"
    :placeholder="PLACEHOLDERS.PHONE"
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
      autocomplete: "tel",
      label: "Телефон",
    }),
    ["type", "mask"],
  ),
});

export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { watch } from "vue";

import { useVModel } from "@vueuse/core";

import { MASKS, PLACEHOLDERS } from "@constants";

import VTextField from "@fields/VTextField";

const props = defineProps({
  ...getProps(),
});

const emit = defineEmits<VTextFieldEmits>();

const proxiedModel = useVModel(props, "modelValue", emit, {
  eventName: "update:model-value",
});

watch(
  proxiedModel,
  (val, oldVal) => {
    // Нужно, чтобы маска не убирала первые символы, если значение вставляется пользователем сразу или модель предзаполнена
    if (!oldVal && val && typeof val == "string") {
      const onlyNumbersPhone = val.replaceAll(/\D/g, "");
      if (onlyNumbersPhone.length === 11) {
        proxiedModel.value = onlyNumbersPhone.replace(/79/, "");
      }
    }
  },
  { immediate: true },
);

const inputFocusHandler = (event: FocusEvent) => {
  emit("focus:input", event);
};

const inputBlurHandler = (event: FocusEvent) => {
  emit("blur:input", event);
};
</script>

<style scoped lang="scss"></style>
