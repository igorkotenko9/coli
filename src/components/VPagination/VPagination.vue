<template>
  <div class="v-pagination">
    <IconButton
      class="v-pagination__button v-pagination__button--left"
      icon-name="arrow-left"
      :disabled="isDisableLeftButton"
    />
    <div class="v-pagination__pages-block">
      <template v-for="n in props.total" :key="n"
        ><VLink to="#">{{ n }}</VLink></template
      >
    </div>
    <IconButton
      class="v-pagination__button v-pagination__button--right"
      icon-name="arrow-right"
      :disabled="isDisableRightButton"
    />
    <div class="v-pagination__divider" />
    <div class="v-pagination__page-size-block">Показать:</div>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

import VLink from "@components/VLink/VLink.vue";
import IconButton from "@components/buttons/IconButton/IconButton.vue";

export const getProps = propsFactory({
  currentPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  pageSizes: {
    type: Array,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps(getProps());

const isDisableLeftButton = computed(() => {
  return props.currentPage <= 1 ? true : false;
});

const isDisableRightButton = computed(() => {
  return props.currentPage >= props.total ? true : false;
});
</script>

<style scoped lang="scss">
.v-pagination {
  display: flex;
  gap: 8px;
  align-items: center;

  &__button {
    justify-content: center;
    align-items: center;

    width: 30px;
    height: 30px;
    padding: 8px;
  }

  &__pages-block {
    display: flex;
    gap: 8px;
  }

  &__divider {
    width: 2px;
    height: 100%;

    background-image: linear-gradient(
      to bottom,
      transparent 0%,
      var(--app-color-primary-norm) 40%,
      var(--app-color-primary-norm) 60%,
      transparent 100%
    );
    border-radius: 1px;
    opacity: 0.9;
  }

  &__page-size-block {
    display: flex;
  }
}
</style>
