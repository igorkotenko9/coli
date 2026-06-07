<template>
  <div class="v-content-badge" :class="rootDynamicClasses">
    <VIcon
      v-if="props.iconName"
      class="v-content-badge__icon"
      :class="iconDynamicClasses"
      :icon-name="props.iconName"
    />
    <div class="v-content-badge__text">
      {{ props.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

import VIcon from "@components/VIcon/VIcon.vue";

export const getProps = propsFactory({
  text: String,
  iconName: String as PropType<VIconIconsNames>,
  variation: {
    type: String as PropType<VariationBadge>,
    default: "primary",
  },
  iconPosition: {
    type: String as PropType<IconPositions>,
    default: "right",
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
type VariationBadge = "brown" | "green" | "primary" | "red";
type IconPositions = "left" | "right";
</script>

<script setup lang="ts">
import { computed } from "vue";

import { type VIconIconsNames } from "@components/VIcon";

const props = defineProps(getProps());

const rootDynamicClasses = computed(() => {
  return [`v-content-badge--${props.variation}`].filter(Boolean);
});

const iconDynamicClasses = computed(() => {
  return [`v-content-badge__icon--${props.iconPosition}`].filter(Boolean);
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.v-content-badge {
  display: flex;
  gap: 4px;
  align-items: center;

  width: fit-content;
  padding: 4px;

  color: var(--app-color-white);

  border-radius: 4px;

  cursor: inherit;

  &__icon {
    width: 16px;
    height: 16px;

    &--left {
      order: 1;
    }
  }

  &__text {
    @include mixins.tabl-subtitle;
  }

  &--primary {
    background-color: var(--app-color-primary-norm);
  }

  &--brown {
    background-color: var(--app-color-brown-norm);
  }

  &--red {
    background-color: var(--app-color-red-norm);
  }

  &--green {
    background-color: var(--app-color-green-norm);
  }
}
</style>
