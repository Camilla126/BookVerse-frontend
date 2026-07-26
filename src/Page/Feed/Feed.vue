<template>
  <div class="feed-page py-4">
    <div class="row g-5">
      <div class="col-lg-8">
        <h2 class="fw-bold mb-4">Seu Feed</h2>

        <article
          v-for="post in posts"
          :key="post.id"
          class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden feed-post"
        >
          <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
            <div class="d-flex align-items-center gap-3">
              <img :src="post.avatar" class="rounded-circle user-avatar" />
              <div>
                <h4 class="mb-0 fs-6 fw-bold">{{ post.author }}</h4>
                <span class="text-muted small">{{ post.action }}</span>
              </div>
            </div>
            <div v-if="post.stars" class="text-warning">{{ '★'.repeat(post.stars) }}</div>
            <span
              v-else-if="post.statusLabel"
              class="badge rounded-pill fw-bold"
              :style="{ color: post.statusColor, background: post.statusBg }"
            >
              {{ post.statusLabel }}
            </span>
            <span v-else class="fs-4">🔥</span>
          </div>

          <div class="d-flex gap-4 p-4">
            <div
              class="book-cover-3d flex-shrink-0"
              :style="{ backgroundImage: `url('${post.cover}')` }"
            ></div>

            <div class="flex-fill d-flex flex-column justify-content-center">
              <span v-if="post.tag" class="badge rounded-pill mb-2 align-self-start tag-pill" :class="post.tagClass">
                {{ post.tag }}
              </span>
              <h3 class="fs-4 fw-bold mb-2">{{ post.title }}</h3>

              <p v-if="post.excerpt" class="text-secondary mb-2">{{ post.excerpt }}</p>

              <template v-if="post.progress !== undefined">
                <div class="progress mb-2" style="height: 8px">
                  <div
                    class="progress-bar"
                    :style="{ width: post.progress + '%', background: 'var(--brand-gradient)' }"
                  ></div>
                </div>
                <div class="d-flex justify-content-between small fw-semibold text-secondary">
                  <span>{{ post.progress }}% Concluído</span>
                  <span>Página {{ post.currentPage }} de {{ post.totalPages }}</span>
                </div>
              </template>

              <div v-if="post.previewLink" class="small fw-semibold" style="color: var(--primary-color)">
                Ler prévia gratuita →
              </div>
            </div>
          </div>

          <div class="d-flex gap-3 align-items-center p-3 bg-light">
            <div
              class="interactive-btn px-3 py-2 rounded-3"
              v-for="(action, i) in post.actions"
              :key="i"
              :class="{ 'ms-auto': action.right }"
            >
              {{ action.label }}
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
  </div>
</template>

<script>
export default {
  name: "Feed",
  data() {
    return {
      posts: [
        {
          id: 1,
          author: "Marina Souza",
          avatar: "https://i.pravatar.cc/150?img=32",
          action: "publicou o Capítulo 12 • 2h atrás",
          cover:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300",
          tag: "ROMANCE DE ÉPOCA",
          tagClass: "tag-romance",
          title: "As Cartas que Não Enviei",
          excerpt:
            '"Eliza segurou o envelope com as mãos trêmulas. A cera vermelha do selo real estava intacta, mas o peso daquele segredo parecia esmagá-la..."',
          previewLink: true,
          actions: [
            { label: "❤️ 1.2k Curtidas" },
            { label: "💬 45 Comentários" },
            { label: "🔖 Salvar", right: true },
          ],
        },
        {
          id: 2,
          author: "Carlos Lima",
          avatar: "https://i.pravatar.cc/150?img=11",
          action: "avaliou um livro • 5h atrás",
          stars: 5,
          cover:
            "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=300",
          tag: "FICÇÃO CIENTÍFICA",
          tagClass: "tag-fantasy",
          title: "Duna",
          excerpt:
            '"Absolutamente épico. Frank Herbert cria um universo tão denso que você sente a areia nos dentes. O desenvolvimento de Paul Atreides é uma obra-prima."',
          actions: [{ label: "❤️ 340 Curtidas" }, { label: "💬 Discutir" }, { label: "📚 Adicionar à lista", right: true }],
        },
        {
          id: 3,
          author: "Ana Clara",
          avatar: "https://i.pravatar.cc/150?img=5",
          action: "atualizou o progresso • 10m atrás",
          statusLabel: "LENDO",
          statusColor: "#10B981",
          statusBg: "#ECFDF5",
          cover:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300",
          title: "O Leitor",
          progress: 75,
          currentPage: 140,
          totalPages: 210,
          actions: [{ label: "👏 Incentivar" }, { label: "💬 Comentar" }],
        },
      ],
      trendingAuthors: [
        { name: "Lia Block", genre: "Fantasia", avatar: "https://i.pravatar.cc/150?img=60" },
        { name: "Danilo M.", genre: "Terror", avatar: "https://i.pravatar.cc/150?img=12" },
      ],
    };
  },
};
</script>
