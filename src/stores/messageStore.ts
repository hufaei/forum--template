// stores/messageStore.ts
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => ({
    unreadTotal: 0
  }),
  actions: {
    setUnreadTotal(count: number) {
      this.unreadTotal = count;
    }
  }
});
