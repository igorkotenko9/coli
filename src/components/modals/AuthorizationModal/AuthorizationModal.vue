<template>
  <VModal v-model:is-open="proxiedIsOpen" title="Авторизация" />
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({
  isOpen: {
    type: Boolean,
    default: false,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";

import VModal from "@components/modals/VModal";

const props = defineProps({ ...getProps() });

const emit = defineEmits<{
  "update:isOpen": [data: boolean];
}>();

const proxiedIsOpen = useVModel(props, "isOpen", emit);
</script>

<style scoped lang="scss"></style>
