<template>
  <div ref="rootRef" class="v-list" @keydown="rootKeydownHandler"><slot /></div>
</template>

<script lang="ts">
import { type ExtractPropTypes } from "vue";

import { propsFactory } from "@utils";

export const getProps = propsFactory({});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { ref } from "vue";

import { helpers } from "@utils";

const rootRef = ref<HTMLDivElement | null>();

type FocusLocation = "first" | "last" | "next" | "prev";

function focus(location?: FocusLocation) {
  if (rootRef.value) {
    return helpers.focusChild(rootRef.value, location);
  }
}

function rootKeydownHandler(event: KeyboardEvent): void {
  if (!rootRef.value) return;

  const focusMap: Record<KeyboardEvent["key"], FocusLocation> = {
    ArrowDown: "next",
    ArrowUp: "prev",
    Home: "first",
    End: "last",
  } as const;

  const focusKey: FocusLocation | undefined = focusMap[event.key];

  if (focusKey) {
    focus(focusKey);
    event.preventDefault();
  }
}
</script>

<style scoped lang="scss"></style>
