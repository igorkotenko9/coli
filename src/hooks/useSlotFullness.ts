import { Comment, Fragment, Text, onBeforeUpdate, ref, useSlots } from "vue";

/**
 * Determines whether a slot is empty for Vue 3: https://github.com/vuejs/vue-next/issues/3056
 * @param {Function} slot - The slot $slot.name
 * @returns {Boolean}
 */

// Adapted from https://github.com/vuejs/vue-next/blob/ca17162e377e0a0bf3fae9d92d0fdcb32084a9fe/packages/runtime-core/src/helpers/renderSlot.ts#L77

function vNodeIsEmpty(vnodes: any) {
  return vnodes.every((node: any) => {
    const isComment = node.type === Comment;
    const isText = node.type === Text && !node.children.trim();
    const isFragment = node.type === Fragment && vNodeIsEmpty(node.children);

    return isComment || isText || isFragment;
  });
}

/**
 * Returns true if a slot has no content
 * @param {Function | Object} slot a Vue 3 slot function or a Vue 2 slot object
 * @returns {Boolean}
 */
export const isEmpty = (slot: any) => {
  if (!slot) return true;

  // if we get a slot that is not a function, we're in vue 2 and there is content, so it's not empty
  if (typeof slot !== "function") return false;

  return vNodeIsEmpty(slot());
};

export const useSlotFullness = (slotName: string) => {
  const slots = useSlots();
  const slotIsFilled = ref<boolean>(false);

  const checkFullness = () => {
    const isFilled = !isEmpty(slots[slotName]);
    if (slotIsFilled.value !== isFilled) {
      slotIsFilled.value = isFilled;
    }
  };

  checkFullness();

  onBeforeUpdate(() => {
    checkFullness();
  });

  return slotIsFilled;
};
