<template>
  <Component
    :is="rootTag"
    v-bind="filteredProps"
    ref="rootRef"
    v-ripple
    class="list-item"
    :class="{
      'list-item--active': active,
      'list-item--disabled': disabled,
    }"
    tabindex="0"
    @click="emit('click', $event)"
    @keydown="rootKeydownHandler"
  >
    <div class="list-item__content">
      <slot name="prepend" />

      <div class="list-item__text">
        <slot name="default">
          {{ value }}
        </slot>
      </div>
      <slot name="append" />
    </div>
  </Component>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { omit } from "lodash";

import { Ripple as vRipple } from "@/directives/ripple";
import { propsFactory } from "@/utils";

import AppLink, {
  type AppLinkProps,
  filterAppLinkProps,
  getAppLinkProps,
} from "@components/AppLink";

type Tags = "div" | "link";

export const getProps = propsFactory({
  ...omit(getAppLinkProps(), "to"),
  to: { type: String as PropType<AppLinkProps["to"]> },
  active: Boolean,
  disabled: Boolean,
  value: String,
  tag: String as PropType<Tags>,
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>>;
export type Emits = {
  click: [MouseEvent];
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps(getProps());
const emit = defineEmits<Emits>();

const rootTag = computed(() => (props.tag === "link" ? AppLink : "div"));

const rootKeydownHandler = (event: KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    emit("click", event as any as MouseEvent);
  }
};

const filteredLinkProps = filterAppLinkProps(props);

const filteredProps = computed(() => {
  return props.tag === "link" ? filteredLinkProps.value : props;
});

const rootRef = ref();

defineExpose({
  routerLinkData: computed(() => rootRef.value?.routerLinkData),
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.list-item {
  --item-padding-block: var(--list-item-padding-block, 6px);
  --item-padding-inline: var(--list-item-padding-inline, 11px);
  --ripple-color: var(--app-color-gray-pale);

  position: relative;

  display: block;

  padding: var(--item-padding-block) var(--item-padding-inline);
  margin-inline: 4px;

  transition-property: background-color;
  transition-duration: var(--app-transition-duration-1);
  transition-timing-function: linear;

  @include mixins.body-2;

  cursor: pointer;

  &:hover {
    background-color: var(--app-color-primary-light);
  }

  &--active {
    background-color: var(--app-color-primary-dark);

    &:hover {
      background-color: var(--app-color-primary-light);
    }
  }

  &--disabled {
    opacity: 0.3;

    pointer-events: none;
    user-select: none;
  }

  &__content {
    position: relative;
    z-index: 2;

    display: flex;
    gap: 10px;
  }

  &__text {
    overflow-wrap: break-word;
  }
}
</style>
