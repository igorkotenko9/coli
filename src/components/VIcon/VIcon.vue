<template>
  <svg class="v-icon">
    <use :xlink:href="iconPath" />
  </svg>
</template>

<script lang="ts">
import { ICONS_MAP, type IconsIds } from "@/generated/icons";
export { type IconsIds } from "@/generated/icons";
</script>

<script setup lang="ts">
import { type PropType, computed } from "vue";

const props = defineProps({
  iconName: String as PropType<IconsIds>,
  path: String,
});

const staticAssetsPath = import.meta.env.VITE_BASE_DIR || "/";

const iconPath = computed(() => {
  const iconName = props.iconName;

  if (!iconName) return props.path;

  const iconsMapKeys = Object.keys(ICONS_MAP) as (keyof typeof ICONS_MAP)[];
  const currentIconGroup = iconsMapKeys.find((key) =>
    ICONS_MAP[key].includes(iconName),
  );

  if (!currentIconGroup) return props.path;

  return (
    props.path ||
    `${staticAssetsPath}images/icons/generated/sprites/${currentIconGroup}.svg#${iconName}`
  );
});
</script>

<style scoped lang="scss">
.v-icon {
  display: grid;
  place-content: center;
}
</style>
