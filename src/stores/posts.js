import { defineStore } from "pinia";
import api from "../axios";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchFeed() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/api/v1/feed");
        this.posts = response.data;
      } catch {
        this.error = "Não foi possível carregar o feed. Tente novamente.";
      } finally {
        this.loading = false;
      }
    },

    async createPost({ kind, content, bookId } = {}) {
      const response = await api.post("/api/v1/posts", {
        post: { kind, content, book_id: bookId },
      });
      this.posts.unshift(response.data);
      return response.data;
    },

    async addComment(postId, content) {
      const response = await api.post(`/api/v1/posts/${postId}/comments`, {
        comment: { content },
      });

      const post = this.posts.find((item) => item.id === postId);
      if (post) post.comments_count += 1;

      return response.data;
    },

    incrementLikes(postId, delta) {
      const post = this.posts.find((item) => item.id === postId);
      if (post) post.likes_count += delta;
    },
  },
});
