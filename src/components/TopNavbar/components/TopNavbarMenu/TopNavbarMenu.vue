<template>
  <div v-if="!props.isShowMobileMenu" class="top-navbar-menu__item-wrapper">
    <div
      v-for="item in props.navbarMenuData"
      :key="item.id"
      class="top-navbar-menu__item"
      :class="{
        'top-navbar__menu-item--no-dropdown': hasEmptyDropdownMenu(item),
      }"
    >
      <TopNavbarItem :text="item.text" :to="item.to" /><TopNavbarItemDropdown
        v-if="item.dropdownItems"
        :items="item.dropdownItems"
      />
    </div>
  </div>
  <Transition name="slide-mobile">
    <div v-if="props.isShowMobileMenu" class="top-navbar-menu__mobile-menu">
      <div
        v-for="itemMobile in props.navbarMenuData"
        :key="itemMobile.id"
        class="top-navbar-menu__mobile-item"
        :class="{
          'top-navbar__menu-item--no-dropdown':
            hasEmptyDropdownMenu(itemMobile),
        }"
      >
        <TopNavbarItem
          :text="itemMobile.text"
          :to="itemMobile.to"
        /><TopNavbarItemDropdown
          v-if="itemMobile.dropdownItems"
          :items="itemMobile.dropdownItems"
        />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { useScrollLock } from "@vueuse/core";

import { propsFactory } from "@utils";

import { type NavbarMenuData } from "@components/TopNavbar";

import TopNavbarItem from "../TopNavbarItem/TopNavbarItem.vue";
import TopNavbarItemDropdown from "../TopNavbarItemDropdown/TopNavbarItemDropdown.vue";

export const getProps = propsFactory({
  isShowMobileMenu: {
    type: Boolean,
    default: false,
  },
  navbarMenuData: {
    type: Object as PropType<NavbarMenuData>,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps(getProps());

const body = ref<HTMLElement | null>(document.body);

const isLocked = useScrollLock(body);

function hasEmptyDropdownMenu(item: NavbarMenuData[0]) {
  return !item.dropdownItems;
}

watch(
  () => props.isShowMobileMenu,
  () => {
    isLocked.value = props.isShowMobileMenu;
  },
);
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.top-navbar-menu {
  &__item-wrapper {
    display: flex;
    gap: 36px;

    height: -webkit-fill-available;

    @include mixins.lg-max {
      display: none;
    }
  }

  &__item {
    display: flex;
    gap: 8px;
    align-self: center;

    height: fit-content;

    &--no-dropdown {
      padding-right: 32px;
    }
  }

  &__mobile-menu {
    position: fixed;
    top: 74px;
    right: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    gap: 48px;

    height: calc(100vh - 74px);
    padding: 48px;

    background-color: var(--app-color-background);
    overflow-y: auto;
  }

  &__mobile-item {
    display: flex;
  }
}

.slide-mobile-enter-active,
.slide-mobile-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-mobile-enter-from,
.slide-mobile-leave-to {
  transform: translateX(-100%);
}

.slide-mobile-enter-to,
.slide-mobile-leave-from {
  transform: translateX(0);
}
</style>
