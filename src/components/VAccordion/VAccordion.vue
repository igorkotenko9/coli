<template>
  <div class="v-accordion">
    <div
      class="v-accordion__control"
      :class="controlDynamicClasses"
      @click="controlAccordionHandler"
    >
      <VIcon
        class="v-accordion__icon"
        :class="iconDynamicClasses"
        :icon-name="displayedIcon"
      /><span class="v-accordion__text">{{ props.accordionName }}</span>
    </div>
    <Transition name="slide">
      <div v-if="isUncovered" class="v-accordion__content">
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

import VIcon from "@components/VIcon/VIcon.vue";
import { type IconPositions } from "@components/buttons/VButton/VButton.vue";

export const getProps = propsFactory({
  iconType: {
    type: String as PropType<IconType>,
    default: "arrow-down-3",
  },
  iconPosition: {
    type: String as PropType<IconPositions>,
    default: "right",
  },
  accordionName: {
    type: String,
    required: true,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
type IconType = "arrow" | "plus-minus";
</script>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps(getProps());

const isUncovered = ref<boolean>(false);

const controlDynamicClasses = computed(() => {
  return [
    props.iconPosition === "left"
      ? `v-accordion__control--icon-before`
      : `v-accordion__control--icon-after`,
  ];
});

const iconDynamicClasses = computed(() => {
  return [
    `v-accordion__icon--${props.iconPosition}`,
    { "v-accordion__icon--rotated": isUncovered.value },
  ];
});

const displayedIcon = computed(() => {
  if (props.iconType === "plus-minus" && !isUncovered.value) {
    return "plus";
  } else if (props.iconType === "plus-minus" && isUncovered.value) {
    return "minus";
  } else {
    return "arrow-down-3";
  }
});

const controlAccordionHandler = () => {
  isUncovered.value = !isUncovered.value;
};
</script>

<style scoped lang="scss">
.v-accordion {
  display: flex;
  flex-direction: column;

  &__control {
    display: flex;

    padding: 8px;

    color: var(--app-color-secondary-text);

    border-radius: 8px;

    transition-duration: 0.5s;

    cursor: pointer;

    &--icon-before {
      gap: 8px;
    }

    &--icon-after {
      justify-content: space-between;
    }

    &:hover {
      background-color: rgb(0 0 0 / 0.08);
    }
  }

  &__icon {
    width: 24px;
    height: 24px;

    color: var(--app-color-secondary-text);

    transition: transform 0.3s ease-out;

    &--right {
      order: 1;
    }

    &--left {
      order: 0;
    }

    &--rotated {
      transform: rotate(180deg);
    }
  }

  &__content {
    padding-top: 8px;
    padding-left: 32px;
  }
}

.slide-enter-active,
.slide-leave-active {
  overflow: hidden;

  transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;

  transform: scaleY(0);
  transform-origin: top;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;

  transform: scaleY(1);
}
</style>
