import { defineStore } from 'pinia';

export const useOtherUserStore = defineStore('otherUserStore', {
  state: () => ({
    otherUser: {
      id: '',
      nickname: '',
      username: '',
      email: '',
      avatar: '',
      self_intro: '',
      createdAt: '',
    },
  }),
  actions: {
    setOtherUser(otherUser: any) {
      this.otherUser = otherUser;
    },
  },
});
