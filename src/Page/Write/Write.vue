<template>
  <div class="write-page">
    <div v-if="!editingStory" class="dashboard-view py-4">
      <div class="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div>
          <h2 class="fw-bold fs-2 mb-1">Estúdio de Criação</h2>
          <p class="text-secondary mb-0">Gerencie suas obras, continue rascunhos ou comece algo novo.</p>
        </div>
        <button class="btn btn-dark rounded-pill fw-bold d-flex align-items-center gap-2 btn-new-project" @click="openEditor('Novo Projeto')">
          <span>+</span> Nova História
        </button>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="project in projects" :key="project.title" class="col">
          <div class="card border-0 shadow-sm rounded-4 p-3 h-100 project-card" @click="openEditor(project.title)">
            <div class="rounded-3 mb-3 position-relative project-thumb" :style="{ backgroundImage: `url('${project.thumb}')` }">
              <span v-if="project.status === 'draft'" class="badge rounded-pill position-absolute top-0 start-0 m-2 draft-badge">✏️ RASCUNHO</span>
              <span v-else class="badge rounded-pill position-absolute top-0 start-0 m-2 published-badge">✅ PUBLICADO</span>
            </div>
            <h3 class="fs-5 fw-bold">{{ project.title }}</h3>
            <div class="d-flex justify-content-between text-secondary small">
              <span>{{ project.chapterInfo }}</span>
              <span>{{ project.editedInfo }}</span>
            </div>
            <div class="progress mt-3" style="height: 6px">
              <div
                class="progress-bar"
                :style="{ width: project.progress + '%', background: project.status === 'draft' ? '#F59E0B' : '#10B981' }"
              ></div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card border border-2 rounded-4 d-flex flex-column align-items-center justify-content-center text-secondary h-100 new-project-card" @click="openEditor('Nova História')">
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
            <span class="text-secondary small">Editando: {{ editingStory }}</span>
          </div>

          <div class="card border-0 shadow-sm p-5 mb-5 w-100 paper-sheet">
            <input type="text" class="form-control form-control-lg border-0 fw-bold fs-2 p-0 mb-3 chapter-title-input" placeholder="Título do Capítulo" />
            <textarea class="form-control border-0 p-0 chapter-body" placeholder="Comece a escrever..."></textarea>
          </div>
        </div>

        <div class="col-lg-4 border-start bg-white p-4 story-sidebar">
          <h4 class="text-secondary text-uppercase small mb-3">Configurações</h4>
          <div class="bg-light rounded-3 mb-4 d-flex align-items-center justify-content-center text-secondary cover-placeholder">Capa</div>
          <label class="fw-semibold small text-secondary">Notas do Autor</label>
          <textarea class="form-control mt-1 notes-textarea"></textarea>
          <button class="btn w-100 fw-bold text-white mt-3 btn-save-story">Salvar Alterações</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Write",
  data() {
    return {
      editingStory: null,
      projects: [
        {
          title: "A Sombra do Passado",
          status: "draft",
          chapterInfo: "Capítulo 4",
          editedInfo: "Editado há 2h",
          progress: 40,
          thumb:
            "https://images.unsplash.com/photo-1516414447581-b21d006433ae?auto=format&fit=crop&q=80&w=400",
        },
        {
          title: "Cyber Punk 2099",
          status: "draft",
          chapterInfo: "Prólogo",
          editedInfo: "Editado ontem",
          progress: 10,
          thumb:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400",
        },
        {
          title: "O Jardim Secreto",
          status: "published",
          chapterInfo: "Completo (12 Caps)",
          editedInfo: "12k Leituras",
          progress: 100,
          thumb:
            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
        },
      ],
    };
  },
  methods: {
    openEditor(title) {
      this.editingStory = title;
    },
    closeEditor() {
      this.editingStory = null;
    },
  },
};
</script>
