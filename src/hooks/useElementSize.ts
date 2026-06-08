import { nextTick, onUpdated, ref, toValue } from "vue";

import { type MaybeElementRef, useResizeObserver } from "@vueuse/core";

import { isHTMLElement } from "@utils";

export const useElementSize = (el: MaybeElementRef) => {
  const scrollWidth = ref<number>(0);
  const scrollHeight = ref<number>(0);
  const clientWidth = ref<number>(0);
  const clientHeight = ref<number>(0);
  const offsetWidth = ref<number>(0);
  const offsetHeight = ref<number>(0);

  const updateSizes = () => {
    const _el = toValue(el);

    if (!isHTMLElement(_el)) {
      return;
    }

    const {
      scrollWidth: entryScrollWidth,
      scrollHeight: entryScrollHeight,
      clientWidth: entryClientWidth,
      clientHeight: entryClientHeight,
      offsetWidth: entryOffsetWidth,
      offsetHeight: entryOffsetHeight,
    } = toValue(_el);

    if (scrollWidth.value !== entryScrollWidth) {
      scrollWidth.value = entryScrollWidth;
    }

    if (scrollHeight.value !== entryScrollHeight) {
      scrollHeight.value = entryScrollHeight;
    }

    if (clientWidth.value !== entryClientWidth) {
      clientWidth.value = entryClientWidth;
    }

    if (clientHeight.value !== entryClientHeight) {
      clientHeight.value = entryClientHeight;
    }

    if (offsetWidth.value !== entryOffsetWidth) {
      offsetWidth.value = entryOffsetWidth;
    }

    if (offsetHeight.value !== entryOffsetHeight) {
      offsetHeight.value = entryOffsetHeight;
    }
  };

  useResizeObserver(
    el,
    () => {
      updateSizes();
    },
    {
      box: "border-box",
    },
  );

  onUpdated(async () => {
    await nextTick();
    updateSizes();
  });

  return {
    scrollWidth,
    scrollHeight,
    clientWidth,
    clientHeight,
    offsetWidth,
    offsetHeight,
  };
};
