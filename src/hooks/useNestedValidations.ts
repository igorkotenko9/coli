import { computed } from "vue";

import useVuelidate from "@vuelidate/core";
import { type GlobalConfig as VuelidateConfig } from "@vuelidate/core";

export const useNestedValidations = (config?: VuelidateConfig) => {
  const v$ = config ? useVuelidate(config) : useVuelidate();
  const isValid = computed(() => !v$.value.$invalid);
  return {
    touch: () => {
      v$.value.$touch();
    },
    reset: () => {
      v$.value.$reset();
    },
    isValid,
  };
};

export { type GlobalConfig as VuelidateConfig } from "@vuelidate/core";
