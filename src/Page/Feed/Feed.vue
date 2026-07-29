<template>
  <div class="feed-page py-4">
    <div class="row g-5">
      <div class="col-lg-8">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold mb-0">Seu Feed</h2>
          <button class="btn btn-outline-dark btn-sm rounded-pill" @click="openReviewModal">⭐ Avaliar um livro</button>
        </div>

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
            <button
              class="interactive-btn btn px-3 py-2 rounded-3"
              :class="{ 'text-danger fw-bold': isLiked(post.id) }"
              :disabled="likeBusy[post.id]"
              @click="toggleLike(post)"
            >
              ❤️ {{ post.likes_count }} Curtidas
            </button>
            <button class="interactive-btn btn px-3 py-2 rounded-3" @click="toggleComments(post.id)">
              💬 {{ post.comments_count }} Comentários
            </button>
          </div>

          <div v-if="openComments[post.id]" class="p-3 border-top">
            <div v-for="comment in sessionComments[post.id]" :key="comment.id" class="small mb-2">
              <strong>{{ comment.user.name }}</strong> {{ comment.content }}
            </div>
            <p v-if="!sessionComments[post.id] || sessionComments[post.id].length === 0" class="text-secondary small">
              Nenhum comentário carregado ainda — escreva o primeiro.
            </p>
            <div class="input-group mt-2">
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="commentDrafts[post.id]"
                placeholder="Escreva um comentário..."
                @keyup.enter="submitComment(post)"
              />
              <button class="btn btn-dark btn-sm" :disabled="commentBusy[post.id]" @click="submitComment(post)">
                Enviar
              </button>
            </div>
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

    <div
      class="modal fade"
      :class="{ show: showReviewModal }"
      :style="{ display: showReviewModal ? 'block' : 'none' }"
      tabindex="-1"
      @click.self="closeReviewModal"
    >
      <div class="modal-dialog">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Avaliar um Livro</h5>
            <button type="button" class="btn-close" @click="closeReviewModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Buscar livro</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="reviewBookQuery"
                  placeholder="Título ou autor..."
                  @keyup.enter="searchReviewBooks"
                />
                <button class="btn btn-outline-secondary" @click="searchReviewBooks">Buscar</button>
              </div>
            </div>

            <ul v-if="!reviewBook && booksStore.books.length > 0" class="list-group mb-3">
              <li
                v-for="book in booksStore.books"
                :key="book.id"
                class="list-group-item list-group-item-action"
                role="button"
                @click="reviewBook = book"
              >
                <strong>{{ book.title }}</strong> — {{ book.author }}
              </li>
            </ul>

            <div v-if="reviewBook" class="alert alert-light d-flex justify-content-between align-items-center">
              <span><strong>{{ reviewBook.title }}</strong> — {{ reviewBook.author }}</span>
              <button class="btn btn-sm btn-link" @click="reviewBook = null">Trocar</button>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Nota</label>
              <select class="form-select" v-model.number="reviewRating">
                <option v-for="n in 5" :key="n" :value="n">{{ "★".repeat(n) }}</option>
              </select>
            </div>

            <div class="mb-1">
              <label class="form-label fw-semibold">Sua avaliação</label>
              <textarea class="form-control" v-model="reviewContent" placeholder="O que achou do livro?"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-light rounded-pill" @click="closeReviewModal">Cancelar</button>
            <button class="btn btn-dark rounded-pill" :disabled="reviewBusy" @click="submitReview">Publicar Avaliação</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ show: showReviewModal }" v-if="showReviewModal"></div>
  </div>
</template>

<script>
import { usePostsStore } from "../../stores/posts";
import { useLikesStore } from "../../stores/likes";
import { useReviewsStore } from "../../stores/reviews";
import { useBooksStore } from "../../stores/books";

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
      likedPosts: {},
      likeBusy: {},
      openComments: {},
      commentDrafts: {},
      commentBusy: {},
      sessionComments: {},
      showReviewModal: false,
      reviewBookQuery: "",
      reviewBook: null,
      reviewRating: 5,
      reviewContent: "",
      reviewBusy: false,
    };
  },
  computed: {
    postsStore() {
      return usePostsStore();
    },
    likesStore() {
      return useLikesStore();
    },
    reviewsStore() {
      return useReviewsStore();
    },
    booksStore() {
      return useBooksStore();
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
    isLiked(postId) {
      return !!this.likedPosts[postId];
    },
    async toggleLike(post) {
      this.likeBusy = { ...this.likeBusy, [post.id]: true };

      try {
        if (this.isLiked(post.id)) {
          await this.likesStore.unlike(this.likedPosts[post.id]);
          delete this.likedPosts[post.id];
          this.postsStore.incrementLikes(post.id, -1);
        } else {
          const like = await this.likesStore.like("Post", post.id);
          this.likedPosts = { ...this.likedPosts, [post.id]: like.id };
          this.postsStore.incrementLikes(post.id, 1);
        }
      } catch (error) {
        alert(error.response?.data?.errors?.join(", ") || "Não foi possível curtir agora.");
      } finally {
        this.likeBusy = { ...this.likeBusy, [post.id]: false };
      }
    },
    toggleComments(postId) {
      this.openComments = { ...this.openComments, [postId]: !this.openComments[postId] };
    },
    async submitComment(post) {
      const content = this.commentDrafts[post.id];
      if (!content) return;

      this.commentBusy = { ...this.commentBusy, [post.id]: true };
      try {
        const comment = await this.postsStore.addComment(post.id, content);
        const existing = this.sessionComments[post.id] || [];
        this.sessionComments = { ...this.sessionComments, [post.id]: [...existing, comment] };
        this.commentDrafts = { ...this.commentDrafts, [post.id]: "" };
      } catch (error) {
        alert(error.response?.data?.errors?.join(", ") || "Não foi possível comentar agora.");
      } finally {
        this.commentBusy = { ...this.commentBusy, [post.id]: false };
      }
    },
    openReviewModal() {
      this.showReviewModal = true;
    },
    closeReviewModal() {
      this.showReviewModal = false;
      this.reviewBookQuery = "";
      this.reviewBook = null;
      this.reviewRating = 5;
      this.reviewContent = "";
    },
    async searchReviewBooks() {
      await this.booksStore.search({ q: this.reviewBookQuery });
    },
    async submitReview() {
      if (!this.reviewBook || !this.reviewContent) {
        alert("Escolha um livro e escreva sua avaliação.");
        return;
      }

      this.reviewBusy = true;
      try {
        await this.reviewsStore.createReview({
          bookId: this.reviewBook.id,
          rating: this.reviewRating,
          content: this.reviewContent,
        });
        this.closeReviewModal();
      } catch (error) {
        alert(error.response?.data?.errors?.join(", ") || "Não foi possível publicar a avaliação.");
      } finally {
        this.reviewBusy = false;
      }
    },
  },
};
</script>
