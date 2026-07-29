import { defineStore } from "pinia";
import api from "../axios";

export const useUserBooksStore = defineStore("userBooks", {
  state: () => ({
    shelf: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchShelf() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/api/v1/user_books");
        this.shelf = response.data;
      } catch {
        this.error = "Não foi possível carregar sua estante. Tente novamente.";
      } finally {
        this.loading = false;
      }
    },

    async addBook({ bookId, status }) {
      const response = await api.post("/api/v1/user_books", {
        user_book: { book_id: bookId, status },
      });
      this.shelf.push(response.data);
    },

    async updateProgress(id, { status, currentPage, totalPages } = {}) {
      const userBook = {};
      if (status !== undefined) userBook.status = status;
      if (currentPage !== undefined) userBook.current_page = currentPage;
      if (totalPages !== undefined) userBook.total_pages = totalPages;

      const response = await api.patch(`/api/v1/user_books/${id}`, { user_book: userBook });
      const index = this.shelf.findIndex((item) => item.id === id);
      if (index !== -1) this.shelf[index] = response.data;
    },
  },
});
