<template>
  <div class="library-page py-4">
    <h2 class="fw-bold mb-4">Minha Estante</h2>

    <div
      v-if="currentlyReading"
      class="card border-0 shadow-sm rounded-4 p-4 mb-5 position-relative overflow-hidden d-flex flex-row gap-4 reading-hero"
    >
      <div class="hero-bg-blur"></div>
      <div class="position-relative">
        <div class="hero-book-cover" :style="{ backgroundImage: `url('${currentlyReading.book.cover_url}')` }"></div>
      </div>
      <div class="flex-fill d-flex flex-column justify-content-center position-relative">
        <div class="badge rounded-pill d-inline-flex align-items-center gap-2 mb-3 align-self-start status-badge">
          <div class="pulse-dot"></div> LENDO AGORA
        </div>
        <h1 class="fw-bold fs-2 mb-1">{{ currentlyReading.book.title }}</h1>
        <p class="text-secondary fs-5">{{ currentlyReading.book.author }}</p>
        <div class="progress mt-4 mb-2" style="height: 10px">
          <div class="progress-bar" :style="{ width: currentlyReadingProgress + '%', background: 'var(--brand-gradient)' }"></div>
        </div>
        <div class="d-flex justify-content-between fw-semibold text-secondary">
          <span>{{ currentlyReadingProgress }}% Concluído</span>
          <span>{{ currentlyReading.current_page }} / {{ currentlyReading.total_pages || "?" }} Páginas</span>
        </div>

        <div v-if="!editingProgress" class="d-flex gap-3 mt-3">
          <button class="btn btn-dark rounded-pill" @click="toggleProgressEdit">📝 Atualizar</button>
        </div>
        <div v-else class="d-flex gap-2 mt-3 align-items-center">
          <input type="number" min="0" class="form-control" style="max-width: 140px" v-model="progressInput" />
          <button class="btn btn-dark rounded-pill" @click="saveProgress">Salvar</button>
          <button class="btn btn-outline-secondary rounded-pill" @click="editingProgress = false">Cancelar</button>
        </div>
      </div>
    </div>
    <p v-else-if="!userBooksStore.loading" class="text-secondary mb-5">Nenhum livro em leitura no momento.</p>

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <ul class="nav nav-pills gap-2 bg-white p-1 rounded-pill shadow-sm">
        <li class="nav-item" v-for="filter in filters" :key="filter">
          <a
            href="#"
            class="nav-link rounded-pill filter-pill"
            :class="{ active: activeFilter === filter }"
            @click.prevent="activeFilter = filter"
          >
            {{ filter }}
          </a>
        </li>
      </ul>

      <div class="d-flex align-items-center gap-2">
        <input type="text" v-model="search" placeholder="Buscar na estante..." class="form-control rounded-pill" />
        <button class="btn rounded-pill fw-bold text-white text-nowrap btn-add-manual" @click="openModal">
          <span class="fs-5">+</span> Novo Livro
        </button>
      </div>
    </div>

    <p v-if="userBooksStore.loading" class="text-secondary">Carregando estante...</p>
    <p v-else-if="userBooksStore.error" class="text-danger">{{ userBooksStore.error }}</p>
    <p v-else-if="filteredShelf.length === 0" class="text-secondary">Nenhum livro nessa categoria ainda.</p>

    <div v-else class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div v-for="item in filteredShelf" :key="item.id" class="col">
        <div class="card border-0 p-3 position-relative shelf-book">
          <div
            class="rounded-3 shadow-sm mb-3 d-flex align-items-center justify-content-center text-white fw-bold text-center p-2 shelf-cover"
            :style="item.book.cover_url ? { backgroundImage: `url('${item.book.cover_url}')` } : { background: coverGradient(item.id) }"
          >
            <span v-if="!item.book.cover_url">{{ item.book.title }}</span>
          </div>
          <h4 class="fs-6 mb-1">{{ item.book.title }}</h4>
          <p class="text-secondary small">{{ item.book.author }}</p>

          <template v-if="item.total_pages">
            <div class="progress" style="height: 4px">
              <div class="progress-bar" :style="{ width: shelfProgress(item) + '%', background: '#10B981' }"></div>
            </div>
            <small class="mt-1" style="color: #10B981">{{ shelfProgress(item) }}% Lido</small>
          </template>
          <template v-else>
            <span class="badge bg-light text-secondary fw-normal">📅 {{ STATUS_LABELS[item.status] }}</span>
          </template>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      :class="{ show: showModal }"
      :style="{ display: showModal ? 'block' : 'none' }"
      tabindex="-1"
      @click.self="closeModal"
    >
      <div class="modal-dialog">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Adicionar Livro à Estante</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Buscar livro no catálogo</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="bookQuery"
                  placeholder="Título ou autor..."
                  @keyup.enter="searchBooks"
                />
                <button class="btn btn-outline-secondary" @click="searchBooks">Buscar</button>
              </div>
            </div>

            <ul v-if="!selectedBook && booksStore.books.length > 0" class="list-group mb-3">
              <li
                v-for="book in booksStore.books"
                :key="book.id"
                class="list-group-item list-group-item-action"
                role="button"
                @click="selectedBook = book"
              >
                <strong>{{ book.title }}</strong> — {{ book.author }}
              </li>
            </ul>

            <div v-if="selectedBook" class="alert alert-light d-flex justify-content-between align-items-center">
              <span><strong>{{ selectedBook.title }}</strong> — {{ selectedBook.author }}</span>
              <button class="btn btn-sm btn-link" @click="selectedBook = null">Trocar</button>
            </div>

            <div class="mb-1">
              <label class="form-label fw-semibold">Status</label>
              <select class="form-select" v-model="newStatus">
                <option value="quero_ler">Quero Ler</option>
                <option value="lendo">Lendo</option>
                <option value="lido">Lido</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-light rounded-pill" @click="closeModal">Cancelar</button>
            <button class="btn rounded-pill text-white btn-save" @click="addNewBook">Salvar na Estante</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ show: showModal }" v-if="showModal"></div>
  </div>
