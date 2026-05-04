import { type Ref, ref } from "vue";

import { useNavigatorLanguage } from "@vueuse/core";
import Bowser from "bowser";

export interface BrowserInfo extends Bowser.Parser.ParsedResult {
  isMobile: boolean;
  language: Ref<string | undefined>;
}

export function useBrowserInfo() {
  const { language } = useNavigatorLanguage();

  const isMobile = Boolean(
    window.document && "ontouchstart" in window.document.documentElement,
  );

  const ua = navigator.userAgent;

  const parsedResult = Bowser.parse(ua);

  const browserInfo = ref<BrowserInfo>({
    language,
    isMobile,
    ...parsedResult,
  });

  return browserInfo;
}

export type UseBrowserInfoReturn = ReturnType<typeof useBrowserInfo>;
