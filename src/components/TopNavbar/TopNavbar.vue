<template>
  <div class="top-navbar">
    <div class="top-navbar__content">
      <div class="top-navbar__block top-navbar__left">
        <TopNavbarLogo class="top-navbar__logo-image" />
        <IconButton
          class="top-navbar__mobile-menu-button"
          icon-name="linear-list"
          :is-active="isShowMobileMenu"
          @click="mobileMenuButtonHandler"
        />
      </div>

      <div class="top-navbar__block top-navbar__center">
        <TopNavbarMenu
          class="top-navbar__menu-item"
          :is-show-mobile-menu="isShowMobileMenu"
          :navbar-menu-data="navbarData"
        />
      </div>

      <div class="top-navbar__block top-navbar__right">
        <IconButton
          icon-name="magnifier-input"
          :is-active="isShowSearch"
          @click="showSearchFieldButtonHandler"
        />
        <VButton
          icon-name="person"
          size="middle"
          @click="authorizationButtonHandler"
          >Войти</VButton
        >
      </div>
    </div>

    <Transition>
      <div v-if="isShowSearch" class="top-navbar__search">
        <VTextField class="top-navbar__search-field" />
        <VButton class="top-navbar__search-button" icon-name="magnifier"
          >Найти</VButton
        >
      </div>
    </Transition>
  </div>
  <AuthorizationModal v-model:is-open="isOpenAuthorizationModal" />
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { useAxios } from "@hooks/useAxios";
import { propsFactory } from "@utils";

import IconButton from "@components/buttons/IconButton/IconButton.vue";
import VTextField from "@fields/VTextField/VTextField.vue";

import { type TopNavbarItemDropdownMenuItem } from "./components/TopNavbarItemDropdown";
import TopNavbarMenu from "./components/TopNavbarMenu/TopNavbarMenu.vue";

export const getProps = propsFactory({});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;

export type NavbarData = {
  dropdownItems?: TopNavbarItemDropdownMenuItem[];
  id: string;
  text: string;
  to: string;
}[];
</script>

<script setup lang="ts">
import { ref } from "vue";

import VButton from "@components/buttons/VButton/VButton.vue";
import AuthorizationModal from "@components/modals/AuthorizationModal/AuthorizationModal.vue";

import TopNavbarLogo from "./components/TopNavbarLogo/TopNavbarLogo.vue";

defineProps(getProps());

const isOpenAuthorizationModal = ref<boolean>(false);
const isShowMobileMenu = ref<boolean>(false);
const isShowSearch = ref<boolean>(false);

const authorizationButtonHandler = () => {
  isOpenAuthorizationModal.value = true;
};

const mobileMenuButtonHandler = () => {
  isShowMobileMenu.value = !isShowMobileMenu.value;
};

const navbarData = ref<NavbarData>();

const navbarTestData = [
  {
    id: "1",
    text: "Новости",
    to: "/news",
  },
  {
    id: "2",
    text: "Раздел 2",
    to: "/section2",
  },
  {
    id: "3",
    text: "Раздел 3",
    to: "/section3",
    dropdownItems: [
      { id: "31", text: "Раздел 3.1", to: "/section3/section3-1" },
      { id: "32", text: "Раздел 3.2", to: "/section3/section3-2" },
    ],
  },
  {
    id: "4",
    text: "Раздел 4",
    to: "/section4",
    dropdownItems: [
      { id: "41", text: "Раздел 4.1", to: "/section4/section4-1" },
      { id: "42", text: "Раздел 4.2", to: "/section4/section4-2" },
    ],
  },
];

const getContent = async () => {
  const { execute, data } = useAxios<{
    navbarData: NavbarData;
  }>("/navbarTestData", {
    method: "GET",
  });

  await execute();

  if (data.value) {
    //Логика при успешном выполнении запроса
  } else {
    navbarData.value = navbarTestData;
  }
};

const showSearchFieldButtonHandler = () => {
  isShowSearch.value = !isShowSearch.value;
};

getContent();
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.top-navbar {
  --menu-item-color: var(--app-color-primary-norm);
  background-color: var(--app-color-background-dark);

  &__left {
    display: flex;
    gap: 8px;
  }

  &__content {
    display: flex;
    justify-content: space-between;
  }

  &__mobile-menu-button {
    justify-content: center;
    align-items: center;
    align-self: center;

    width: 50px;
    height: 50px;

    @include mixins.lg-min {
      display: none;
    }
  }

  &__right {
    display: flex;
    gap: 12px;
    align-items: center;

    padding-inline: 32px;
  }

  &__search {
    position: absolute;

    display: flex;
    gap: 8px;
    justify-content: center;

    width: 100%;
    padding-block: 16px;
    padding-inline: 96px;

    background-color: var(--app-color-background-dark);
    border-radius: 0 0 8px 8px;
    box-shadow: 0 6px 6px -6px var(--app-color-brown-light);
  }

  &__search-field {
    width: 100%;
  }

  box-shadow: 0 0 6px 0 var(--app-color-brown-light);
}

.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;

  transform: translateY(-10px);
}
</style>
