import { ref } from "vue";

import { defineStore } from "pinia";

let _uid = 0;

type Notification = {
  errors?:
    | {
        code: number | string;
        message: string;
      }[]
    | null;
  id: string;
  text?: null | string;
  title: string;
  variation: "info" | "negative" | "neutral" | "positive";
};

export const useNotificationsStore = defineStore("notifications", () => {
  const notifications = ref<Notification[]>([]);

  const addNotification = <
    T extends Omit<Notification, "id"> & { id?: string },
  >(
    newNotification: T,
  ) => {
    const uid = _uid++;
    const notificationWithId = {
      ...newNotification,
      id: `notification-${uid}`,
    };

    notifications.value.unshift(notificationWithId);

    if (notifications.value.length > 4) {
      notifications.value.pop();
    }

    setTimeout(() => {
      removeNotification(notificationWithId.id);
    }, 15_000);
  };

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((item) => item.id !== id);
  };

  return { notifications, addNotification, removeNotification };
});
