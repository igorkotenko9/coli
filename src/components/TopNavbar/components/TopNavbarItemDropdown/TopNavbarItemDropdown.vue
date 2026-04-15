<template>
  <VMenu
    v-model:is-show-dropdown="isShowDropdown"
    class="top-navbar-item-dropdown"
    placement="bottom-end"
    :anchor-element="anchorRef"
    ><template #control>
      <IconButton
        ref="anchorRef"
        class="top-navbar-item-dropdown__activator"
        :icon-name="currentButtonIcon"
        @click="fieldMousedownControlHandler"
      /> </template
    ><template #dropdown
      ><div class="top-navbar-item-dropdown__menu">
        <div class="top-navbar-item-dropdown__menu-inner">
          <div
            v-if="items && items.length"
            class="top-navbar-item-dropdown__menu-list"
          >
            <VList class="top-navbar-item-dropdown__menu-list-inner"
              ><ListItem
                v-for="item in items"
                :key="item.id"
                class="top-navbar-item-dropdown__menu-list-item"
                tag="link"
                :active="item.id === activeId"
                :to="item.to"
                :value="item.text"
            /></VList>
          </div>
        </div></div></template
  ></VMenu>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

export const getProps = () => ({
  activeId: String as PropType<null | string>,
});
export type MenuItem = {
  id: string;
  text: string;
  to: string;
};
export type Props<T extends MenuItem = MenuItem> = ExtractPropTypes<
  ReturnType<typeof getProps>
> & {
  items: T[] | null;
};
</script>

<script setup lang="ts" generic="T extends MenuItem">
import { computed, shallowRef } from "vue";

import ListItem from "@components/ListItem/ListItem.vue";
import VList from "@components/VList/VList.vue";
import IconButton from "@components/buttons/IconButton/IconButton.vue";
import VMenu from "@components/dropdowns/VMenu/VMenu.vue";

defineProps({
  ...getProps(),
  items: {
    type: Array as PropType<T[] | null>,
  },
});

const isShowDropdown = shallowRef<boolean>(false);
const anchorRef = shallowRef<null>();
const fieldMousedownControlHandler = () => {
  isShowDropdown.value = !isShowDropdown.value;
};

const currentButtonIcon = computed(() =>
  isShowDropdown.value ? "arrow-down-1" : "arrow-down",
);
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.top-navbar-item-dropdown {
  --v-menu-background-color: var(--app-color-gray-pale);
  display: flex;
  align-items: center;

  min-width: max-content;
  height: 100%;

  color: var(--app-color-gray-dark);

  overflow: hidden;

  @include mixins.tab;

  &__activator {
    display: flex;
    gap: 8px;
    align-items: center;

    height: 100%;

    color: var(--app-color-gray-dark);

    @include mixins.tab;
  }

  &__activator-icon {
    flex-shrink: 0;

    width: 18px;
    height: 18px;
    padding: 6px;

    color: inherit;

    transition-property: rotate, color;
    transition-duration: var(--app-transition-duration-1);
    transition-timing-function: var(--app-transition-timing-function);
    rotate: 90deg;

    &--active {
      rotate: -90deg;

      color: var(--app-color-secondary-dark);
    }
  }

  &__menu {
    max-width: 240px;
  }

  &__menu-list {
    padding-block: 20px;
    margin: 0 5px;
  }

  &__menu-list-item.list-item {
    --list-item-padding-inline: 20px;

    @include mixins.body-1;
  }
}
</style>
