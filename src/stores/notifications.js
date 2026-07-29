import { defineStore } from "pinia";
import api from "../axios";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/api/v1/notifications");
        this.notifications = response.data;
      } catch {
        this.error = "Não foi possível carregar as notificações. Tente novamente.";
      } finally {
        this.loading = false;
      }
    },

    async markAllRead() {
      await api.patch("/api/v1/notifications/mark_all_read");
      this.notifications = this.notifications.map((notification) => ({ ...notification, read: true }));
    },
  },
});
