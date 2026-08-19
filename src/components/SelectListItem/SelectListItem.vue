<template>
  <ListItem v-bind="$props" class="select-list-item">
    <template #prepend>
      <div
        v-if="multiple"
        class="select-list-item__checkbox"
        :class="{
          'select-list-item__checkbox--active': active,
          'select-list-item__checkbox--intermediate': intermediate,
        }"
      >
        <VIcon
          v-if="active"
          class="select-list-item__icon"
          icon-name="checkbox-checked"
        />
      </div>
    </template>
  </ListItem>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

import { getListItemProps } from "@components/ListItem";

export const getProps = propsFactory({
  ...getListItemProps(),
  multiple: Boolean,
  intermediate: Boolean,
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import ListItem from "@components/ListItem";
import VIcon from "@components/VIcon";

defineProps(getProps());
</script>

<style scoped lang="scss">
.select-list-item {
  &__checkbox {
    display: grid;
    flex-shrink: 0;
    place-content: center;

    width: 16px;
    height: 16px;
    margin-top: 1px;
    border-width: 2px;

    color: var(--app-color-white);

    border-color: var(--app-color-secondary-dark);
    border-radius: 4px;

    &--active,
    &--intermediate {
      background-color: var(--app-color-secondary-dark);
    }
  }

  &__icon {
    width: 100%;
    height: 100%;

    color: inherit;
  }
}
</style>
