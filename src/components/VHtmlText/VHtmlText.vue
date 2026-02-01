<template>
  <div v-html="text" class="v-html-text" />
</template>

<script lang="ts">
import { type ExtractPublicPropTypes } from "vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({
  text: {
    type: String,
    required: true,
  },
});
export type Props = ExtractPublicPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
defineProps(getProps());
</script>

<style scoped lang="scss"></style>
