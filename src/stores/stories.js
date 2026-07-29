import { defineStore } from "pinia";
import api from "../axios";

export const useStoriesStore = defineStore("stories", {
  state: () => ({
    stories: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStories() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/api/v1/stories");
        this.stories = response.data;
      } catch {
        this.error = "Não foi possível carregar suas obras. Tente novamente.";
      } finally {
        this.loading = false;
      }
    },

    async createStory({ title, coverUrl } = {}) {
      const response = await api.post("/api/v1/stories", {
        story: { title, cover_url: coverUrl },
      });
      this.stories.push(response.data);
      return response.data;
    },

    async addChapter(storyId, { title, content }) {
      const response = await api.post(`/api/v1/stories/${storyId}/chapters`, {
        chapter: { title, content },
      });

      const story = this.stories.find((item) => item.id === storyId);
      if (story) story.chapters.push(response.data);

      return response.data;
    },

    async updateChapter(chapterId, { title, content, publishedAt } = {}) {
      const chapter = {};
      if (title !== undefined) chapter.title = title;
      if (content !== undefined) chapter.content = content;
      if (publishedAt !== undefined) chapter.published_at = publishedAt;

      const response = await api.patch(`/api/v1/chapters/${chapterId}`, { chapter });

      for (const story of this.stories) {
        const index = story.chapters.findIndex((item) => item.id === chapterId);
        if (index !== -1) {
          story.chapters[index] = response.data;
          break;
        }
      }

      return response.data;
    },
  },
});
