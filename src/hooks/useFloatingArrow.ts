import { type Ref, computed } from "vue";

import { type UseFloatingReturn } from "@floating-ui/vue";
export const useFloatingArrow = (
  arrowRef: Ref<HTMLElement | undefined>,
  placement: UseFloatingReturn["placement"],
  middlewareData: UseFloatingReturn["middlewareData"],
) => {
  const arrowX = computed(() => middlewareData.value.arrow?.x ?? null);
  const arrowY = computed(() => middlewareData.value.arrow?.y ?? null);

  const SIDES: Record<string, string> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  } as const;

  const arrowStyle = computed(() => {
    const side = placement.value?.split("-")[0];
    const staticSide = side && SIDES[side] ? SIDES[side] : "bottom";
    const arrowLen = arrowRef.value?.offsetWidth || 1;

    return {
      left: arrowX.value == null ? "" : `${arrowX.value}px`,
      top: arrowY.value == null ? "" : `${arrowY.value}px`,
      [staticSide]: `${-arrowLen / 2}px`,
    };
  });

  return {
    arrowStyle,
  };
};
