<template>
  <component :is="currentRootTag" class="v-image">
    <slot>
      <source
        v-for="(sourse, i) in sourses"
        :key="i"
        v-bind="
          getSourceAttributes(sourse.srcset, sourse.fileExtension, sourse.media)
        "
      />
    </slot>

    <img
      class="v-image__img"
      :class="additionalClassesImg"
      :alt="alt"
      v-bind="imgAttributes"
    />
  </component>
</template>

<script lang="ts">
import { type ExtractPublicPropTypes, type PropType } from "vue";

export interface VImagePropsSourse {
  fileExtension: string;
  media?: string;
  srcset: string;
}

export const getVImageProps = () => ({
  alt: {
    type: String,
    required: false,
  },
  src: {
    type: String,
    required: false,
  },
  isLazy: { type: Boolean, required: false, default: true },
  sourses: {
    type: Array as PropType<VImagePropsSourse[]>,
    required: false,
  },
  pathToPlug: {
    type: String,
    required: false,
    default: "/src/components/VImage/images/picture-plug.svg",
  },
});

export type Props = ExtractPublicPropTypes<ReturnType<typeof getVImageProps>>;
</script>

<script setup lang="ts">
import { computed, useSlots } from "vue";

// @ts-expect-error -- lazySizes нужен только для побочных эффектов
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import lazySizes from "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import "lazysizes/plugins/bgset/ls.bgset";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";

const props = defineProps(getVImageProps());

const slots = useSlots();
const isfilledDefaultSlot = computed<boolean>(() => Boolean(slots.default));

type CurrentRootTag = "div" | "picture";

const currentRootTag = computed<CurrentRootTag>(() =>
  isfilledDefaultSlot.value || props.sourses ? "picture" : "div",
);

const imagePath = computed(() => {
  const publicUrl = import.meta.env.VITE_BASE_DIR;

  if (
    props.src?.startsWith("/") &&
    import.meta.env.VITE_BASE_DIR !== "/" &&
    import.meta.env.VITE_BASE_DIR !== "./"
  ) {
    return `${publicUrl}${props.src}`;
  }

  return props.src || props.pathToPlug;
});

const additionalClassesImg = computed<object>(() => ({
  ["lazyload"]: props.isLazy,
}));

interface LazyAttributes {
  ["data-srcset"]?: string;
  srcset?: string;
}

interface SourceAttributes extends LazyAttributes {
  media?: string;
  type: string;
}

const imgAttributes = computed(() => {
  const attributes: LazyAttributes = {};

  attributes[props.isLazy ? "data-srcset" : "srcset"] = imagePath.value;

  return attributes;
});

const getSourceAttributes = (
  srcset: string,
  fileExtension: string,
  media?: string,
) => {
  const attributes: SourceAttributes = {
    type: "image/",
  };

  attributes[props.isLazy ? "data-srcset" : "srcset"] = srcset;
  attributes.type += fileExtension;
  attributes.media = media;

  return attributes;
};
</script>

<style scoped lang="scss">
.v-image {
  --img-object-fit: var(--v-image-object-fit, cover);
  --img-object-position: var(--v-image-object-position, center);

  display: block;

  &__img {
    width: 100%;
    height: 100%;

    object-fit: var(--img-object-fit);
    object-position: var(--img-object-position);
  }
}
</style>
