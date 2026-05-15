<template>
  <VModal
    v-model:is-open="proxiedIsOpen"
    :title="isNeedRegistration ? 'Регистрация' : 'Авторизация'"
  >
    <div v-if="!isShowMessage" class="authorization-modal__wrapper">
      <VForm class="authorization-modal__form">
        <template #default="{ isErrored }">
          <TransitionGroup
            class="authorization-modal__transition-fields"
            name="fade-slide"
            tag="div"
          >
            <VEmailField
              v-if="isNeedRegistration"
              key="email"
              v-model="emailValue"
              class="authorization-modal__input-field"
              label="Адрес электронной почты"
              required
            />
            <VPhoneField
              v-if="isNeedRegistration"
              key="phone"
              v-model="phoneValue"
              class="authorization-modal__input-field"
              label="Номер телефона"
              required
            />
            <VTextField
              key="login"
              v-model="loginValue"
              class="authorization-modal__input-field"
              label="Логин"
              required
              :placeholder="PLACEHOLDERS.LOGIN"
            />
            <VPasswordField
              key="password"
              v-model="passwordValue"
              class="authorization-modal__input-field"
              required
              :need-confirmed="isNeedRegistration"
            />
            <VButton
              key="submit-button"
              class="authorization-modal__submit-button"
              :disabled="isErrored"
              @click="submitButtonHandler"
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
        text="Регистрация"
      />
    </div>
    <div v-else>
      На почту {{ emailValue }} вам было отправлено письмо с дальнейшими
      инструкциями по регистрации.
    </div>
  </VModal>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { PLACEHOLDERS } from "@constants";
import { propsFactory } from "@utils";

import VEmailField from "@fields/VEmailField/VEmailField.vue";
import VPasswordField from "@fields/VPasswordField/VPasswordField.vue";
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

import { useAxios } from "@hooks/useAxios";

import VForm from "@components/VForm";
import VSwitcher from "@components/VSwitcher/VSwitcher.vue";
import VButton from "@components/buttons/VButton";
import VModal from "@components/modals/VModal";
import VTextField from "@fields/VTextField/VTextField.vue";

const props = defineProps({ ...getProps() });

const emit = defineEmits<{
  "update:isOpen": [data: boolean];
}>();

const isLoading = ref<boolean>(false);

const proxiedIsOpen = useVModel(props, "isOpen", emit);
const isShowMessage = ref<boolean>(false);

const isNeedRegistration = ref<boolean>(false);
const loginValue = ref<null | string>(null);
const passwordValue = ref<null | string>(null);
const emailValue = ref<null | string>(null);
const phoneValue = ref<null | string>(null);

const submitButtonHandler = () => {
  if (isNeedRegistration.value) {
    submitReg();
  } else {
    submitAuth();
  }
};

const submitAuth = async () => {
  try {
    isLoading.value = true;

    const { execute } = useAxios("/submitauth", {
      method: "POST",
    });

    await execute({
      data: {
        login: loginValue.value,
        password: passwordValue.value,
      },
    });

    // emit("update");
    proxiedIsOpen.value = false;
  } finally {
    isLoading.value = false;
  }
};

const submitReg = async () => {
  try {
    isLoading.value = true;

    const { execute } = useAxios("/submitreg", {
      method: "POST",
    });

    await execute({
      data: {
        email: emailValue.value,
        phone: phoneValue.value,
        login: loginValue.value,
        password: passwordValue.value,
      },
    });
  } finally {
    isLoading.value = false;
    isShowMessage.value = true;
  }
};
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
