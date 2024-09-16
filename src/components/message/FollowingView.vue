<template>
  <div class="following">
    <el-divider content-position="left">通知</el-divider>

    <el-alert
      title="你收到的所有通知："
      type="info"
      class="alert"
      :closable="false"
    >
    </el-alert>
    <el-scrollbar class="scrollbar">
      <ul v-if="notifications.length > 0" class="notification-list">
        <li v-for="(notification, index) in notifications" :key="index" class="list-item">
          <span>{{ notification.content }}</span>
          <span class="notification-time">{{ formatDate(notification.time) }}</span>
        </li>
      </ul>
      <p v-else>目前没有新通知。</p>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import dayjs from 'dayjs';  // 用于日期格式化
import 'dayjs/locale/zh-cn';  // 使用中文格式

// 从注入中获取 goEasy 和 isConnected
const goEasy = inject('goEasy') as any;
const isConnected = inject('isConnected') as any;
const userStore = useUserStore();

// 定义响应式数据，用来存储通知
const notifications = ref<{ content: string; time: number }[]>([]);

// 格式化时间为 "YYYY-MM-DD HH:mm" 格式
const formatDate = (timestamp: number) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm');
};

// 查询历史消息并订阅新通知
onMounted(() => {
  if (isConnected) {
    const pubsub = goEasy.pubsub;

    // 查询近三十条历史通知记录
    pubsub.history({
      channel: 'channel_notification_' + userStore.user.id, // 替换为用户的通知通道
      onSuccess: function (response: any) {
        const historyMessages = response.content.messages;
        historyMessages.forEach((msg: any) => {
          notifications.value.push({
            content: msg.content,
            time: msg.time
          });
        });
      },
      onFailed: function (error: any) {
        console.log("获取历史记录失败，错误编码：" + error.code + " 错误信息：" + error.content);
      }
    });

    // 订阅新的通知
    pubsub.subscribe({
      channel: 'channel_notification_' + userStore.user.id,
      onMessage: function (message: any) {
        console.log("收到新通知: " + message.content);
        notifications.value.push({
          content: message.content,
          time: Date.now()  // 当前时间戳
        });
      },
      onSuccess: function () {
        console.log("通知通道订阅成功。");
      },
      onFailed: function (error: any) {
        console.log("通知通道订阅失败，错误编码：" + error.code + " 错误信息：" + error.content);
      }
    });
  }
});
</script>

<style scoped>
.following {
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

.notification-list {
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

.notification-time {
  color: #999;
  font-size: 12px;
}
</style>
