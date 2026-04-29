<template>
  <Teleport to="#overlays">
    <VTransition animation-name="fade">
      <div v-if="proxiedIsOpen" class="v-modal-window">
        <div class="v-modal-window__inner">
          <VIsland
            class="v-modal-window__content"
            :style="styleContent"
            :is-loading="isLoading"
          >
            <IslandBox class="v-modal-window__box">
              <div class="v-modal-window__header" :class="headerClass">
                <slot name="title">
                  <VTitle
                    class="v-modal-window__title"
                    tag="div"
                    variation="h3"
                  >
                    {{ title }}
                  </VTitle>
                </slot>
                <div class="v-modal-window__right-block">
                  <slot name="right" />
                  <IconButton
                    v-if="hasCloseButton"
                    class="v-modal-window__close-button"
                    icon-name="close"
                    mode="button"
                    type="button"
                    @click="closeModal"
                  />
                </div>
              </div>

              <div class="v-modal-window__main">
                <slot />
              </div>
            </IslandBox>
          </VIsland>

          <div class="v-modal-window__backdrop" @click="backdropClickHandler" />
        </div>
      </div>
    </VTransition>
  </Teleport>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

export type HeaderAlignType = "center" | "left";

export const getProps = propsFactory({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
  },
  hasCloseButton: {
    type: Boolean,
    default: true,
  },
  hasClickOutside: {
    type: Boolean,
    default: true,
  },
  styleContent: {
    type: Object,
  },
  hasLogout: {
    type: Boolean,
    default: true,
  },
  isLoading: {
    type: Boolean,
  },
  isChange: {
    type: Boolean,
    default: false,
  },
  headerAlign: {
    type: String as PropType<HeaderAlignType>,
    default: "left",
  },
});

export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { useScrollLock, useVModel } from "@vueuse/core";

import VTitle from "@components/VTitle";
import VTransition from "@components/animations/VTransition";
import IconButton from "@components/buttons/IconButton";
import IslandBox from "@components/islands/IslandBox";
import VIsland from "@components/islands/VIsland";

const props = defineProps({ ...getProps() });

const emit = defineEmits<{
  "click-on-close": [];
  "update:isOpen": [data: boolean];
}>();

const proxiedIsOpen = useVModel(props, "isOpen", emit);

const body = ref<HTMLElement | null>(document.body);

const headerClass = computed(
  () => `v-modal-window__header--${props.headerAlign}-align`,
);

// TODO: убрать скачок сроллбара при открытии модалки
const isLocked = useScrollLock(body);

watch(proxiedIsOpen, () => {
  isLocked.value = proxiedIsOpen.value;
});

const isChange = ref(props.isChange);

watch(
  () => props.isChange,
  (newValue) => {
    isChange.value = newValue;
  },
);

function closeModal() {
  setTimeout(() => {
    proxiedIsOpen.value = false;
  }, 500);
}

function backdropClickHandler() {
  if (props.hasClickOutside) {
    closeModal();
  }
}
</script>

<style scoped lang="scss">
@use "@style/variables" as vars;

.v-modal-window {
  position: fixed;
  inset: 0;
  z-index: vars.$z-index-modal;

  background-color: transparent;
  overflow: auto;

  &__inner {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    min-height: 100%;
    padding: 40px;

    opacity: 1;
  }

  &__backdrop {
    position: absolute;
    inset: 0;

    background-color: rgb(196 196 180 / 0.6);
  }

  &__content {
    position: relative;
    z-index: 1;

    width: 100%;
    max-width: 700px;
    border-width: 1px;

    border-color: var(--app-color-gray-stroke);
    border-style: solid;
  }

  &__box {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  &__header {
    position: relative;

    display: flex;
    justify-content: space-between;
    align-items: center;

    &--center-align {
      justify-content: center;
    }
  }

  &__title {
    color: var(--app-color-secondary-text);
    word-break: normal;
    overflow-wrap: break-word;
  }
}
</style>
