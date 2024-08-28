<template>
  <div class="home">
    <h1>欢迎来到首页</h1>
    <p>这是一个基础介绍页面。在这里你可以查看当前的会话记录。</p>
    
    <div class="user-info">
      <h2>当前用户信息</h2>
      <p><strong>ID:</strong> {{ userId }}</p>
      <p><strong>昵称:</strong> {{ nickname }}</p>
    </div>
    
    <div class="conversations">
      <h2>会话记录</h2>
      <pre>{{ conversations }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import { useUserStore } from '@/stores/userStore';

const goEasy = inject('goEasy') as any;
const userStore = useUserStore();

const conversations = ref<any>([]);
const userId = ref(userStore.user.id);
const nickname = ref(userStore.user.nickname);

// 获取会话列表
const loadConversations = async () => {
  try {
    goEasy.im.latestConversations({
      onSuccess: (result: any) => {
        console.log(result)
        conversations.value = result.content;
      },
      onFailed: (error: any) => {
        console.error('Failed to get the latest conversations, code:', error.code, ' content:', error.content);
      }
    });
  } catch (error) {
    console.error('Failed to load conversations:', error);
  }
};
// 监听会话列表更新事件
async function onConversationsUpdated(result: any) {
  if (result) {
    conversations.value = result.content
    console.log(conversations)
    
  } else {
    console.error('Result content is undefined or not an array:', result);
  }
}
onMounted(() => {
  if (goEasy) {
    loadConversations();
    goEasy.im.on(goEasy.IM_EVENT.CONVERSATIONS_UPDATED, onConversationsUpdated);
  }
});
</script>

<style scoped>
.home {
  padding: 20px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.user-info {
  margin-bottom: 20px;
}

.conversations {
  margin-top: 20px;
}

pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap; /* 保持空格和换行 */
}
</style>
