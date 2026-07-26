<template>
  <div class="profile-page py-4">
    <div class="card border-0 rounded-4 shadow-sm overflow-hidden mb-4">
      <div class="profile-cover" :style="{ backgroundImage: `url('${profile.cover}')` }"></div>
      <div class="d-flex justify-content-between align-items-end px-4 pb-4 profile-info-bar">
        <div class="d-flex align-items-end gap-3">
          <img :src="profile.avatar" class="rounded-circle profile-avatar-lg" />
          <div class="mb-2">
            <h1 class="fs-2 fw-bold mb-1 d-flex align-items-center gap-2">
              {{ profile.name }}
              <span v-if="profile.verified" class="text-primary fs-5" title="Autor Verificado">✔</span>
            </h1>
            <p class="text-secondary fs-6 mb-0">{{ profile.handle }} • {{ profile.location }}</p>
          </div>
        </div>
        <div class="d-flex gap-2 mb-2">
          <button class="btn btn-outline-secondary rounded-pill fw-bold">Editar Perfil</button>
          <button class="btn btn-dark rounded-pill fw-bold">Compartilhar</button>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-4 d-flex flex-column gap-4">
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <div class="text-uppercase small fw-bold text-secondary mb-3">Sobre</div>
          <p class="text-secondary mb-3">{{ profile.bio }}</p>

          <div class="d-flex align-items-center gap-2 text-secondary small mb-2">
            <span>🔗</span> <a href="#" class="text-decoration-none" style="color: var(--primary-color)">{{ profile.website }}</a>
          </div>
          <div class="d-flex align-items-center gap-2 text-secondary small mb-2">
            <span>🎂</span> {{ profile.joined }}
          </div>

          <div class="d-flex justify-content-between py-3 border-top border-bottom my-3">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <span class="d-block fw-bold fs-5">{{ stat.value }}</span>
              <span class="small text-secondary">{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 p-4">
          <div class="text-uppercase small fw-bold text-secondary mb-3">
            Conquistas ({{ badges.filter((b) => !b.locked).length }})
          </div>
          <div class="row row-cols-3 g-2">
            <div v-for="badge in badges" :key="badge.icon" class="col">
              <div
                class="bg-light rounded-3 p-2 text-center fs-4 badge-slot"
                :style="badge.locked ? { opacity: 0.3 } : {}"
                :title="badge.locked ? '' : badge.title"
              >
                {{ badge.icon }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item" v-for="tab in tabs" :key="tab">
            <a
              href="#"
              class="nav-link"
              :class="{ active: activeTab === tab }"
              @click.prevent="activeTab = tab"
            >
              {{ tab }}
            </a>
          </li>
        </ul>

        <div class="row row-cols-2 row-cols-md-3 g-3">
          <div v-for="work in works" :key="work.title" class="col">
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden h-100 my-work-card">
              <div class="work-cover" :style="{ backgroundImage: `url('${work.cover}')` }">
                <span class="badge rounded-pill position-absolute top-0 end-0 m-2 text-white" :style="{ background: work.statusColor }">
                  {{ work.status }}
                </span>
              </div>
              <div class="p-3">
                <h4 class="fw-bold text-truncate fs-6">{{ work.title }}</h4>
                <p class="small text-secondary">{{ work.description }}</p>
                <div class="d-flex gap-3 text-secondary small mt-2">
                  <span>👁️ {{ work.views }}</span>
                  <span>⭐ {{ work.rating }}</span>
                  <span>📄 {{ work.chapters }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card border border-2 rounded-3 d-flex flex-column align-items-center justify-content-center text-secondary h-100 new-work-card">
              <div class="fs-1 mb-2">+</div>
              <span class="fw-semibold">Nova História</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      activeTab: "Minhas Histórias",
      tabs: ["Minhas Histórias", "Listas de Leitura", "Atividade", "Sobre"],
      profile: {
        name: "Alexandre Lemos",
        verified: true,
        handle: "@alex_lemos",
        location: "São Paulo, BR",
        bio: "Escritor de Fantasia Sombria e Sci-Fi. Amo café, dias chuvosos e criar mundos onde a magia tem um preço alto. 🖋️✨",
        website: "alexlemos.com",
        joined: "Entrou em Jan 2024",
        avatar: "https://i.pravatar.cc/300?img=12",
        cover:
          "https://images.unsplash.com/photo-1507842217153-e21f2010dc6f?auto=format&fit=crop&q=80&w=1200",
      },
      stats: [
        { label: "Seguidores", value: "12.5k" },
        { label: "Seguindo", value: "450" },
        { label: "Obras", value: "82" },
      ],
      badges: [
        { icon: "🏆", title: "Autor Best-Seller" },
        { icon: "🎂", title: "1 Ano de Casa" },
        { icon: "📚", title: "Leitor Voraz" },
        { icon: "🔥", title: "Maratonista" },
        { icon: "⭐", title: "Popular" },
        { icon: "🔒", locked: true },
      ],
      works: [
        {
          title: "A Sombra do Passado",
          description: "Um mistério antigo desperta em uma cidade esquecida...",
          status: "EM ANDAMENTO",
          statusColor: "#F59E0B",
          views: "12k",
          rating: "4.8",
          chapters: "12 Caps",
          cover:
            "https://images.unsplash.com/photo-1516414447581-b21d006433ae?auto=format&fit=crop&q=80&w=400",
        },
        {
          title: "Cyber Punk 2099",
          description: "Neon, chuva e traição no submundo digital.",
          status: "CONCLUÍDO",
          statusColor: "#10B981",
          views: "45k",
          rating: "4.9",
          chapters: "34 Caps",
          cover:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400",
        },
        {
          title: "Crônicas de Areia",
          description: "Uma jornada épica pelo deserto infinito.",
          status: "CONCLUÍDO",
          statusColor: "#10B981",
          views: "8.2k",
          rating: "4.5",
          chapters: "20 Caps",
          cover:
            "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400",
        },
      ],
    };
  },
};
</script>
