import { defineStore } from "pinia";
import api from "../axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("user_token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setSession(token, user) {
      this.token = token;
      this.user = user || null;
      localStorage.setItem("user_token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
    },

    clearSession() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("user_token");
      localStorage.removeItem("user");
    },

    async login(credentials) {
      const response = await api.post("/api/v1/authentication/login", credentials);
      this.setSession(response.data.token, response.data.user);
    },

    async register({ name, email, password }) {
      const response = await api.post("/api/v1/authentication/register", {
        user: { name, email, password },
      });
      this.setSession(response.data.token, response.data.user);
    },

    async logout() {
      try {
        await api.delete("/api/v1/authentication/logout");
      } finally {
        this.clearSession();
      }
    },
  },
});
