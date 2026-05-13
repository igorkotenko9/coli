import { type ComponentCustomProps, computed } from "vue";

import {
  type ValidationRule,
  type ValidationRuleWithParams,
} from "@vuelidate/core";
export interface Validations {
  [key: string]: ValidationRule | ValidationRuleWithParams;
}

export const useValidations = <
  T extends ComponentCustomProps & { validations?: Validations },
>(
  props: T,
  extend?: Validations,
) => {
  return computed<Validations>(() => {
    return { ...props.validations, ...extend };
  });
};
