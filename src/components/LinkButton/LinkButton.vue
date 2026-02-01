<template>
  <component :is="rootNode" v-bind="filteredAttributes">
    <template #default="routerLinkData">
      <slot v-bind="routerLinkData || {}" />
    </template>
  </component>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { propsFactory } from "@utils";

type Modes = "button" | "link";
type ExtendedMode = "div" | "span" | Modes;
type ButtonTypes = "button" | "reset" | "submit";
type LinkTargets = "_blank" | "_parent" | "_self" | "_top";

export const getProps = propsFactory({
  disabled: { type: Boolean, required: false, default: false },
  url: {
    type: [String, Object] as PropType<RouterLinkProps["to"] | string>,
    required: false,
  },
  type: { type: String as PropType<ButtonTypes>, required: false },
  download: { type: [Boolean, String], required: false },
  target: { type: String as PropType<LinkTargets>, required: false },
  activeClass: { type: String, required: false },
  isLoading: { type: Boolean, required: false },
  mode: { type: String as PropType<ExtendedMode>, required: true },
});

export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
export type { ButtonTypes, ExtendedMode, LinkTargets, Modes };
</script>

<script setup lang="ts">
import { computed } from "vue";
import { type RouterLinkProps } from "vue-router";

import AppLink from "@components/AppLink";

const props = defineProps(getProps());

type LinksButtonsProps = Writeable<typeof props>;

const filteredAttributes = computed<Partial<LinksButtonsProps>>(() => {
  const attributes: Partial<LinksButtonsProps> & {
    href?: string;
    to?: RouterLinkProps["to"];
  } = {};
  if (props.mode === "link") {
    if (props.download) {
      props.download === true
        ? (attributes.download = "")
        : (attributes.download = props.download);
    }

    attributes.target = props.target;
    attributes.to = props.url;

    attributes.activeClass = props.activeClass;
  } else if (props.mode === "button") {
    attributes.disabled = props.disabled || props.isLoading;

    attributes.type = props.type || "button";
  }
  return attributes;
});

const rootNode = computed<string | typeof AppLink>(() => {
  switch (props.mode) {
    case "link": {
      return AppLink;
    }
    case "div": {
      return "div";
    }
    case "span": {
      return "span";
    }
    default: {
      return "button";
    }
  }
});
</script>

<style scoped lang="scss"></style>
