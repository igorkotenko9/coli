<template>
  <div class="top-navbar">
    <div class="top-navbar__content">
      <div class="top-navbar__block top-navbar__logo">
        <TopNavbarLogo class="top-navbar__logo-image" />
        <IconButton
          class="top-navbar__mobile-menu-button"
          icon-name="linear-list"
          :is-active="isShowMobileMenu"
          @click="mobileMenuButtonHandler"
        />
      </div>

      <div class="top-navbar__block top-navbar__menu">
        <TopNavbarMenu
          class="top-navbar__menu-item"
          :is-show-mobile-menu="isShowMobileMenu"
          :navbar-menu-data="navbarData"
        />
      </div>

      <div class="top-navbar__block top-navbar__user">
        <VButton
          icon-name="person"
          size="middle"
          @click="authorizationButtonHandler"
          >Войти</VButton
        >
      </div>
    </div>
  </div>
  <AuthorizationModal v-model:is-open="isOpenAuthorizationModal" />
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { useAxios } from "@hooks/useAxios";
import { propsFactory } from "@utils";

import IconButton from "@components/buttons/IconButton/IconButton.vue";

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
    text: "Статьи",
    to: "/press",
  },
  {
    id: "3",
    text: "Кино",
    to: "/films",
    dropdownItems: [
      { id: "31", text: "Топ-100", to: "/films/bestsfilms" },
      { id: "31", text: "Форумы", to: "/films/forums" },
    ],
  },
  {
    id: "4",
    text: "Сериалы",
    to: "/serials",
    dropdownItems: [
      { id: "41", text: "Топ-100", to: "/serials/bestsserials" },
      { id: "41", text: "Форумы", to: "/serials/forums" },
    ],
  },
  {
    id: "5",
    text: "Литертура",
    to: "/literature",
    dropdownItems: [
      { id: "51", text: "Топ-100", to: "/literature/bestlit" },
      { id: "51", text: "Форумы", to: "/literature/forums" },
    ],
  },
  {
    id: "6",
    text: "Игры",
    to: "/games",
    dropdownItems: [
      { id: "61", text: "Топ-100", to: "/games/bestgames" },
      { id: "61", text: "Форумы", to: "/games/forums" },
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

getContent();
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.top-navbar {
  --menu-item-color: var(--app-color-primary-norm);
  background-color: var(--app-color-background-dark);

  &__logo {
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

  &__user {
    @include mixins.body-2;

    display: flex;
    align-items: center;

    padding-inline: 32px;

    color: var(--menu-item-color);

    &:hover {
      --menu-item-color: var(--app-color-primary-dark);
    }

    &:active {
      --menu-item-color: var(--app-color-primary-light);
    }
  }

  box-shadow: 0 0 6px 0 var(--app-color-brown-light);
}
</style>
