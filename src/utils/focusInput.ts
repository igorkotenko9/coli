import { useBrowserInfo } from "@hooks/useBrowserInfo";
export const focusInput = (
  element?: HTMLInputElement | HTMLTextAreaElement | null,
) => {
  const browser = useBrowserInfo();
  const isSafari = browser.value.browser.name?.toLowerCase() === "safari";

  if (!element) return;

  if (!isSafari) {
    element.focus();

    return;
  }

  const tmpElement = document.createElement("input");
  tmpElement.style.width = "1px";
  tmpElement.style.height = "1px";
  tmpElement.style.margin = "-1px";
  tmpElement.style.padding = "0";
  tmpElement.style.border = "0";
  tmpElement.style.opacity = "0";
  tmpElement.style.clipPath = "inset(100%)";
  tmpElement.style.position = "absolute";
  if (element.parentElement) {
    element.parentElement.appendChild(tmpElement);
  } else {
    document.body.appendChild(tmpElement);
  }
  tmpElement.focus();

  setTimeout(() => {
    // Focus the main (input) element, thus opening iOS keyboard
    element.focus();

    tmpElement.remove();
  }, 0);
};
