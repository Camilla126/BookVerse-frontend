<template>
  <div class="notifications-page py-4 mx-auto" style="max-width: 800px">
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="fw-bold">Atividades Recentes</h2>
      <span class="small fw-bold" style="color: var(--primary-color); cursor: pointer" @click="markAllRead">
        Marcar tudo como lido
      </span>
    </div>

    <ul class="nav nav-pills gap-2 mt-3">
      <li class="nav-item" v-for="filter in filters" :key="filter">
        <a
          href="#"
          class="nav-link rounded-pill n-filter"
          :class="{ active: activeFilter === filter }"
          @click.prevent="activeFilter = filter"
        >
          {{ filter }}
        </a>
      </li>
    </ul>

    <template v-for="group in groupedNotifications" :key="group.label">
      <div class="text-uppercase small fw-bold text-secondary mt-4 mb-2">{{ group.label }}</div>

      <div
        v-for="notif in group.items"
        :key="notif.id"
        class="card border-0 rounded-4 p-3 d-flex flex-row align-items-center gap-3 mb-2 notif-card"
        :class="{ unread: !notif.read }"
      >
        <div class="position-relative flex-shrink-0">
          <img v-if="notif.avatar" :src="notif.avatar" class="rounded-circle n-avatar" />
          <div v-else class="rounded-circle n-avatar d-flex align-items-center justify-content-center text-white fs-4" :style="{ background: notif.iconBg }">
            {{ notif.icon }}
          </div>
          <div class="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center text-white n-badge" :class="notif.badgeClass">
            {{ notif.badgeIcon }}
          </div>
        </div>

        <div class="flex-fill small">
          <span v-html="notif.text"></span>
          <span class="d-block text-secondary mt-1" style="font-size: 0.8rem">{{ notif.time }}</span>
        </div>

        <div v-if="notif.context" class="flex-shrink-0">
          <button v-if="notif.context.type === 'follow-back'" class="btn btn-dark btn-sm rounded-pill">Seguir de volta</button>
        </div>
      </div>
    </template>

    <p v-if="notificationsStore.loading" class="text-secondary mt-4">Carregando notificações...</p>
    <p v-else-if="notificationsStore.error" class="text-danger mt-4">{{ notificationsStore.error }}</p>
    <p v-else-if="notificationsStore.notifications.length === 0" class="text-secondary mt-4">
      Você ainda não tem notificações.
    </p>
  </div>
</template>

<script>
import { useNotificationsStore } from "../../stores/notifications";

const KIND_META = {
  like: { badgeClass: "bg-like", badgeIcon: "❤️", icon: "❤️", iconBg: "#EF4444" },
  comment: { badgeClass: "bg-comment", badgeIcon: "💬", icon: "💬", iconBg: "#3B82F6" },
  follow: { badgeClass: "bg-follow", badgeIcon: "➕", icon: "➕", iconBg: "#6366F1" },
  achievement: { badgeClass: "bg-system", badgeIcon: "✨", icon: "🏆", iconBg: "#8E2DE2" },
  system: { badgeClass: "bg-system", badgeIcon: "📢", icon: "📢", iconBg: "#64748B" },
};

function buildText(notification) {
  const actorName = notification.actor?.name;

  switch (notification.kind) {
    case "like":
      return `<strong>${actorName}</strong> curtiu seu conteúdo.`;
    case "comment":
      return `<strong>${actorName}</strong> comentou no seu post.`;
    case "follow":
      return `<strong>${actorName}</strong> começou a seguir você.`;
    case "achievement":
      return "Parabéns! Você desbloqueou uma nova conquista.";
    default:
      return "Você tem um novo aviso do sistema.";
  }
}

function formatTime(createdAt) {
  const date = new Date(createdAt);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Agora mesmo";
  if (diffMinutes < 60) return `Há ${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
  if (diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60);
    return `${hours} hora${hours > 1 ? "s" : ""} atrás`;
  }

  return date.toLocaleDateString("pt-BR");
}

function groupLabel(notification) {
  if (!notification.read) return "Novo";

  const date = new Date(notification.created_at);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";

  return "Mais antigas";
}

export default {
  name: "Notifications",
  data() {
    return {
      activeFilter: "Todas",
      filters: ["Todas", "Menções", "Alertas"],
    };
  },
  computed: {
    notificationsStore() {
      return useNotificationsStore();
    },
    filteredNotifications() {
      const kindsByFilter = {
        Menções: [ "like", "comment", "follow" ],
        Alertas: [ "system", "achievement" ],
      };
      const kinds = kindsByFilter[this.activeFilter];

      if (!kinds) return this.notificationsStore.notifications;

      return this.notificationsStore.notifications.filter((notification) => kinds.includes(notification.kind));
    },
    viewModels() {
      return this.filteredNotifications.map((notification) => {
        const meta = KIND_META[notification.kind] ?? KIND_META.system;

        return {
          id: notification.id,
          read: notification.read,
          group: groupLabel(notification),
          text: buildText(notification),
          time: formatTime(notification.created_at),
          icon: meta.icon,
          iconBg: meta.iconBg,
          badgeClass: meta.badgeClass,
          badgeIcon: meta.badgeIcon,
          context: notification.kind === "follow" ? { type: "follow-back" } : null,
        };
      });
    },
    groupedNotifications() {
      const order = ["Novo", "Hoje", "Ontem", "Mais antigas"];
      return order
        .map((label) => ({ label, items: this.viewModels.filter((n) => n.group === label) }))
        .filter((group) => group.items.length > 0);
    },
  },
  created() {
    this.notificationsStore.fetchAll();
  },
  methods: {
    markAllRead() {
      this.notificationsStore.markAllRead();
    },
  },
};
</script>
