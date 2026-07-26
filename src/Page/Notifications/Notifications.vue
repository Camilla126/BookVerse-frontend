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
          <div
            v-if="notif.context.type === 'book'"
            class="context-book"
            :style="{ backgroundImage: `url('${notif.context.cover}')` }"
          ></div>
          <button v-else-if="notif.context.type === 'follow-back'" class="btn btn-dark btn-sm rounded-pill">Seguir de volta</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Notifications",
  data() {
    return {
      activeFilter: "Todas",
      filters: ["Todas", "Menções", "Alertas"],
      notifications: [
        {
          id: 1,
          group: "Novo",
          read: false,
          avatar: "https://i.pravatar.cc/150?img=12",
          badgeClass: "bg-like",
          badgeIcon: "❤️",
          text: "<strong>Danilo M.</strong> curtiu sua resenha sobre <strong>O Código da Vinci</strong>.",
          time: "Há 5 minutos",
          context: {
            type: "book",
            cover:
              "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200",
          },
        },
        {
          id: 2,
          group: "Novo",
          read: false,
          avatar: "https://i.pravatar.cc/150?img=44",
          badgeClass: "bg-follow",
          badgeIcon: "➕",
          text: "<strong>Sarah Jenkins</strong> e outras 12 pessoas começaram a seguir você.",
          time: "Há 45 minutos",
          context: { type: "follow-back" },
        },
        {
          id: 3,
          group: "Novo",
          read: false,
          icon: "🏆",
          iconBg: "#8E2DE2",
          badgeClass: "bg-system",
          badgeIcon: "✨",
          text: "Parabéns! Você desbloqueou a conquista <strong>Leitor Voraz</strong> por ler 7 dias seguidos.",
          time: "Há 1 hora",
        },
        {
          id: 4,
          group: "Hoje",
          read: true,
          avatar: "https://i.pravatar.cc/150?img=5",
          badgeClass: "bg-comment",
          badgeIcon: "💬",
          text: '<strong>Marina Souza</strong> respondeu ao seu comentário: "Eu chorei nessa parte também! 😭"',
          time: "5 horas atrás",
          context: {
            type: "book",
            cover:
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200",
          },
        },
        {
          id: 5,
          group: "Hoje",
          read: true,
          avatar: "https://i.pravatar.cc/150?img=60",
          badgeClass: "bg-system",
          badgeIcon: "📢",
          text: '<strong>Admin</strong> postou um aviso no <strong>Clube do Terror</strong>: "A leitura do mês começa amanhã!"',
          time: "8 horas atrás",
        },
        {
          id: 6,
          group: "Ontem",
          read: true,
          avatar: "https://i.pravatar.cc/150?img=33",
          badgeClass: "bg-like",
          badgeIcon: "❤️",
          text: "<strong>João</strong> curtiu seu comentário.",
          time: "Ontem às 14:00",
        },
      ],
    };
  },
  computed: {
    groupedNotifications() {
      const order = ["Novo", "Hoje", "Ontem"];
      return order
        .map((label) => ({ label, items: this.notifications.filter((n) => n.group === label) }))
        .filter((group) => group.items.length > 0);
    },
  },
  methods: {
    markAllRead() {
      this.notifications.forEach((n) => (n.read = true));
    },
  },
};
</script>
