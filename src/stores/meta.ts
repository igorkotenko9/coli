import { ref } from "vue";

import { defineStore } from "pinia";

export const useMetaStore = defineStore("meta", () => {
  const meta = ref<Record<string, unknown>>({});

  const setMeta = (payload: Record<string, unknown>) => {
    meta.value = { ...payload };
  };

  const addMeta = (payload: Record<string, unknown>) => {
    if (meta.value) {
      meta.value = { ...meta.value, ...payload };
    }
  };

  const clearMeta = () => {
    meta.value = {};
  };

  return { meta, clearMeta, setMeta, addMeta };
});
