<template>
  <div class="top-navbar">
    <div class="top-navbar__content">
      <div class="top-navbar__block top-navbar__logo">
        <TopNavbarLogo class="top-navbar__logo-image" />
      </div>
      <div class="top-navbar__block top-navbar__menu">
        <div
          v-for="item in navbarData"
          :key="item.id"
          class="top-navbar__menu-item"
          :class="{
            'top-navbar__menu-item--no-dropdown': hasEmptyDropdownMenu(item),
          }"
        >
          <TopNavbarItem
            :text="item.text"
            :to="item.to"
          /><TopNavbarItemDropdown
            v-if="item.dropdownItems"
            :items="item.dropdownItems"
          />
        </div>
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

import { type TopNavbarItemDropdownMenuItem } from "./components/TopNavbarItemDropdown";

export const getProps = propsFactory({});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;

type NavbarData = {
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

import TopNavbarItem from "./components/TopNavbarItem/TopNavbarItem.vue";
import TopNavbarItemDropdown from "./components/TopNavbarItemDropdown/TopNavbarItemDropdown.vue";
import TopNavbarLogo from "./components/TopNavbarLogo/TopNavbarLogo.vue";

defineProps(getProps());

const isOpenAuthorizationModal = ref(false);

function hasEmptyDropdownMenu(item: NavbarData[0]) {
  return !item.dropdownItems;
}

const authorizationButtonHandler = () => {
  isOpenAuthorizationModal.value = true;
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
      { id: "31", text: "Топ-250", to: "/films/bestfilms" },
      { id: "32", text: "Сейчас в кино", to: "/films/afisha" },
      { id: "33", text: "Новости кино", to: "/films/news" },
    ],
  },
  {
    id: "4",
    text: "Сериалы",
    to: "/serials",
    dropdownItems: [
      { id: "41", text: "Топ-250", to: "/films/bestserials" },
      { id: "41", text: "Новинки недели", to: "/films/bestfilms" },
      { id: "41", text: "Новости сериалов", to: "/films/bestfilms" },
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
  background-color: var(--app-color-background);

  &__content {
    display: flex;
    justify-content: space-between;
  }

  &__menu {
    display: flex;
    gap: 48px;
  }

  &__menu-item {
    display: flex;
    gap: 8px;
    align-self: center;

    height: fit-content;

    &--no-dropdown {
      padding-right: 32px;
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

  box-shadow: 0 0 2px 0 var(--app-color-black);
}
</style>
