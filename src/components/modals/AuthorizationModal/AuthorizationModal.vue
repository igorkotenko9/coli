<template>
  <VModal v-model:is-open="proxiedIsOpen" title="Авторизация">
    <VForm class="authorization-modal">
      <template #default="{ isErrored }">
        <VTextField
          v-model="subsystemNameTextModel"
          class="authorization-modal__input-field"
          label="Логин"
          placeholder="Введите логин"
          required
        />
        <VTextField
          v-model="subsystemNameTextModel"
          class="authorization-modal__input-field"
          label="Пароль"
          placeholder="Введите пароль"
          required
        />
        <VButton
          class="authorization-modal__submit-button"
          :disabled="isErrored"
          >Войти</VButton
        >
      </template>
    </VForm>
  </VModal>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({
  isOpen: {
    type: Boolean,
    default: false,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { ref } from "vue";

import { useVModel } from "@vueuse/core";

import VForm from "@components/VForm";
import VButton from "@components/buttons/VButton";
import VModal from "@components/modals/VModal";
import VTextField from "@fields/VTextField/VTextField.vue";

const props = defineProps({ ...getProps() });

const emit = defineEmits<{
  "update:isOpen": [data: boolean];
}>();

const proxiedIsOpen = useVModel(props, "isOpen", emit);

const subsystemNameTextModel = ref<null | string>(null);
</script>

<style scoped lang="scss">
.authorization-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
