<template>
  <div class="received-likes">
    <el-divider content-position="left">展示近三十条点赞记录</el-divider>

    <el-alert
      title="这是你最近收到的点赞信息！"
      type="info"
      class="alert"
      :closable="false"
    >
    </el-alert>
    <el-scrollbar class="scrollbar">
      <ul v-if="likes.length > 0" class="likes-list">
        <li v-for="(like, index) in likes" :key="index" class="list-item">
          <span>{{ like.content }}</span>
          <span class="like-time">{{ formatDate(like.time) }}</span>
        </li>
      </ul>
      <p v-else>目前还没有收到新的赞。</p>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import dayjs from 'dayjs'; // 用于日期格式化
import 'dayjs/locale/zh-cn'; // 支持中文格式

// 从注入中获取 goEasy 和 isConnected
const goEasy = inject('goEasy') as any;
const isConnected = inject('isConnected') as any;
const userStore = useUserStore();

// 定义响应式数据，用来存储点赞通知
const likes = ref<{ content: string; time: number }[]>([]);

// 格式化时间为 "YYYY-MM-DD HH:mm" 格式
const formatDate = (timestamp: number) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm');
};

// 在组件挂载时查询历史消息并订阅点赞通知
onMounted(() => {
  if (isConnected) {
    const pubsub = goEasy.pubsub;

    // 查询近三十条历史点赞记录
    pubsub.history({
      channel: 'channel_thumb_' + userStore.user.id, // 替换为用户的点赞通知 channel
      onSuccess: function (response: any) {
        const historyMessages = response.content.messages;
        historyMessages.forEach((msg: any) => {
          likes.value.push({
            content: msg.content,
            time: msg.time
          });
        });
      },
      onFailed: function (error: any) {
        console.log("获取历史记录失败，错误编码：" + error.code + " 错误信息：" + error.content);
      }
    });

    // 订阅新的点赞通知
    pubsub.subscribe({
      channel: 'channel_thumb_' + userStore.user.id,
      onMessage: function (message: any) {
        console.log("收到点赞通知: " + message.content);
        likes.value.push({
          content: message.content,
          time: Date.now()  // 当前时间戳
        });
      },
      onSuccess: function () {
        console.log("点赞通知订阅成功。");
      },
      onFailed: function (error: any) {
        console.log("点赞通知订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content);
      }
    });
  }
});
</script>

<style scoped>
.received-likes {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  padding: 20px;
}

.alert {
  margin-bottom: 20px;
}

.scrollbar {
  max-height: 400px;
  width: 100%;
  overflow: auto;
}

.likes-list {
  width: 100%;
}

.list-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.like-time {
  color: #999;
  font-size: 12px;
}
</style>
