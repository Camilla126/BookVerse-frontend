import { defineStore } from "pinia";
import api from "../axios";

export const useBooksStore = defineStore("books", {
  state: () => ({
    books: [],
    loading: false,
    error: null,
  }),

  actions: {
    async search({ q = "", genre = "" } = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/api/v1/books", { params: { q, genre } });
        this.books = response.data;
      } catch {
        this.error = "Não foi possível carregar os livros. Tente novamente.";
      } finally {
        this.loading = false;
      }
    },
  },
});
