import { defineStore } from "pinia";
import api from "../axios";

export const useReviewsStore = defineStore("reviews", {
  actions: {
    async createReview({ bookId, rating, content }) {
      const response = await api.post("/api/v1/reviews", {
        review: { book_id: bookId, rating, content },
      });
      return response.data;
    },
  },
});
