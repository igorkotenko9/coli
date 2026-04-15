// Styles
// Types
import { type DirectiveBinding } from "vue";

// Utilities
import { isObject, keyCodes } from "@utils";

import "./VRipple.scss";

type RippleElement = {
  _ripple?: {
    centered?: boolean;
    circle?: boolean;
    class?: string;
    enabled?: boolean;
    isTouch?: boolean;
    showTimer?: number;
    showTimerCommit?: (() => void) | null;
    touched?: boolean;
  };
  getElementsByClassName(classNames: string): NodeListOf<HTMLElement>;
} & HTMLElement;

const stopSymbol = Symbol("rippleStop");

type RippleEvent = (KeyboardEvent | MouseEvent | TouchEvent) & {
  [stopSymbol]?: boolean;
};

const DELAY_RIPPLE = 80;

function transform(el: RippleElement, value: string) {
  el.style.transform = value;
  el.style.webkitTransform = value;
}

interface RippleOptions {
  center?: boolean;
  circle?: boolean;
  class?: string;
}

export interface RippleDirectiveBinding extends Omit<
  DirectiveBinding,
  "modifiers" | "value"
> {
  modifiers: {
    center?: boolean;
    circle?: boolean;
    stop?: boolean;
  };
  value?: { class: string } | boolean;
}

function isTouchEvent(event: RippleEvent): event is TouchEvent {
  return event.constructor.name === "TouchEvent";
}

function isKeyboardEvent(event: RippleEvent): event is KeyboardEvent {
  return event.constructor.name === "KeyboardEvent";
}

const calculate = (
  event: RippleEvent,
  element: RippleElement,
  options: RippleOptions = {},
) => {
  let localX = 0;
  let localY = 0;

  if (!isKeyboardEvent(event)) {
    const offset = element.getBoundingClientRect();
    const target = isTouchEvent(event) ? event.touches.item(-1) : event;

    if (target) {
      localX = target.clientX - offset.left;
      localY = target.clientY - offset.top;
    }
  }

  let radius = 0;
  let scale = 0.3;

  if (element._ripple?.circle) {
    scale = 0.15;
    radius = element.clientWidth / 2;
    radius = options.center
      ? radius
      : radius + Math.hypot(localX - radius, localY - radius) / 4;
  } else {
    radius = Math.hypot(element.clientWidth, element.clientHeight) / 2;
  }

  const centerX = `${(element.clientWidth - radius * 2) / 2}px`;
  const centerY = `${(element.clientHeight - radius * 2) / 2}px`;

  const x = options.center ? centerX : `${localX - radius}px`;
  const y = options.center ? centerY : `${localY - radius}px`;

  return { radius, scale, x, y, centerX, centerY };
};

const ripples = {
  show(event: RippleEvent, el: RippleElement, value: RippleOptions = {}) {
    if (!el?._ripple?.enabled) {
      return;
    }

    const container = document.createElement("span") as RippleElement;
    const animation = document.createElement("span") as RippleElement;

    container.prepend(animation);
    container.className = "v-ripple__container";

    if (value.class) {
      container.className += ` ${value.class}`;
    }

    const { radius, scale, x, y, centerX, centerY } = calculate(
      event,
      el,
      value,
    );

    const size = `${radius * 2}px`;
    animation.className = "v-ripple__animation";
    animation.style.width = size;
    animation.style.height = size;

    el.prepend(container);

    const computed = window.getComputedStyle(el);
    if (computed?.position === "static") {
      el.style.position = "relative";
      el.dataset.previousPosition = "static";
    }

    animation.classList.add("v-ripple__animation--enter");
    animation.classList.add("v-ripple__animation--visible");
    transform(
      animation,
      `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`,
    );
    animation.dataset.activated = String(performance.now());

    setTimeout(() => {
      animation.classList.remove("v-ripple__animation--enter");
      animation.classList.add("v-ripple__animation--in");
      transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
    }, 0);
  },

  hide(el: RippleElement | null) {
    if (!el?._ripple?.enabled) {
      return;
    }

    const ripples = el.querySelectorAll(
      ".v-ripple__animation",
    ) as NodeListOf<RippleElement>;

    if (ripples.length === 0) {
      return;
    }

    const animation = lastElement(Array.from(ripples));

    if (animation) {
      if (animation.dataset.isHiding) {
        return;
      } else {
        animation.dataset.isHiding = "true";
      }

      const diff = performance.now() - Number(animation.dataset.activated);
      const delay = Math.max(300 - diff, 0);

      setTimeout(() => {
        animation.classList.remove("v-ripple__animation--in");
        animation.classList.add("v-ripple__animation--out");

        setTimeout(() => {
          const ripples = el.querySelectorAll(".v-ripple__animation");
          if (ripples.length === 1 && el.dataset.previousPosition) {
            el.style.position = el.dataset.previousPosition;
            delete el.dataset.previousPosition;
          }

          if (animation.parentNode?.parentNode === el) {
            // eslint-disable-next-line unicorn/prefer-dom-node-remove
            el.removeChild(animation.parentNode);
          }
        }, 300);
      }, delay);
    }
  },
};

function lastElement<T>(arr: T[]): T | undefined {
  // eslint-disable-next-line unicorn/prefer-at
  return arr[arr.length - 1];
}

function isRippleEnabled(value: any): value is true {
  return typeof value === "undefined" || Boolean(value);
}

