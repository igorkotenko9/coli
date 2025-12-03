<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img class="logo" alt="Vite logo" src="/vite.svg" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img class="logo vue" alt="Vue logo1" src="./assets/vue.svg" />
    </a>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;

  transition: filter 300ms;

  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
