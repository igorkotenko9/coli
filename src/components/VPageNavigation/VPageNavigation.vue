<template>
  <div class="v-page-navigation">
    <VTitle class="v-page-navigation__title" variation="h3">
      {{ props.menuName }}</VTitle
    >
    <div class="v-page-navigation__items-block">
      <template v-if="isNavigationGroup">
        <template v-for="group in navigationGroup" :key="group.id">
          <div class="v-page-navigation__items">
            <VTitle
              class="v-page-navigation__block-title"
              variation="subtitle-3"
              >{{ group.name }}</VTitle
            >
            <PageNavigationItem
              v-for="item in group.list"
              :key="item.id"
              class="v-page-navigation__item"
              :item-data="item"
            />
          </div>
        </template>
      </template>
      <template v-else>
        <PageNavigationItem
          v-for="item in navigationList"
          :key="item.id"
          class="v-page-navigation__item"
          :item-data="item"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType, computed } from "vue";

import { propsFactory } from "@utils";

import VTitle from "@components/VTitle/VTitle.vue";

import { type PageNavigationItemData } from "./components/PageNavigationItem";
import PageNavigationItem from "./components/PageNavigationItem/PageNavigationItem.vue";

export type PageNavigationGroupData = {
  id: string;
  list: PageNavigationItemData[];
  name: string;
}[];

type PageNavigationData = PageNavigationGroupData | PageNavigationItemData[];

export const getProps = propsFactory({
  activeItem: {
    type: String,
  },
  navigationData: { type: Object as PropType<PageNavigationData> },
  menuName: String,
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
const props = defineProps(getProps());

const isNavigationGroup = computed(() => {
  const data = props.navigationData;
  if (!data || !Array.isArray(data) || data.length === 0) return false;
  const first = data[0];
  return first != null && "list" in first;
});

const navigationGroup = computed(() =>
  isNavigationGroup.value
    ? (props.navigationData as PageNavigationGroupData)
    : null,
);

const navigationList = computed(() =>
  isNavigationGroup.value
    ? null
    : (props.navigationData as PageNavigationItemData[]),
);
</script>

<style scoped lang="scss">
.v-page-navigation {
  display: flex;
  flex-direction: column;
  gap: 18px;

  min-width: 200px;
  max-width: 200px;
  padding: 8px;

  &__title {
    color: var(--app-color-brown-norm);
  }

  &__block-title {
    color: var(--app-color-primary-norm);
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__items-block {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
