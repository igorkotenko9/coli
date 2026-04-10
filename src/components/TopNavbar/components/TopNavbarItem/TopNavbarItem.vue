<template>
  <div class="top-navbar-item">
    <LinkButton class="top-navbar-item__link" mode="link" url="/">{{
      props.text
    }}</LinkButton>
  </div>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

import LinkButton from "@components/LinkButton/LinkButton.vue";

export const getProps = propsFactory({
  text: { type: String, required: true },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
const props = defineProps(getProps());
</script>

<style scoped lang="scss">
.top-navbar-item {
  display: flex;
  gap: 4px;
  justify-content: center;

  color: var(--menu-item-color);

  &__link {
    align-self: center;
  }

  &__button {
    align-self: center;

    height: fit-content;
  }
}
</style>
