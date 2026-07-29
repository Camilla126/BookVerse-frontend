import { defineStore } from "pinia";
import api from "../axios";

export const useFollowStore = defineStore("follow", {
  actions: {
    async follow(userId) {
      await api.post(`/api/v1/users/${userId}/follow`);
    },

    async unfollow(userId) {
      await api.delete(`/api/v1/users/${userId}/follow`);
    },

    async fetchFollowers(userId) {
      const response = await api.get(`/api/v1/users/${userId}/followers`);
      return response.data;
    },
  },
});
