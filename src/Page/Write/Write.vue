<template>
  <div class="write-page">
    <div v-if="!editingStory" class="dashboard-view py-4">
      <div class="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div>
          <h2 class="fw-bold fs-2 mb-1">Estúdio de Criação</h2>
          <p class="text-secondary mb-0">Gerencie suas obras, continue rascunhos ou comece algo novo.</p>
        </div>
        <button class="btn btn-dark rounded-pill fw-bold d-flex align-items-center gap-2 btn-new-project" @click="createNewStory">
          <span>+</span> Nova História
        </button>
      </div>

      <p v-if="storiesStore.loading" class="text-secondary">Carregando suas obras...</p>
      <p v-else-if="storiesStore.error" class="text-danger">{{ storiesStore.error }}</p>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="story in storiesStore.stories" :key="story.id" class="col">
          <div class="card border-0 shadow-sm rounded-4 p-3 h-100 project-card" @click="openEditor(story.id)">
            <div class="rounded-3 mb-3 position-relative project-thumb" :style="{ backgroundImage: `url('${story.cover_url}')` }">
              <span v-if="story.status === 'draft'" class="badge rounded-pill position-absolute top-0 start-0 m-2 draft-badge">✏️ RASCUNHO</span>
              <span v-else class="badge rounded-pill position-absolute top-0 start-0 m-2 published-badge">✅ PUBLICADO</span>
            </div>
            <h3 class="fs-5 fw-bold">{{ story.title }}</h3>
            <div class="d-flex justify-content-between text-secondary small">
              <span>{{ chapterInfo(story) }}</span>
              <span>{{ formattedDate(story.created_at) }}</span>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card border border-2 rounded-4 d-flex flex-column align-items-center justify-content-center text-secondary h-100 new-project-card" @click="createNewStory">
            <div class="fs-1 mb-2">+</div>
            <span class="fw-semibold">Criar Novo Projeto</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="editor-view">
      <div class="row g-0 vh-100">
        <div class="col-lg-8 editor-zone p-4 overflow-auto d-flex flex-column align-items-center">
          <div class="d-inline-flex align-items-center gap-2 text-secondary mb-3 align-self-start back-btn" @click="closeEditor">
            <span>←</span> Voltar aos Projetos
          </div>

          <div class="sticky-top bg-white bg-opacity-75 rounded-pill px-3 py-2 d-flex gap-2 align-items-center shadow-sm mb-4 toolbar-sticky">
            <button class="btn btn-sm rounded-circle tool-btn">B</button>
            <button class="btn btn-sm rounded-circle tool-btn"><i>I</i></button>
            <button class="btn btn-sm rounded-circle tool-btn">H1</button>
            <span class="text-secondary">|</span>
            <span class="text-secondary small">Editando: {{ editingStory.title }}</span>
          </div>

          <div class="card border-0 shadow-sm p-5 mb-5 w-100 paper-sheet">
            <input
              type="text"
              class="form-control form-control-lg border-0 fw-bold fs-2 p-0 mb-3 chapter-title-input"
              placeholder="Título do Capítulo"
              v-model="chapterTitle"
            />
            <textarea
              class="form-control border-0 p-0 chapter-body"
              placeholder="Comece a escrever..."
              v-model="chapterContent"
            ></textarea>
          </div>
        </div>

        <div class="col-lg-4 border-start bg-white p-4 story-sidebar">
          <h4 class="text-secondary text-uppercase small mb-3">Capítulos</h4>
          <ul class="list-group mb-3">
            <li
              v-for="chapter in editingStory.chapters"
              :key="chapter.id"
              class="list-group-item list-group-item-action"
              :class="{ active: activeChapterId === chapter.id }"
              role="button"
              @click="editChapter(chapter)"
            >
              {{ chapter.title }}
              <span v-if="chapter.published_at" class="badge bg-success float-end">Publicado</span>
              <span v-else class="badge bg-secondary float-end">Rascunho</span>
            </li>
            <li v-if="editingStory.chapters.length === 0" class="list-group-item text-secondary small">
              Nenhum capítulo ainda.
            </li>
          </ul>

          <button class="btn btn-outline-secondary btn-sm w-100 mb-4" @click="newChapter">+ Novo Capítulo</button>

          <button class="btn w-100 fw-bold text-white btn-save-story" :disabled="saving" @click="saveChapter">
            {{ saving ? "Salvando..." : "Salvar Capítulo" }}
          </button>
          <button
            v-if="activeChapterId"
            class="btn btn-outline-dark w-100 mt-2"
            :disabled="isPublished"
            @click="publishChapter"
          >
            {{ isPublished ? "Já publicado" : "Publicar Capítulo" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStoriesStore } from "../../stores/stories";

export default {
  name: "Write",
  data() {
    return {
      editingStoryId: null,
      activeChapterId: null,
      chapterTitle: "",
      chapterContent: "",
      saving: false,
    };
  },
  computed: {
    storiesStore() {
      return useStoriesStore();
    },
    editingStory() {
      return this.storiesStore.stories.find((story) => story.id === this.editingStoryId) || null;
    },
    isPublished() {
      const chapter = this.editingStory?.chapters.find((item) => item.id === this.activeChapterId);
      return !!chapter?.published_at;
    },
  },
  created() {
    this.storiesStore.fetchStories();
  },
  methods: {
    chapterInfo(story) {
      if (story.chapters.length === 0) return "Sem capítulos";
      return `${story.chapters.length} capítulo${story.chapters.length > 1 ? "s" : ""}`;
    },
    formattedDate(dateString) {
      return new Date(dateString).toLocaleDateString("pt-BR");
    },
    openEditor(storyId) {
      this.editingStoryId = storyId;
      this.newChapter();
    },
    closeEditor() {
      this.editingStoryId = null;
    },
    async createNewStory() {
      const title = prompt("Título da nova história:");
      if (!title) return;

      try {
        const story = await this.storiesStore.createStory({ title });
        this.openEditor(story.id);
      } catch (error) {
        alert(error.response?.data?.errors?.join(", ") || "Não foi possível criar a história.");
      }
    },
    editChapter(chapter) {
      this.activeChapterId = chapter.id;
      this.chapterTitle = chapter.title;
      this.chapterContent = chapter.content;
    },
    newChapter() {
      this.activeChapterId = null;
      this.chapterTitle = "";
      this.chapterContent = "";
    },
    async saveChapter() {
      if (!this.chapterTitle || !this.chapterContent) {
        alert("Preencha o título e o conteúdo do capítulo.");
        return;
      }

      this.saving = true;
      try {
        if (this.activeChapterId) {
          await this.storiesStore.updateChapter(this.activeChapterId, {
            title: this.chapterTitle,
            content: this.chapterContent,
          });
        } else {
          const chapter = await this.storiesStore.addChapter(this.editingStoryId, {
            title: this.chapterTitle,
            content: this.chapterContent,
          });
          this.activeChapterId = chapter.id;
        }
      } catch (error) {
        alert(error.response?.data?.errors?.join(", ") || "Não foi possível salvar o capítulo.");
      } finally {
        this.saving = false;
      }
    },
    async publishChapter() {
      if (!this.activeChapterId) return;
      await this.storiesStore.updateChapter(this.activeChapterId, { publishedAt: new Date().toISOString() });
    },
  },
};
</script>
