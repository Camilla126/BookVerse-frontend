<template>
  <div class="app-shell d-flex vh-100">
    <aside class="sidebar bg-white d-flex flex-column p-4 shadow-sm">
      <div class="logo fw-bold fs-4 mb-5 d-flex align-items-center gap-2">
        <span>📚</span> BiblioVerse
      </div>
      <nav class="nav nav-pills flex-column gap-2">
        <router-link to="/feed" class="nav-link menu-item d-flex align-items-center" active-class="active">
          <span class="me-3 fs-5">🏠</span> Feed Social
        </router-link>
        <router-link to="/explore" class="nav-link menu-item d-flex align-items-center" active-class="active">
          <span class="me-3 fs-5">🔍</span> Explorar
        </router-link>
        <router-link to="/library" class="nav-link menu-item d-flex align-items-center" active-class="active">
          <span class="me-3 fs-5">📚</span> Biblioteca
        </router-link>
        <router-link to="/write" class="nav-link menu-item d-flex align-items-center" active-class="active">
          <span class="me-3 fs-5">✒️</span> Escrever
        </router-link>
        <router-link to="/profile" class="nav-link menu-item d-flex align-items-center" active-class="active">
          <span class="me-3 fs-5">👤</span> Perfil
        </router-link>
        <router-link to="/notifications" class="nav-link menu-item d-flex align-items-center" active-class="active">
          <span class="me-3 fs-5">🔔</span> Notificações
        </router-link>
      </nav>

      <button class="btn nav-link menu-item d-flex align-items-center text-start mt-auto" @click="logout">
        <span class="me-3 fs-5">🚪</span> Sair
      </button>
    </aside>

    <main class="main-content flex-fill overflow-auto px-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from "../../stores/auth.js";

export default {
  name: "AppShell",
  computed: {
    authStore() {
      return useAuthStore();
    },
  },
  methods: {
    async logout() {
      await this.authStore.logout();
      this.$router.push("/login");
    },
  },
};
</script>
