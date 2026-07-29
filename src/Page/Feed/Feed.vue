<template>
  <div class="feed-page py-4">
    <div class="row g-5">
      <div class="col-lg-8">
        <h2 class="fw-bold mb-4">Seu Feed</h2>

        <p v-if="postsStore.loading" class="text-secondary">Carregando feed...</p>
        <p v-else-if="postsStore.error" class="text-danger">{{ postsStore.error }}</p>
        <p v-else-if="postsStore.posts.length === 0" class="text-secondary">
          Ainda não há nenhuma publicação no feed.
        </p>

        <article
          v-for="post in postsStore.posts"
          :key="post.id"
          class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden feed-post"
        >
          <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-circle user-avatar d-flex align-items-center justify-content-center bg-dark text-white fw-bold">
                {{ initials(post.user.name) }}
              </div>
              <div>
                <h4 class="mb-0 fs-6 fw-bold">{{ post.user.name }}</h4>
                <span class="text-muted small">{{ kindLabel(post.kind) }} • {{ formattedTime(post.created_at) }}</span>
              </div>
            </div>
          </div>

          <div class="d-flex gap-4 p-4">
            <div
              v-if="post.book"
              class="book-cover-3d flex-shrink-0"
              :style="{ backgroundImage: `url('${post.book.cover_url}')` }"
            ></div>

            <div class="flex-fill d-flex flex-column justify-content-center">
              <h3 v-if="post.book" class="fs-4 fw-bold mb-2">{{ post.book.title }}</h3>
              <p class="text-secondary mb-2">{{ post.content }}</p>
            </div>
          </div>

          <div class="d-flex gap-3 align-items-center p-3 bg-light">
            <div class="interactive-btn px-3 py-2 rounded-3">❤️ {{ post.likes_count }} Curtidas</div>
            <div class="interactive-btn px-3 py-2 rounded-3">💬 {{ post.comments_count }} Comentários</div>
          </div>
        </article>
      </div>

      <aside class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top trending-box">
          <h3 class="fs-5 fw-bold mb-4">Autores em Alta 🚀</h3>

          <div v-for="author in trendingAuthors" :key="author.name" class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
            <div class="d-flex align-items-center gap-2">
              <img :src="author.avatar" class="rounded-circle trend-avatar" />
              <div>
                <strong>{{ author.name }}</strong>
                <br />
                <small class="text-muted">{{ author.genre }}</small>
              </div>
            </div>
            <button class="btn btn-dark btn-sm rounded-pill follow-btn">Seguir</button>
          </div>

          <div class="mt-4 p-4 rounded-4 text-white text-center challenge-box">
            <h4 class="fs-6 fw-bold">Desafio da Semana</h4>
            <p class="small my-2 opacity-75">Leia 50 páginas de um clássico.</p>
            <button class="btn btn-light btn-sm rounded-pill fw-bold">Aceitar</button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { usePostsStore } from "../../stores/posts";

const KIND_LABELS = {
  review: "avaliou um livro",
  progress_update: "atualizou o progresso",
  chapter_published: "publicou um capítulo",
};

export default {
  name: "Feed",
  data() {
    return {
      trendingAuthors: [
        { name: "Lia Block", genre: "Fantasia", avatar: "https://i.pravatar.cc/150?img=60" },
        { name: "Danilo M.", genre: "Terror", avatar: "https://i.pravatar.cc/150?img=12" },
      ],
    };
  },
  computed: {
    postsStore() {
      return usePostsStore();
    },
  },
  created() {
    this.postsStore.fetchFeed();
  },
  methods: {
    initials(name) {
      return (name || "?").charAt(0).toUpperCase();
    },
    kindLabel(kind) {
      return KIND_LABELS[kind] || "fez uma publicação";
    },
    formattedTime(createdAt) {
      const diffMinutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
      if (diffMinutes < 60) return `${diffMinutes}m atrás`;
      if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}h atrás`;
      return new Date(createdAt).toLocaleDateString("pt-BR");
    },
  },
};
</script>
