<template>
  <div id="app">
    <!-- 只有当用户不在登录或注册页面时才显示导航栏 -->
    <navBar v-if="!isAuthPage" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router'; // 引入 useRoute 来访问当前路由
import { useUserStore } from '@/stores/userStore';
import navBar from '@/components/navBar1.vue';

const userStore = useUserStore();
const route = useRoute(); // 获取当前路由
const goEasy = inject('goEasy') as any;
const isConnected = ref(false);

// 检查当前页面是否为登录或注册页面
const isAuthPage = ref(route.name === 'login' || route.name === 'register');

// 监听路由变化，实时更新 isAuthPage 状态
watch(route, (newRoute) => {
  isAuthPage.value = newRoute.name === 'login' || newRoute.name === 'register';
});

// 连接到 GoEasy
const connectGoEasy = async () => {
  const currentUser = userStore.user;
  if (!currentUser) return;
  
  try {
    goEasy.connect({
      id: currentUser.id.toString(),
      data: {
        nickname: currentUser.nickname,
        avatar: currentUser.avatar || 'default-avatar-url'
      },
      onSuccess: function () {
        console.log('GoEasy connected successfully.');
        isConnected.value = true;
      },
      onFailed: function (error: { code: string; content: string }) {
        console.log('Failed to connect GoEasy, code:' + error.code + ', error:' + error.content);
      },
      onProgress: function (attempts: any) {
        console.log('GoEasy is connecting', attempts);
      }
    });
  } catch (error) {
    console.error('Failed to connect to GoEasy:', error);
  }
};

// 在组件挂载时连接 GoEasy
onMounted(() => {
  if (userStore.user) {
    connectGoEasy();
  } else {
    watch(() => userStore.user, (newUser) => {
      if (newUser) {
        connectGoEasy();
      }
    });
  }
});

// 提供 GoEasy 实例和连接状态
provide('goEasy', goEasy);
provide('isConnected', isConnected);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: linear-gradient(to right, #98e3ed, #b2f2f2, #fefefe);
  color: #2c3e50;
}
</style>