function rippleShow(event: RippleEvent) {
  const value: RippleOptions = {};
  const element = event.currentTarget as RippleElement | undefined;

  if (!element?._ripple || element._ripple.touched || event[stopSymbol]) return;

  // Don't allow the event to trigger ripples on any other elements
  event[stopSymbol] = true;

  if (isTouchEvent(event)) {
    element._ripple.touched = true;
    element._ripple.isTouch = true;
  } else {
    // It's possible for touch events to fire
    // as mouse events on Android/iOS, this
    // will skip the event call if it has
    // already been registered as touch
    if (element._ripple.isTouch) return;
  }

  value.center = element._ripple.centered || isKeyboardEvent(event);
  if (element._ripple.class) {
    value.class = element._ripple.class;
  }

  if (isTouchEvent(event)) {
    // already queued that shows or hides the ripple
    if (element._ripple.showTimerCommit) return;

    element._ripple.showTimerCommit = () => {
      ripples.show(event, element, value);
    };
    element._ripple.showTimer = window.setTimeout(() => {
      if (element?._ripple?.showTimerCommit) {
        element._ripple.showTimerCommit();
        element._ripple.showTimerCommit = null;
      }
    }, DELAY_RIPPLE);
  } else {
    ripples.show(event, element, value);
  }
}

function rippleStop(event: RippleEvent) {
  event[stopSymbol] = true;
}

function rippleHide(event: Event) {
  const element = event.currentTarget as RippleElement | null;
  if (!element?._ripple) return;

  window.clearTimeout(element._ripple.showTimer);

  // The touch interaction occurs before the show timer is triggered.
  // We still want to show ripple effect.
  if (event.type === "touchend" && element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit();
    element._ripple.showTimerCommit = null;

    // re-queue ripple hiding
    element._ripple.showTimer = window.setTimeout(() => {
      rippleHide(event);
    });
    return;
  }

  window.setTimeout(() => {
    if (element._ripple) {
      element._ripple.touched = false;
    }
  });
  ripples.hide(element);
}

function rippleCancelShow(event: MouseEvent | TouchEvent) {
  const element = event.currentTarget as RippleElement | undefined;

  if (!element?._ripple) return;

  if (element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit = null;
  }

  window.clearTimeout(element._ripple.showTimer);
}

let keyboardRipple = false;

function keyboardRippleShow(event: KeyboardEvent) {
  if (
    !keyboardRipple &&
    (event.keyCode === keyCodes.enter || event.keyCode === keyCodes.space)
  ) {
    keyboardRipple = true;
    rippleShow(event);
  }
}

function keyboardRippleHide(event: KeyboardEvent) {
  keyboardRipple = false;
  rippleHide(event);
}

function focusRippleHide(event: FocusEvent) {
  if (keyboardRipple) {
    keyboardRipple = false;
    rippleHide(event);
  }
}

function updateRipple(
  el: RippleElement,
  binding: RippleDirectiveBinding,
  wasEnabled: boolean,
) {
  const { value, modifiers } = binding;
  const enabled = isRippleEnabled(value);
  if (!enabled) {
    ripples.hide(el);
  }

  el._ripple = el._ripple ?? {};
  el._ripple.enabled = enabled;
  el._ripple.centered = modifiers.center;
  el._ripple.circle = modifiers.circle;

  if (isObject(value) && value.class) {
    el._ripple.class = value.class;
  }

  if (enabled && !wasEnabled) {
    if (modifiers.stop) {
      el.addEventListener("touchstart", rippleStop, { passive: true });
      el.addEventListener("mousedown", rippleStop);
      return;
    }

    el.addEventListener("touchstart", rippleShow, { passive: true });
    el.addEventListener("touchend", rippleHide, { passive: true });
    el.addEventListener("touchmove", rippleCancelShow, { passive: true });
    el.addEventListener("touchcancel", rippleHide);

    el.addEventListener("mousedown", rippleShow);
    el.addEventListener("mouseup", rippleHide);
    el.addEventListener("mouseleave", rippleHide);

    el.addEventListener("keydown", keyboardRippleShow);
    el.addEventListener("keyup", keyboardRippleHide);

    el.addEventListener("blur", focusRippleHide);

    // Anchor tags can be dragged, causes other hides to fail - #1537
    el.addEventListener("dragstart", rippleHide, { passive: true });
  } else if (!enabled && wasEnabled) {
    removeListeners(el);
  }
}

function removeListeners(el: HTMLElement) {
  // Remove event listeners for mouse and touch events
  el.removeEventListener("mousedown", rippleShow);
  el.removeEventListener("touchstart", rippleShow);
  el.removeEventListener("mouseup", rippleHide);
  el.removeEventListener("mouseleave", rippleHide);

  // Remove event listeners for touch events and keyboard events
  el.removeEventListener("touchend", rippleHide);
  el.removeEventListener("touchmove", rippleCancelShow);
  el.removeEventListener("touchcancel", rippleHide);
  el.removeEventListener("keydown", keyboardRippleShow);
  el.removeEventListener("keyup", keyboardRippleHide);

  // Remove event listeners for drag and focus events
  el.removeEventListener("dragstart", rippleHide);
  el.removeEventListener("blur", focusRippleHide);
}

function mounted(el: RippleElement, binding: RippleDirectiveBinding) {
  updateRipple(el, binding, false);
}

function unmounted(el: RippleElement) {
  delete el._ripple;
  removeListeners(el);
}

function updated(el: RippleElement, binding: RippleDirectiveBinding) {
  if (binding.value === binding.oldValue) {
    return;
  }

  const wasEnabled = isRippleEnabled(binding.oldValue);
  updateRipple(el, binding, wasEnabled);
}

export const Ripple = {
  mounted,
  unmounted,
  updated,
};

export default Ripple;
