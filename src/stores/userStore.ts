import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    token: localStorage.getItem('token') || '', 
  }),
  actions: {
    setUser(userData: any) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // 将token保存到localStorage中
    },
    updateAvatar(newAvatarUrl: string) {
      // 更新用户信息中的头像 URL
      this.user.avatar = newAvatarUrl;
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    clear() {
      this.user = {};
      localStorage.removeItem('user');
      this.token = '';
      localStorage.removeItem('token'); // 清除localStorage中的token
    }
  },
});
