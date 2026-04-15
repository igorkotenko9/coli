export function getNextElement(
  elements: HTMLElement[],
  location?: "next" | "prev",
  condition?: (el: HTMLElement) => boolean,
) {
  let _el;
  let idx = elements.indexOf(document.activeElement as HTMLElement);
  const inc = location === "next" ? 1 : -1;
  do {
    idx += inc;
    _el = elements[idx];
  } while (
    (!_el || _el.offsetParent == null || !(condition?.(_el) ?? true)) &&
    idx < elements.length &&
    idx >= 0
  );
  return _el;
}

export function focusableChildren(el: Element, filterByTabIndex = true) {
  const targets = [
    "button",
    "[href]",
    'input:not([type="hidden"])',
    "select",
    "textarea",
    "[tabindex]",
  ]
    .map(
      (s) =>
        `${s}${
          filterByTabIndex ? ':not([tabindex="-1"])' : ""
        }:not([disabled])`,
    )
    .join(", ");
  return [...el.querySelectorAll(targets)] as HTMLElement[];
}

export function focusChild(
  el: Element,
  location?: "first" | "last" | "next" | "prev" | number,
) {
  const focusable = focusableChildren(el);

  if (!location) {
    if (el === document.activeElement || !el.contains(document.activeElement)) {
      focusable[0]?.focus();
    }
  } else if (location === "first") {
    focusable[0]?.focus();
  } else if (location === "last") {
    lastElement(focusable)?.focus();
  } else if (typeof location === "number") {
    focusable[location]?.focus();
  } else {
    const _el = getNextElement(focusable, location);
    if (_el) _el.focus();
    else focusChild(el, location === "next" ? "first" : "last");
  }
}

function lastElement<T>(arr: T[]): T | undefined {
  // eslint-disable-next-line unicorn/prefer-at
  return arr[arr.length - 1];
}
