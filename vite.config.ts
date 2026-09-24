import { URL, fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/", import.meta.url)),
      "@fields": fileURLToPath(
        new URL("./src/components/fields", import.meta.url),
      ),
      "@components": fileURLToPath(
        new URL("./src/components/", import.meta.url),
      ),
      "@router": fileURLToPath(new URL("./src/router/", import.meta.url)),
      "@views": fileURLToPath(new URL("./src/views/", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets/", import.meta.url)),
      "@static": fileURLToPath(new URL("./src/static/", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils/index.ts", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/services/", import.meta.url)),
      "@hooks": fileURLToPath(new URL("./src/hooks/", import.meta.url)),
      "@types": fileURLToPath(new URL("./src/types/index.ts", import.meta.url)),
      "@constants": fileURLToPath(
        new URL("./src/constants/index.ts", import.meta.url),
      ),
      "@style/mixins": fileURLToPath(
        new URL("./src/assets/styles/mixins/index.scss", import.meta.url),
      ),
      "@style/utility-classes": fileURLToPath(
        new URL("./src/assets/styles/utility-classes/", import.meta.url),
      ),
      "@style/animations": fileURLToPath(
        new URL("./src/assets/styles/animations/", import.meta.url),
      ),
      "@style/variables": fileURLToPath(
        new URL("./src/assets/styles/variables/index.scss", import.meta.url),
      ),
    },
  },
});
