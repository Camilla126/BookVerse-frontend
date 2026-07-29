import { defineStore } from "pinia";
import api from "../axios";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profile: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOwnProfile() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/api/v1/users/profile");
        this.profile = response.data;
      } catch {
        this.error = "Não foi possível carregar o perfil. Tente novamente.";
      } finally {
        this.loading = false;
      }
    },

    async updateOwnProfile(fields) {
      const response = await api.patch("/api/v1/users/profile", { user: fields });
      this.profile = response.data;
      return response.data;
    },

    async fetchPublicProfile(handle) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/api/v1/profiles/${handle}`);
        this.profile = response.data;
      } catch {
        this.error = "Perfil não encontrado.";
      } finally {
        this.loading = false;
      }
    },
  },
});
