<template>
  <component
    :is="tag"
    ref="formRef"
    class="v-form"
    :class="{
      'v-form--disabled': disabled,
    }"
    novalidate
    :inert="disabled"
    @submit.prevent="formSubmitHandler"
  >
    <slot :is-errored="isErrored" :submit="formSubmitHandler" />

    <!-- Нужен, чтобы форма реагировала на нажатие enter -->
    <input hidden type="submit" />
  </component>
</template>

<script setup lang="ts">
import { type PropType, computed, watch } from "vue";

import {
  type VuelidateConfig,
  useNestedValidations,
} from "@hooks/useNestedValidations";

const props = defineProps({
  tag: {
    type: String as PropType<"fieldset" | "form">, // Проверить, работает ли submit внутри fieldset
    default: "form",
  },
  disabled: Boolean,
  validationConfig: {
    type: Object as PropType<VuelidateConfig>,
  },
});

const emit = defineEmits<{
  "has-errors-status-change": [boolean];
  submit: [boolean];
}>();

const { touch, reset, isValid } = useNestedValidations(props.validationConfig);

const formSubmitHandler = () => {
  touch();

  emit("submit", isValid.value);
};

const isErrored = computed<boolean>(() => !isValid.value);

watch(isErrored, (value: boolean) => {
  emit("has-errors-status-change", value);
});

defineExpose({
  resetValidation: () => {
    reset();
  },
});
</script>

<style scoped lang="scss">
.v-form {
  transition-property: opacity;
  transition-duration: 0.1s;
  transition-timing-function: var(--app-transition-timing-function);

  &--disabled {
    opacity: 0.7;
  }
}
</style>
