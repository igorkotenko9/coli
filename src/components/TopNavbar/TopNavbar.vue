<template>
  <div class="top-navbar">
    <div class="top-navbar__content">
      <div class="top-navbar__block top-navbar__logo">
        <TopNavbarLogo class="top-navbar__logo-image" />
      </div>
      <div class="top-navbar__block top-navbar__menu">
        <TopNavbarItem text="Кино" />
        <TopNavbarItem text="Сериалы" />
        <TopNavbarItem text="Игры" />
        <TopNavbarItem text="Литература" />
      </div>
      <div class="top-navbar__block top-navbar__user">
        Авторизация/Пользователь
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

import TopNavbarItem from "./components/TopNavbarItem/TopNavbarItem.vue";
import TopNavbarLogo from "./components/TopNavbarLogo/TopNavbarLogo.vue";

export const getProps = propsFactory({});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
defineProps(getProps());
</script>

<style scoped lang="scss">
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

  box-shadow: 0 0 2px 0 var(--app-color-black);
}
</style>