</template>

<script>
import { useUserBooksStore } from "../../stores/userBooks";
import { useBooksStore } from "../../stores/books";

const GRADIENTS = [
  "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
];

const STATUS_LABELS = {
  quero_ler: "Quero Ler",
  lendo: "Lendo",
  lido: "Lido",
};

export default {
  name: "Library",
  data() {
    return {
      activeFilter: "Todos",
      filters: ["Todos", "Quero Ler", "Lidos"],
      search: "",
      showModal: false,
      bookQuery: "",
      selectedBook: null,
      newStatus: "quero_ler",
      editingProgress: false,
      progressInput: 0,
      STATUS_LABELS,
    };
  },
  computed: {
    userBooksStore() {
      return useUserBooksStore();
    },
    booksStore() {
      return useBooksStore();
    },
    filteredShelf() {
      const shelf = this.userBooksStore.shelf;
      if (this.activeFilter === "Quero Ler") return shelf.filter((item) => item.status === "quero_ler");
      if (this.activeFilter === "Lidos") return shelf.filter((item) => item.status === "lido");
      return shelf;
    },
    currentlyReading() {
      return this.userBooksStore.shelf.find((item) => item.status === "lendo") || null;
    },
    currentlyReadingProgress() {
      return this.shelfProgress(this.currentlyReading);
    },
  },
  created() {
    this.userBooksStore.fetchShelf();
  },
  methods: {
    shelfProgress(item) {
      if (!item || !item.total_pages) return 0;
      return Math.round((item.current_page / item.total_pages) * 100);
    },
    coverGradient(id) {
      return GRADIENTS[id % GRADIENTS.length];
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.bookQuery = "";
      this.selectedBook = null;
      this.newStatus = "quero_ler";
    },
    async searchBooks() {
      await this.booksStore.search({ q: this.bookQuery });
    },
    async addNewBook() {
      if (!this.selectedBook) {
        alert("Escolha um livro na busca antes de salvar.");
        return;
      }

      try {
        await this.userBooksStore.addBook({ bookId: this.selectedBook.id, status: this.newStatus });
        this.closeModal();
      } catch (error) {
        alert(error.response?.data?.errors?.join(", ") || "Não foi possível adicionar o livro.");
      }
    },
    toggleProgressEdit() {
      if (!this.currentlyReading) return;
      this.progressInput = this.currentlyReading.current_page;
      this.editingProgress = true;
    },
    async saveProgress() {
      await this.userBooksStore.updateProgress(this.currentlyReading.id, { currentPage: Number(this.progressInput) });
      this.editingProgress = false;
    },
  },
};
</script>
