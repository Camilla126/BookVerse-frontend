<template>
  <div class="profile-page py-4" v-if="profileStore.profile">
    <div class="card border-0 rounded-4 shadow-sm overflow-hidden mb-4">
      <div class="profile-cover" :style="{ backgroundImage: `url('${profile.cover_url}')` }"></div>
      <div class="d-flex justify-content-between align-items-end px-4 pb-4 profile-info-bar">
        <div class="d-flex align-items-end gap-3">
          <img :src="profile.avatar_url" class="rounded-circle profile-avatar-lg" />
          <div class="mb-2">
            <h1 class="fs-2 fw-bold mb-1">{{ profile.name }}</h1>
            <p class="text-secondary fs-6 mb-0">
              <span v-if="profile.handle">@{{ profile.handle }} • </span>{{ profile.location }}
            </p>
          </div>
        </div>
        <div class="d-flex gap-2 mb-2">
          <template v-if="isOwnProfile">
            <button class="btn btn-outline-secondary rounded-pill fw-bold" @click="toggleEdit">
              {{ editing ? "Cancelar" : "Editar Perfil" }}
            </button>
            <button class="btn btn-dark rounded-pill fw-bold">Compartilhar</button>
          </template>
          <button
            v-else
            class="btn rounded-pill fw-bold"
            :class="isFollowing ? 'btn-outline-secondary' : 'btn-dark'"
            :disabled="followBusy"
            @click="toggleFollow"
          >
            {{ isFollowing ? "Seguindo" : "Seguir" }}
          </button>
        </div>
      </div>

      <div v-if="editing" class="p-4 border-top">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Handle</label>
            <input type="text" class="form-control" v-model="editForm.handle" />
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Localização</label>
            <input type="text" class="form-control" v-model="editForm.location" />
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Site</label>
            <input type="text" class="form-control" v-model="editForm.website" />
          </div>
          <div class="col-12">
            <label class="form-label fw-semibold small">Bio</label>
            <textarea class="form-control" v-model="editForm.bio"></textarea>
          </div>
        </div>
        <button class="btn btn-dark rounded-pill fw-bold mt-3" @click="saveProfile">Salvar</button>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-4 d-flex flex-column gap-4">
        <div class="card border-0 shadow-sm rounded-4 p-4">
          <div class="text-uppercase small fw-bold text-secondary mb-3">Sobre</div>
          <p class="text-secondary mb-3">{{ profile.bio }}</p>

          <div v-if="profile.website" class="d-flex align-items-center gap-2 text-secondary small mb-2">
            <span>🔗</span> <a href="#" class="text-decoration-none" style="color: var(--primary-color)">{{ profile.website }}</a>
          </div>
          <div class="d-flex align-items-center gap-2 text-secondary small mb-2">
            <span>🎂</span> {{ joinedLabel }}
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
            Conquistas ({{ badges.length }})
          </div>
          <p v-if="badges.length === 0" class="text-secondary small">Nenhuma conquista desbloqueada ainda.</p>
          <div v-else class="row row-cols-3 g-2">
            <div v-for="badge in badges" :key="badge.id" class="col">
              <div class="bg-light rounded-3 p-2 text-center fs-4 badge-slot" :title="badge.title">
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

        <p v-if="!isOwnProfile" class="text-secondary">
          Ainda não é possível ver as obras de outros usuários por aqui.
        </p>
        <p v-else-if="storiesStore.loading" class="text-secondary">Carregando obras...</p>
        <p v-else-if="works.length === 0" class="text-secondary">Nenhuma obra ainda.</p>

        <div v-else class="row row-cols-2 row-cols-md-3 g-3">
          <div v-for="work in works" :key="work.id" class="col">
            <div class="card border-0 shadow-sm rounded-3 overflow-hidden h-100 my-work-card">
              <div class="work-cover" :style="{ backgroundImage: `url('${work.cover_url}')` }">
                <span
                  class="badge rounded-pill position-absolute top-0 end-0 m-2 text-white"
                  :style="{ background: work.status === 'published' ? '#10B981' : '#F59E0B' }"
                >
                  {{ work.status === "published" ? "PUBLICADO" : "RASCUNHO" }}
                </span>
              </div>
              <div class="p-3">
                <h4 class="fw-bold text-truncate fs-6">{{ work.title }}</h4>
                <div class="d-flex gap-3 text-secondary small mt-2">
                  <span>📄 {{ work.chapters.length }} Caps</span>
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

  <div v-else class="py-4">
    <p v-if="profileStore.loading" class="text-secondary">Carregando perfil...</p>
    <p v-else-if="profileStore.error" class="text-danger">{{ profileStore.error }}</p>
  </div>
