<template>
  <div class="app">
    <div id="overlays" class="app_overlays">
      <div v-if="isLoading">Loading...</div>
      <template v-else>
        <RouterView v-slot="{ Component }">
          <component :is="Component" class="app__page app__item" /> </RouterView
      ></template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { RouterView, useRouter } from "vue-router";

const router = useRouter();

const isRouterReady = ref<boolean>(false);
const isLoading = computed<boolean>(() => Boolean(!isRouterReady.value));

onBeforeMount(async () => {
  await router.isReady();
  isRouterReady.value = true;
});
</script>

<style scoped lang="scss">
.app {
  position: relative;

  display: grid;
  grid-template-columns: auto minmax(0, 1fr);

  min-height: 100vh;

  background-color: var(--app-color-background);

  &__overlays {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10000;
  }
}
</style>
