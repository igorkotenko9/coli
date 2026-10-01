<template>
  <div class="page-navigation-item" :class="[isActiveItem]">
    <LinkButton mode="link" :to="itemData?.to">{{ itemData?.name }}</LinkButton>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

import LinkButton from "@components/LinkButton/LinkButton.vue";

export const getProps = propsFactory({
  itemData: {
    type: Object as PropType<NavigationItemData>,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;

export type NavigationItemData = {
  id: string;
  name: string;
  to: string;
};
</script>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps(getProps());

const isActiveItem = computed(() => {
  if (props.isActive) {
    return `page-navigation-item--active`;
  }
  return "";
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.page-navigation-item {
  @include mixins.body-regular;
  padding: 4px 8px;

  border-radius: 4px;

  transition-property: all;
  transition-duration: 0.3s;

  cursor: pointer;

  &:hover {
    background-color: var(--app-color-background-dark);
  }

  &--active {
    color: var(--app-color-white);

    background-color: var(--app-color-primary-norm);

    &:hover {
      background-color: var(--app-color-primary-dark);
    }
  }

  &:active {
    background-color: var(--app-color-primary-light);
  }
}
</style>
