<template>
  <div ref="dropdown" class="v-dropdown">
    <div class="v-dropdown__button" @click="clickButtonHandler">
      <slot name="button">Кнопка</slot>
    </div>

    <Transition name="v-dropdown__content-">
      <div v-if="isOpen" class="v-dropdown__content">
        <div class="v-dropdown__content-hidden">
          <slot name="content">Контент</slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { onClickOutside } from "@vueuse/core";
import { useVModel } from "@vueuse/core";

const props = defineProps({
  clickOutsideForClose: {
    type: Boolean,
    default: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  manualToggle: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  "update:isOpen": [data: boolean];
}>();

const proxiedIsOpen = useVModel(props, "isOpen", emit);

function close() {
  proxiedIsOpen.value = false;
}

function toggle() {
  proxiedIsOpen.value = !proxiedIsOpen.value;
}

function clickButtonHandler() {
  if (!props.isDisabled && !props.manualToggle) {
    toggle();
  }
}

const dropdown = ref();

function clickOutsideHandler() {
  if (props.clickOutsideForClose) {
    close();
  }
}
onClickOutside(dropdown, clickOutsideHandler);
</script>

<style scoped lang="scss">
.v-dropdown {
  --content-width: auto;

  transition-property: all;
  transition-duration: 350ms;
  transition-timing-function: ease-in-out;

  &__content {
    display: grid;
    grid-template-rows: 1fr;

    width: var(--content-width);

    overflow: hidden;

    &--enter-active,
    &--leave-active {
      transition-property: all;
      transition-duration: 250ms;
      transition-timing-function: ease-in-out;
    }

    &--enter-from,
    &--leave-to {
      grid-template-rows: 0fr;

      opacity: 0;
    }
  }

  &__content-hidden {
    overflow: hidden;
  }
}
</style>
