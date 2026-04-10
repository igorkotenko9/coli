<template>
  <div class="app">
    <div id="overlays" class="app__overlays">
      <TransitionGroup name="app__item-">
        <VLoader v-if="isLoading" class="app__item app__plug" />

        <template v-else>
          <div class="app__navbar-wrapper app__menu"><TopNavbar /></div>

          <RouterView v-slot="{ Component }">
            <component :is="Component" class="app__page app__item" />
          </RouterView>
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { RouterView, useRouter } from "vue-router";

import TopNavbar from "@components/TopNavbar/TopNavbar.vue";
import VLoader from "@components/loaders/VLoader/VLoader.vue";

const router = useRouter();

const isRouterReady = ref<boolean>(false);
const isLoading = computed<boolean>(() => Boolean(!isRouterReady.value));

onBeforeMount(async () => {
  await router.isReady();
  isRouterReady.value = true;
});
</script>

<style scoped lang="scss">
@use "@style/variables" as vars;

.app {
  position: relative;

  display: grid;
  grid-template-columns: auto minmax(0, 1fr);

  min-height: 100vh;

  &__menu {
    position: sticky;
    top: 0;
    z-index: vars.$z-index-page-loader;
  }

  &__item {
    padding: 32px;
  }

  &__overlays {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: vars.$z-index-overlay;

    background-color: var(--app-color-background);
  }
}
</style>
