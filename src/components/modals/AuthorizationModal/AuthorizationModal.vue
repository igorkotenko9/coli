<template>
  <VModal
    v-model:is-open="proxiedIsOpen"
    class="authorization-modal"
    :title="isNeedRegistration ? 'Регистрация' : 'Авторизация'"
  >
    <div class="authorization-modal__wrapper">
      <VForm class="authorization-modal__form">
        <template #default="{ isErrored }">
          <TransitionGroup
            class="authorization-modal__transition-fields"
            name="fade-slide"
            tag="div"
          >
            <VEmailField
              v-if="isNeedRegistration"
              v-model="emailValue"
              class="authorization-modal__input-field"
              label="Адрес электронной почты"
              required
            />
            <VPhoneField
              v-if="isNeedRegistration"
              v-model="phoneValue"
              class="authorization-modal__input-field"
              label="Номер телефона"
              required
            />
            <VTextField
              v-model="loginValue"
              class="authorization-modal__input-field"
              label="Логин"
              required
              :placeholder="PLACEHOLDERS.LOGIN"
            />
            <VTextField
              v-model="passwordValue"
              class="authorization-modal__input-field"
              label="Пароль"
              required
              :placeholder="PLACEHOLDERS.PASSWORD"
            />
            <VTextField
              v-if="isNeedRegistration"
              v-model="confirmedPasswordValue"
              class="authorization-modal__input-field"
              label="Подтверждение пароля"
              required
              :placeholder="PLACEHOLDERS.PASSWORD"
            />
            <VButton
              class="authorization-modal__submit-button"
              :disabled="isErrored"
              >{{
                isNeedRegistration ? "Зарегистрироваться" : "Войти"
              }}</VButton
            >
          </TransitionGroup>
        </template>
      </VForm>
      <VSwitcher
        v-model="isNeedRegistration"
        class="authorization-modal__switcher"
        text="Зарегистрироваться"
      />
    </div>
  </VModal>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { PLACEHOLDERS } from "@constants";
import { propsFactory } from "@utils";

import VEmailField from "@fields/VEmailField/VEmailField.vue";
import VPhoneField from "@fields/VPhoneField/VPhoneField.vue";

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
import VSwitcher from "@components/VSwitcher/VSwitcher.vue";
import VButton from "@components/buttons/VButton";
import VModal from "@components/modals/VModal";
import VTextField from "@fields/VTextField/VTextField.vue";

const props = defineProps({ ...getProps() });

const emit = defineEmits<{
  "update:isOpen": [data: boolean];
}>();

const proxiedIsOpen = useVModel(props, "isOpen", emit);

const isNeedRegistration = ref<boolean>(false);
const loginValue = ref<null | string>(null);
const passwordValue = ref<null | string>(null);
const confirmedPasswordValue = ref<null | string>(null);
const emailValue = ref<null | string>(null);
const phoneValue = ref<null | string>(null);
</script>

<style scoped lang="scss">
.authorization-modal {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__transition-fields {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;

  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;

  transform: translateY(10px);
}

.fade-slide-move {
  transition: transform 0.3s ease;
}
</style>
