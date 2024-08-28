<template>
  <div class="chat-view">
    <el-card class="chat-header">
      <div class="chat-header-content">
        <el-avatar :src="otherUser?.avatar" class="avatar" />
        <div class="user-info">
          <div class="nickname">{{ otherUser?.nickname }}</div>
        </div>
      </div>
    </el-card>
    <div class="message-box" ref="messageBox">
      <div
        v-for="msg in messages"
        :key="msg.timestamp"
        :class="['message', Number(msg.senderId) === currentUser.id ? 'sent' : 'received']"
      >
        <el-avatar :src="msg.senderId === currentUser.id ? currentUser.avatar : otherUser?.avatar" class="message-avatar" />
        <div class="message-content-wrapper">
          <div class="message-content">
            {{ msg.payload.text }}
          </div>
          <div class="message-time">{{ formatDate(msg.timestamp) }}</div>
        </div>
      </div>
    </div>
    <div class="input-box">
      <el-input
        v-model="message"
        type="textarea"
        :rows="4"
        placeholder="输入消息..."
        maxlength="1000"
        show-word-limit
      />
      <el-button @click="sendMessage" class="send-button">发送</el-button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, inject, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElCard, ElInput, ElButton, ElAvatar, ElMessage } from 'element-plus';
import 'element-plus/theme-chalk/el-card.css';
import 'element-plus/theme-chalk/el-input.css';
import 'element-plus/theme-chalk/el-button.css';
import 'element-plus/theme-chalk/el-avatar.css';
import { useUserStore } from '@/stores/userStore';
import { useOtherUserStore } from '@/stores/otherUserStore';
import { getUserVo } from '@/requestMethod/useUser';
import { formatDate } from '../../utils/utils';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const otherUserStore = useOtherUserStore();

const GoEasy = inject('GoEasy') as any;
const goEasy = inject('goEasy') as any;
const isConnected = inject('isConnected') as Ref<boolean>;

const currentUser = userStore.user;
const otherUser = ref(otherUserStore.otherUser);
const message = ref('');
const messages = ref<any[]>([]);
const messageBox = ref<HTMLElement | null>(null);

watch(() => route.params.id, async (newId) => {
  if (newId === currentUser.id.toString()) {
    ElMessage.warning('不能和自己聊天');
    router.push('/chat');
  } else {
    await loadUserData();
    loadHistory();
  }
}, { immediate: true });

onMounted(() => {
  if (isConnected.value) {
    goEasy.im.on(GoEasy.IM_EVENT.PRIVATE_MESSAGE_RECEIVED, onMessageReceived);
  }
});

onBeforeUnmount(() => {
  if (isConnected.value) {
    goEasy.im.off(GoEasy.IM_EVENT.PRIVATE_MESSAGE_RECEIVED, onMessageReceived);
  }
});

async function loadUserData() {
  const otherUserId = Number(route.params.id as string);
  if (
    !otherUser.value || 
    typeof otherUser.value.id !== 'number' || 
    otherUser.value.id !== otherUserId
  ) {
    try {
      const userData = await getUserVo(otherUserId);
      otherUserStore.setOtherUser(userData);
      otherUser.value = userData;
    } catch (error) {
      console.error('Failed to load user data:', error);
      ElMessage.error('加载用户数据失败');
    }
  }
}

function loadHistory() {
  goEasy.im.history({
    userId: otherUser.value.id.toString(),
    onSuccess: (result: any) => {
      messages.value = result.content;
      console.log(messages)
      console.log(currentUser)
      scrollToBottom();
    },
    onFailed: (error: any) => {
      console.log('获取历史消息失败, code:' + error.code + ' content:' + error.content);
      ElMessage.error('获取历史消息失败');
    }
  });
}

async function sendMessage() {
  console.log(otherUser)
  if (message.value.trim()) {
    const textMessage = goEasy.im.createTextMessage({
      text: message.value,
      to: {
        type: GoEasy.IM_SCENE.PRIVATE,
        id: otherUser.value.id.toString(),
        data: {
          avatar: otherUser.value.avatar,
          nickname: otherUser.value.nickname
        }
      }
    });

    goEasy.im.sendMessage({
      message: textMessage,
      onSuccess: (msg: any) => {
        messages.value.push(msg);
        message.value = '';
        scrollToBottom();
      },
      onFailed: (error: any) => {
        console.log('发送消息失败, code:' + error.code + ' content:' + error.content);
        ElMessage.error('发送消息失败，请稍后重试');
      }
    });
  }
}

function onMessageReceived(message: any) {
  if (message.senderId === otherUser.value.id.toString()) {
    messages.value.push(message);
    scrollToBottom();
    
    // 标记消息为已读
    goEasy.im.markMessageAsRead({
      id: message.messageId,
      type: GoEasy.IM_SCENE.PRIVATE,
      onSuccess: function () {
        console.log("消息标记为已读");
      },
      onFailed: function (error: { code: string; content: string; }) {
        console.log("消息标记失败，错误码：" + error.code + " 错误信息：" + error.content);
      }
    });
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messageBox.value) {
      messageBox.value.scrollTop = messageBox.value.scrollHeight;
    }
  });
}
</script>



<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  margin-bottom: 10px;
}

.chat-header-content {
  display: flex;
  align-items: center;
}

.user-info {
  flex: 1;
  margin-left: 10px;
}

.message-box {
  flex: 1;
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  overflow-y: auto;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.message-avatar {
  margin-right: 10px;
}

.message-content-wrapper {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message-content {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 10px;
}

.message-time {
  margin-top: 5px;
  font-size: 0.8em;
  color: #ccc;
}

.sent {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.sent .message-avatar {
  margin-left: 10px;
  margin-right: 0;
}

.received {
  align-self: flex-start;
}

.input-box {
  display: flex;
  align-items: flex-end;
  background-color: #f1f1f1;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.el-input {
  flex: 1;
  margin-right: 10px;
}

.send-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}
</style>