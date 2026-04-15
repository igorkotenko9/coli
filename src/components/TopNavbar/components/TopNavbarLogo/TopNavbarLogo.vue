<template>
  <a class="aside-navbar-logo" href="/">
    <VImage
      class="aside-navbar-logo__icon"
      src="../src/images/icons/logo.png"
    />
    <Transition name="aside-navbar-logo__text-">
      <div v-if="isShowText" class="aside-navbar-logo__text">
        Технологический портал ДИТ
      </div>
    </Transition>
  </a>
</template>

<script setup lang="ts">
import VImage from "@components/VImage";

defineProps({
  isShowText: Boolean,
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

.aside-navbar-logo {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;

  padding-block: 12px;
  padding-inline: 18px;

  background-color: var(--menu-item-color);
  box-shadow: 1px 0 1px 0 var(--app-color-black);

  @include mixins.subtitle-1;

  &__icon {
    flex-shrink: 0;

    width: 100px;
    height: 50px;
  }

  &__text {
    max-width: 100%;
    max-height: 40px;

    overflow: hidden;
    text-overflow: ellipsis;

    &--enter-active,
    &--leave-active {
      transition-property: opacity, translate;
      transition-duration: var(--app-transition-duration-1);
    }

    &--enter-from,
    &--leave-to {
      opacity: 0;
      translate: 0 10% 0;
    }
  }
}
</style>
