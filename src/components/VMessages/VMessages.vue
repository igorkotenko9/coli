<template>
  <div class="v-messages">
    <div ref="innerRef" class="v-messages__inner">
      <div
        v-for="(message, i) in messages"
        :key="getMessageKey(message, i)"
        class="v-messages__message"
      >
        <slot :message="message">
          {{ message }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from "vue";

defineProps({
  messages: {
    type: [String, Array] as PropType<null | string | string[]>,
  },
});

const getMessageKey = (message: string, i: number): string => `${i}-${message}`;
</script>

<style scoped lang="scss">
.v-messages {
  --message-padding-top: var(--v-messages-message-padding-top, 4px);
  --message-text-wrap: var(--v-messages-message-text-wrap, balance);

  position: relative;

  min-width: 1px;

  overflow: hidden;

  &__message {
    padding-top: var(--message-padding-top);

    text-wrap: var(--message-text-wrap);
    overflow-wrap: anywhere;
  }
}
</style>
