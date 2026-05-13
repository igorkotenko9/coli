<template>
  <div class="v-switcher" @click="toggleSwitch">
    <div class="v-switcher__button">
      <div
        class="v-switcher__indicator"
        :class="{
          'v-switcher__indicator--true': modelValue,
          'v-switcher__indicator--false': !modelValue,
        }"
      />
    </div>
    <VHtmlText class="v-switcher__text" :text="text" />
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({
  value: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    required: true,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import VHtmlText from "@components/VHtmlText";
defineProps(getProps());

const modelValue = defineModel<boolean>();

const toggleSwitch = () => {
  const newValue = !modelValue.value;
  modelValue.value = newValue;
};
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-switcher {
  display: flex;
  gap: 8px;
  align-items: center;

  width: fit-content;

  cursor: pointer;

  &__button {
    position: relative;

    width: 30px;
    height: 15px;

    background-color: var(--app-color-gray-pale);
    border-radius: 16px;
    box-shadow: 0 0 0 1px var(--app-color-primary-norm);
  }

  &__indicator {
    position: absolute;
    top: 0;
    left: 0;

    width: 50%;
    height: 100%;

    background-color: var(--app-color-gray-norm);
    border-radius: 50%;

    transition:
      transform 0.2s ease,
      background-color 0.2s ease;

    &--true {
      background-color: var(--app-color-green-light);

      transform: translateX(100%);
    }

    &--false {
      background-color: var(--app-color-red-light);

      transform: translateX(0);
    }
  }

  &__text {
    @include mixins.body-2;
  }
}
</style>