</template>

<script>
import { useProfileStore } from "../../stores/profile";
import { useStoriesStore } from "../../stores/stories";
import { useFollowStore } from "../../stores/follow";
import { useAuthStore } from "../../stores/auth";

export default {
  name: "Profile",
  data() {
    return {
      activeTab: "Minhas Histórias",
      tabs: ["Minhas Histórias", "Listas de Leitura", "Atividade", "Sobre"],
      editing: false,
      editForm: { handle: "", bio: "", location: "", website: "" },
      isFollowing: false,
      followBusy: false,
    };
  },
  computed: {
    profileStore() {
      return useProfileStore();
    },
    storiesStore() {
      return useStoriesStore();
    },
    followStore() {
      return useFollowStore();
    },
    authStore() {
      return useAuthStore();
    },
    profile() {
      return this.profileStore.profile;
    },
    isOwnProfile() {
      return !this.$route.params.handle;
    },
    joinedLabel() {
      const date = new Date(this.profile.created_at);
      return `Entrou em ${date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}`;
    },
    stats() {
      return [
        { label: "Seguidores", value: this.profile.stats.followers },
        { label: "Seguindo", value: this.profile.stats.following },
        { label: "Obras", value: this.profile.stats.stories },
      ];
    },
    badges() {
      return this.profile.achievements.map((achievement) => ({
        id: achievement.id,
        icon: achievement.icon,
        title: achievement.name,
      }));
    },
    works() {
      return this.isOwnProfile ? this.storiesStore.stories : [];
    },
  },
  created() {
    this.loadProfile();
  },
  watch: {
    "$route.params.handle"() {
      this.loadProfile();
    },
  },
  methods: {
    async loadProfile() {
      if (this.isOwnProfile) {
        await this.profileStore.fetchOwnProfile();
        this.storiesStore.fetchStories();
        return;
      }

      await this.profileStore.fetchPublicProfile(this.$route.params.handle);
      if (this.profile) {
        const followers = await this.followStore.fetchFollowers(this.profile.id);
        this.isFollowing = followers.some((follower) => follower.id === this.authStore.user?.id);
      }
    },
    toggleEdit() {
      if (!this.editing) {
        this.editForm = {
          handle: this.profile.handle || "",
          bio: this.profile.bio || "",
          location: this.profile.location || "",
          website: this.profile.website || "",
        };
      }
      this.editing = !this.editing;
    },
    async saveProfile() {
      try {
        await this.profileStore.updateOwnProfile(this.editForm);
        this.editing = false;
      } catch (error) {
        alert(error.response?.data?.errors?.join(", ") || "Não foi possível salvar o perfil.");
      }
    },
    async toggleFollow() {
      this.followBusy = true;
      try {
        if (this.isFollowing) {
          await this.followStore.unfollow(this.profile.id);
          this.isFollowing = false;
          this.profile.stats.followers -= 1;
        } else {
          await this.followStore.follow(this.profile.id);
          this.isFollowing = true;
          this.profile.stats.followers += 1;
        }
      } finally {
        this.followBusy = false;
      }
    },
  },
};
</script>
