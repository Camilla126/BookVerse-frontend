import { defineStore } from "pinia";
import api from "../axios";

export const useLikesStore = defineStore("likes", {
  actions: {
    async like(likeableType, likeableId) {
      const response = await api.post("/api/v1/likes", {
        like: { likeable_type: likeableType, likeable_id: likeableId },
      });
      return response.data;
    },

    async unlike(likeId) {
      await api.delete(`/api/v1/likes/${likeId}`);
    },
  },
});
