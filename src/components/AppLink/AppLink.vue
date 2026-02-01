<template>
  <!--
    * Отключает prettier, так как он убирает скобки внутри утверждения типа.
    ! См: https://github.com/prettier/prettier/issues/15197
  -->
  <!-- prettier-ignore-attribute :href -->
  <a v-if="isExternalLink" :href="(to as string)">
    <slot />
  </a>
  <RouterLink v-else v-bind="props" :to="appendedPath">
    <template #default="routerLinkData">
      <slot v-bind="routerLinkData" />
    </template>
  </RouterLink>
</template>

<script lang="ts">
import { type ExtractPublicPropTypes, type PropType } from "vue";
import { type RouterLinkProps, useLink } from "vue-router";

import { pick } from "lodash";

export const getProps = () =>
  ({
    /**
     * Route Location the link should navigate to when clicked on.
     */
    to: {
      type: [String, Object] as PropType<RouterLinkProps["to"]>,
      required: true,
    },
    /**
     * Calls `router.replace` instead of `router.push`.
     */
    replace: Boolean as PropType<RouterLinkProps["replace"]>,
    /**
     * Whether RouterLink should not wrap its content in an `a` tag. Useful when
     * using `v-slot` to create a custom RouterLink
     */
    custom: Boolean as PropType<RouterLinkProps["custom"]>,
    /**
     * Class to apply when the link is active
     */
    activeClass: String as PropType<RouterLinkProps["activeClass"]>,
    /**
     * Class to apply when the link is exact active
     */
    exactActiveClass: String as PropType<RouterLinkProps["activeClass"]>,
    /**
     * Value passed to the attribute `aria-current` when the link is exact active.
     *
     * @defaultValue `'page'`
     */
    ariaCurrentValue: String as PropType<RouterLinkProps["ariaCurrentValue"]>,
    append: Boolean,
  }) as const;

export function filterProps(attrs: Record<string, unknown>) {
  const keys = Object.keys(getProps());
  return computed(() => {
    return pick(attrs, keys);
  });
}

export type Props = ExtractPublicPropTypes<ReturnType<typeof getProps>>;
</script>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const props = defineProps(getProps());

const route = useRoute();

const appendedPath = computed(() => {
  return props.append
    ? route.path +
        (route.path.endsWith("/") ? "" : "/") +
        (typeof props.to === "string" ? props.to : props.to.toString())
    : props.to;
});

const link = useLink({ ...props, to: appendedPath });

const isAppLink = computed(() => {
  const isRouteInRoutes =
    link.route.value.matched[0] &&
    link.route.value.matched[0].path !== "/:pathMatch(.*)*";

  return isRouteInRoutes;
});

const isExternalLink = computed(() => {
  const linkPath = typeof props.to === "string" ? props.to : props.to.path;

  if (linkPath) {
    const isInnerLink = !linkPath.startsWith("/") && !props.append;
    const isHasProtocol = linkPath.includes("http");

    return isInnerLink || isHasProtocol || !isAppLink.value;
  }

  return true;
});

defineExpose({
  routerLinkData: link,
});
</script>

<style scoped lang="scss"></style>
