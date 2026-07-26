<template>
  <div class="library-page py-4">
    <h2 class="fw-bold mb-4">Minha Estante</h2>

    <div class="card border-0 shadow-sm rounded-4 p-4 mb-5 position-relative overflow-hidden d-flex flex-row gap-4 reading-hero">
      <div class="hero-bg-blur"></div>
      <div class="position-relative">
        <div class="hero-book-cover" :style="{ backgroundImage: `url('${currentlyReading.cover}')` }"></div>
      </div>
      <div class="flex-fill d-flex flex-column justify-content-center position-relative">
        <div class="badge rounded-pill d-inline-flex align-items-center gap-2 mb-3 align-self-start status-badge">
          <div class="pulse-dot"></div> LENDO AGORA
        </div>
        <h1 class="fw-bold fs-2 mb-1">{{ currentlyReading.title }}</h1>
        <p class="text-secondary fs-5">{{ currentlyReading.author }}</p>
        <div class="progress mt-4 mb-2" style="height: 10px">
          <div class="progress-bar" :style="{ width: currentlyReading.progress + '%', background: 'var(--brand-gradient)' }"></div>
        </div>
        <div class="d-flex justify-content-between fw-semibold text-secondary">
          <span>{{ currentlyReading.progress }}% Concluído</span>
          <span>{{ currentlyReading.currentPage }} / {{ currentlyReading.totalPages }} Páginas</span>
        </div>
        <div class="d-flex gap-3 mt-3">
          <button class="btn btn-dark rounded-pill">📝 Atualizar</button>
          <button class="btn btn-outline-secondary rounded-pill">Detalhes</button>
        </div>
      </div>
    </div>

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
        <button class="btn rounded-pill fw-bold text-white text-nowrap btn-add-manual" @click="showModal = true">
          <span class="fs-5">+</span> Novo Livro
        </button>
      </div>
    </div>

    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div v-for="book in filteredShelf" :key="book.id" class="col">
        <div class="card border-0 p-3 position-relative shelf-book">
          <div class="position-absolute top-0 end-0 m-2 text-secondary">⋮</div>
          <div
            class="rounded-3 shadow-sm mb-3 d-flex align-items-center justify-content-center text-white fw-bold text-center p-2 shelf-cover"
            :style="book.cover ? { backgroundImage: `url('${book.cover}')` } : { background: book.gradient }"
          >
            <span v-if="!book.cover">{{ book.title }}</span>
          </div>
          <h4 class="fs-6 mb-1">{{ book.title }}</h4>
          <p class="text-secondary small">{{ book.author }}</p>

          <template v-if="book.progress !== undefined">
            <div class="progress" style="height: 4px">
              <div class="progress-bar" :style="{ width: book.progress + '%', background: '#10B981' }"></div>
            </div>
            <small class="mt-1" style="color: #10B981">{{ book.progress }}% Lido</small>
          </template>
          <template v-else>
            <span class="badge bg-light text-secondary fw-normal">📅 {{ book.status }}</span>
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
            <h5 class="modal-title fw-bold">Adicionar Livro Manualmente</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Título do Livro</label>
              <input type="text" class="form-control" v-model="newBook.title" placeholder="Ex: O Senhor dos Anéis" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Autor</label>
              <input type="text" class="form-control" v-model="newBook.author" placeholder="Ex: J.R.R. Tolkien" />
            </div>

            <div class="row g-3 mb-3">
              <div class="col">
                <label class="form-label fw-semibold">Páginas</label>
                <input type="number" class="form-control" v-model="newBook.pages" placeholder="0" />
              </div>
              <div class="col">
                <label class="form-label fw-semibold">Status</label>
                <select class="form-select" v-model="newBook.status">
                  <option>Quero Ler</option>
                  <option>Lendo</option>
                  <option>Lido</option>
                </select>
              </div>
            </div>

            <div class="mb-1">
              <label class="form-label fw-semibold">URL da Capa (Opcional)</label>
              <input type="text" class="form-control" v-model="newBook.cover" placeholder="https://..." />
              <small class="text-secondary">Deixe em branco para capa automática.</small>
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
const GRADIENTS = [
  "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
];

export default {
  name: "Library",
  data() {
    return {
      activeFilter: "Todos",
      filters: ["Todos", "Quero Ler", "Lidos"],
      search: "",
      showModal: false,
      currentlyReading: {
        title: "O Leitor",
        author: "Bernhard Schlink",
        progress: 75,
        currentPage: 140,
        totalPages: 210,
        cover:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
      },
      shelf: [
        {
          id: 1,
          title: "Duna",
          author: "Frank Herbert",
          progress: 20,
          cover:
            "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400",
        },
        {
          id: 2,
          title: "Clean Code",
          author: "Robert C. Martin",
          progress: 45,
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
      ],
      newBook: { title: "", author: "", pages: "", status: "Quero Ler", cover: "" },
      nextId: 3,
    };
  },
  computed: {
    filteredShelf() {
      if (this.activeFilter === "Todos") return this.shelf;
      if (this.activeFilter === "Lidos") return this.shelf.filter((b) => b.status === "Lido");
      if (this.activeFilter === "Quero Ler") return this.shelf.filter((b) => b.status === "Quero Ler");
      return this.shelf;
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    addNewBook() {
      if (!this.newBook.title) {
        alert("Digite o título!");
        return;
      }

      this.shelf.push({
        id: this.nextId++,
        title: this.newBook.title,
        author: this.newBook.author,
        status: this.newBook.status,
        cover: this.newBook.cover || null,
        gradient: this.newBook.cover ? undefined : GRADIENTS[this.shelf.length % GRADIENTS.length],
      });

      this.newBook = { title: "", author: "", pages: "", status: "Quero Ler", cover: "" };
      this.closeModal();
    },
  },
};
</script>
