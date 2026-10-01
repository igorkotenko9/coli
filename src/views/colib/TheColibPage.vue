<template>
  <div class="the-colib-page">
    <VPageNavigation menu-name="Компоненты" :navigation-data="componentsList" />
    <ComponentView />
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

import { useAxios } from "@hooks/useAxios";

import ComponentView from "@components/ComponentView/ComponentView.vue";
import VPageNavigation from "@components/VPageNavigation/VPageNavigation.vue";
import { type PageNavigationGroupData } from "@components/VPageNavigation/VPageNavigation.vue";
</script>

<script setup lang="ts">
const componentsList = ref<PageNavigationGroupData>();

// const test = [
//   {
//     id: "11001",
//     name: "VButton",
//     to: "/v-button",
//   },
//   {
//     id: "11002",
//     name: "IconButton",
//     to: "/icon-button",
//   },
// ];

const getList = async () => {
  const { execute, data } = useAxios<{
    components: PageNavigationGroupData;
  }>("/responses/components/list.json", { method: "GET" });

  await execute({});

  if (data.value?.components) {
    componentsList.value = data.value.components;
  } else {
    console.log("error");
  }
};

getList();
</script>

<style scoped lang="scss">
.the-colib-page {
  display: flex;
  gap: 32px;

  padding: 32px 48px;
}
</style>
