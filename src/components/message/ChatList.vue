<template>
  <div class="chat-list">
    <el-card
      v-for="(conversation, key) in conversations"
      :key="key"
      class="user-card"
      @mouseenter="hoveredCard = key"
      @mouseleave="hoveredCard = null"
      @click="openChat(conversation.userId || conversation.groupId)"
    >
      <div class="user-card-content">
        <div class="user-info">
          <div class="avatar-and-nickname">
            <el-avatar :src="conversation.data?.avatar || 'default-avatar-url'" :size="50" />
            <div class="nickname">{{ conversation.data?.nickname || '未知用户' }}</div>
          </div>
          <div class="last-message">{{ conversation.lastMessage?.payload?.text || '暂无消息' }}</div>
          <div v-if="conversation.unread && conversation.unread > 0" class="unread-count">{{ conversation.unread }}</div>
          
          <!-- 删除按钮容器 -->
          <div 
            class="delete-icon-container" 
            @click.stop="deleteConversation(conversation)"
          >
          <img 
          v-if="hoveredCard === key" 
          class="delete-icon" 
          src="@/assets/con-delete.png" 
          @click.stop="deleteConversation(conversation)" 
          alt="delete icon"
        />
          </div>
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
import 'element-plus/theme-chalk/el-image.css';

const router = useRouter();
const goEasy = inject('goEasy') as any;
const conversations = ref<Array<any>>([]); 
const hoveredCard = ref<number | null>(null); 

// 监听会话列表更新事件
async function onConversationsUpdated(result: any) {
  if (result && result.content && Array.isArray(result.content.conversations)) {
    conversations.value = result.content.conversations; // 直接存储返回的 conversation 对象
  } else {
    console.error('Result content is undefined or not an array:', result);
  }
}

onMounted(() => {
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
        const index = conversations.value.findIndex(conv => (conv.userId || conv.groupId) === userId);
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

// 删除会话
async function deleteConversation(conversation: any) {
  try {
    await goEasy.im.removeConversation({
      conversation: conversation, // 直接传递 conversation 对象
      onSuccess: () => {
        conversations.value = conversations.value.filter(conv => conv !== conversation);
        console.log('Conversation deleted successfully');
      },
      onFailed: (error: any) => {
        console.log('Failed to delete conversation:', error);
      }
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
}
</script>

<style scoped>
.chat-list {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-inline: 10px;
}

.user-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
  position: relative;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
}

.user-card:hover {
  background-color: #f0f4f8;
  border: 1px solid #d2fffa;
}

.user-card-content {
  display: flex;
  flex-direction: row;
  width: 300%;
  align-items: center;
  position: relative;
}

.user-info {
  margin-left: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  max-width: 40%;
}

.unread-count {
  background-color: red;
  margin-left: 15px;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

/* 删除按钮容器 */
.delete-icon-container {
  position: relative;
  right: 0;
  height: 100%; /* 占据卡片的整个高度 */
  width: 35px; /* 比图片略大 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.8s, opacity 0.3s;
  opacity: 0;
  transform: translateX(20px); /* 初始位置 */
}

.user-card:hover .delete-icon-container {
  transform: translateX(0); /* 平滑进入 */
  opacity: 1;
}

.delete-icon {
  width: 25px;
  height: 25px;
}
</style>
