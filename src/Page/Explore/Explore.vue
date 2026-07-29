<template>
  <div class="explore-page py-4">
    <div class="card border-0 rounded-5 shadow-sm p-5 text-center position-relative overflow-hidden mb-5 explore-hero">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <div class="position-relative">
        <h1 class="fw-bold display-6">Descubra sua próxima obsessão</h1>
        <p class="text-secondary mt-2 fs-5">Explore milhões de histórias, livros e autores independentes.</p>

        <div class="input-group input-group-lg rounded-pill overflow-hidden shadow-sm mx-auto mt-4 search-wrapper" style="max-width: 700px">
          <span class="input-group-text bg-white border-0">🔍</span>
          <input
            type="text"
            class="form-control border-0"
            v-model="searchQuery"
            placeholder="Títulos, autores, gêneros ou tags..."
            @keyup.enter="runSearch"
          />
          <button class="btn btn-dark px-4" @click="runSearch">Buscar</button>
        </div>

        <div class="d-flex gap-2 justify-content-center flex-wrap mt-4">
          <span class="fw-semibold small text-secondary">Tendências:</span>
          <span v-for="trend in trends" :key="trend" class="badge rounded-pill bg-white bg-opacity-75 text-dark fw-normal small trend-tag">
            {{ trend }}
          </span>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-end mb-4">
      <h2 class="fw-bold">Navegue por Gênero</h2>
      <a href="#" class="fw-bold small text-decoration-none" style="color: var(--primary-color)">Ver todos</a>
    </div>

    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 mb-5">
      <div v-for="genre in genres" :key="genre.name" class="col">
        <div
          class="genre-card rounded-4 p-3 text-white shadow d-flex flex-column justify-content-between"
          :class="genre.class"
          role="button"
          @click="filterByGenre(genre.name)"
        >
          <span class="fw-bold fs-6">{{ genre.name }}</span>
          <span class="fs-3 align-self-end opacity-75">{{ genre.icon }}</span>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-end mb-4 mt-5">
      <h2 class="fw-bold">{{ activeGenre ? `Gênero: ${activeGenre}` : "Catálogo" }}</h2>
      <button v-if="activeGenre || searchQuery" class="btn btn-link btn-sm text-decoration-none" @click="clearFilters">
        Limpar filtros
      </button>
    </div>

    <p v-if="booksStore.loading" class="text-secondary">Carregando livros...</p>
    <p v-else-if="booksStore.error" class="text-danger">{{ booksStore.error }}</p>
    <p v-else-if="booksStore.books.length === 0" class="text-secondary">Nenhum livro encontrado.</p>

    <div v-else class="d-flex gap-4 overflow-auto pb-3 mb-5 ranking-container">
      <div v-for="(book, i) in booksStore.books" :key="book.id" class="position-relative rank-item">
        <div class="rank-number" :style="i === 0 ? { color: 'rgba(255, 215, 0, 0.4)', WebkitTextStroke: 0 } : {}">
          {{ i + 1 }}
        </div>
        <div class="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row gap-3 align-items-center position-relative rank-card">
          <div class="rank-cover flex-shrink-0" :style="{ backgroundImage: `url('${book.cover_url}')` }"></div>
          <div>
            <h4 class="fs-6 fw-bold mb-1">{{ book.title }}</h4>
            <span class="small text-secondary">{{ book.author }}</span>
            <span v-if="book.genre" class="d-block small fw-bold mt-1" style="color: #10B981">{{ book.genre }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-end mb-4">
      <h2 class="fw-bold">Autores para Ficar de Olho</h2>
    </div>

    <div class="d-flex gap-3 overflow-auto pb-3">
      <div v-for="author in authors" :key="author.name" class="card border-0 shadow-sm rounded-4 p-3 text-center flex-shrink-0 author-bubble" style="min-width: 160px">
        <img :src="author.avatar" class="rounded-circle mx-auto mb-2 ab-img" />
        <div class="fw-bold small">{{ author.name }}</div>
        <div class="text-secondary small">{{ author.genre }}</div>
        <button class="btn btn-outline-secondary btn-sm rounded-pill mt-2 ab-btn">Seguir</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useBooksStore } from "../../stores/books";

export default {
  name: "Explore",
  data() {
    return {
      searchQuery: "",
      activeGenre: "",
      trends: ["🔥 #RomanceDark", "🚀 #Cyberpunk", "🏆 #VencedoresWattys"],
      genres: [
        { name: "Romance", icon: "💘", class: "g-romance" },
        { name: "Sci-Fi", icon: "🛸", class: "g-scifi" },
        { name: "Fantasia", icon: "🐉", class: "g-fantasy" },
        { name: "Terror", icon: "👻", class: "g-horror" },
        { name: "Suspense", icon: "🕵️", class: "g-thriller" },
      ],
      authors: [
        { name: "Marina Souza", genre: "Romance Histórico", avatar: "https://i.pravatar.cc/150?img=32" },
        { name: "Carlos Lima", genre: "Cyberpunk", avatar: "https://i.pravatar.cc/150?img=11" },
        { name: "Ana Clara", genre: "Poesia", avatar: "https://i.pravatar.cc/150?img=5" },
        { name: "John Doe", genre: "Mistério", avatar: "https://i.pravatar.cc/150?img=59" },
      ],
    };
  },
  computed: {
    booksStore() {
      return useBooksStore();
    },
  },
  created() {
    this.booksStore.search();
  },
  methods: {
    runSearch() {
      this.activeGenre = "";
      this.booksStore.search({ q: this.searchQuery });
    },
    filterByGenre(genre) {
      this.searchQuery = "";
      this.activeGenre = genre;
      this.booksStore.search({ genre });
    },
    clearFilters() {
      this.searchQuery = "";
      this.activeGenre = "";
      this.booksStore.search();
    },
  },
};
</script>
