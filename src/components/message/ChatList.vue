<template>
  <div class="chat-list">
    <el-card
      v-for="(conversation, key) in conversations" :key="key"
      class="user-card"
      @click="openChat(conversation.userId)"
    >
      <div class="user-card-content">
        <div class="user-info">
          <div class="avatar-and-nickname">
            <el-avatar :src="conversation.avatar" :size="50" />
            <div class="nickname">{{ conversation.nickname }}</div>
          </div>
          <div class="last-message">{{ conversation.lastMessage || '暂无私聊信息' }}</div>
          <div v-if="conversation.unread && conversation.unread > 0" class="unread-count">{{ conversation.unread }}</div>
        </div>
      </div>
    </el-card>
    <el-empty v-if="conversations.length === 0" description="暂无会话" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { ElCard, ElAvatar, ElEmpty } from 'element-plus';

import 'element-plus/theme-chalk/el-card.css';
import 'element-plus/theme-chalk/el-avatar.css';
import 'element-plus/theme-chalk/el-empty.css';

const router = useRouter();
const goEasy = inject('goEasy') as any;

const conversations = ref<Array<{
  userId: string;
  nickname: string;
  avatar: string;
  lastMessage?: string;
  unread?: number;
}>>([]);

// 监听会话列表更新事件
async function onConversationsUpdated(result: any) {
  if (result) {
    conversations.value = result.content.conversations.map((conv: any) => ({
      userId: conv.userId || conv.groupId, // Use groupId for group conversations if available
      nickname: conv.data?.nickname || '未知用户',
      avatar: conv.data?.avatar || 'default-avatar-url',
      lastMessage: conv.lastMessage?.payload?.text || '暂无消息',
      unread: conv.unread || 0,
    }));
    console.log(conversations)
    
  } else {
    console.error('Result content is undefined or not an array:', result);
  }
}

onMounted(() => {
  console.log("确实进入了")
  loadConversations();
  if (goEasy) {
    goEasy.im.on(goEasy.IM_EVENT.CONVERSATIONS_UPDATED, onConversationsUpdated);
  }
});

// 获取最新会话列表
async function loadConversations() {
  try {
    await goEasy.im.latestConversations({
      onSuccess: (result: any) => {
        console.log(result)
        onConversationsUpdated(result);
      },
      onFailed: (error: any) => {
        console.log('Failed to get the latest conversations, code:', error.code, ' content:', error.content);
      }
    });
  } catch (error) {
    console.error('Failed to load conversations:', error);
  }
}

function openChat(userId: string) {
  markConversationAsRead(userId); // 标记会话为已读
  router.push({ name: 'ChatRoom', params: { id: userId } });
}

// 标记会话为已读
async function markConversationAsRead(userId: string) {
  try {
    await goEasy.im.markMessageAsRead({
      id: userId,
      type: goEasy.IM_SCENE.PRIVATE,
      onSuccess: () => {
        console.log('Marked conversation as read successfully');
        // 更新本地会话列表
        const index = conversations.value.findIndex(conv => conv.userId === userId);
        if (index !== -1) {
          conversations.value[index].unread = 0;
        }
      },
      onFailed: (error: any) => {
        console.log('Failed to mark conversation as read:', error);
      },
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
  }
}
</script>

<style scoped>
.chat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
  position: relative;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.user-card:hover {
  background-color: #f0f4f8;
  border: 1px solid #000; /* 黑色实线边框 */
}

.user-card-content {
  display: flex;
  flex-direction: row;
  width: 330%;
  align-items: center;
}

.user-info {
  margin-left: 10px;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content:space-between;
  align-items: center
}

.avatar-and-nickname {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.nickname {
  font-weight: bold;
  font-size: 1em;
  color: #333;
  margin-left: 10px;
}

.last-message {
  font-size: 0.9em;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 40%; /* 设定最大宽度以便消息内容超出时显示省略号 */
}

.unread-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
</style>
