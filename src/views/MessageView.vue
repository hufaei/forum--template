<template>
  <div id="chat-page">
    <el-container style="height: 98vh;padding-left: 10%;padding-right: 10% ">
      <el-tabs
        tab-position="left"
        v-model="activeTab"
        class="etab"
        stretch
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="我的私聊" name="privateChat">
          <router-view v-if="activeTab === 'privateChat' && isConnected" />
        </el-tab-pane>

        <el-tab-pane label="我的关注" name="following">
          <router-view v-if="activeTab === 'following' && isConnected" />
        </el-tab-pane>
        
        <el-tab-pane label="收到的赞" name="receivedLikes">
          <router-view v-if="activeTab === 'receivedLikes' && isConnected" />
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isConnected = inject('isConnected') as boolean;
const activeTab = ref<any>('privateChat');

function handleTabClick(tab: any) {
  activeTab.value = tab.paneName;

  // 保留功能未开发提示
  if (tab.paneName === 'following' || tab.paneName === 'receivedLikes') {
    alert('功能未开发');
  } else {
    // 导航到 ChatList 只在选择私聊时执行
    router.push({ name: 'ChatList' });
  }
}

// 根据当前路由设置 activeTab
watch(() => route.name, (newVal) => {
  if (newVal === 'ChatList' || newVal === 'ChatRoom') {
    activeTab.value = 'privateChat';
  } else if (newVal === 'Following') {
    activeTab.value = 'following';
  } else if (newVal === 'ReceivedLikes') {
    activeTab.value = 'receivedLikes';
  }
}, { immediate: true });
</script>

<style scoped>
#chat-page {
  display: flex;
  height: 100vh;
}

/* 调整左侧导航栏样式 */
.etab {
  background-color: rgba(255, 255, 255, 0.5); /* 半透明白色 */
  width: 100%; /* 调整宽度 */
  height: 100%;
  border-radius: 8px; /* 边框圆角 */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5); /* 添加阴影 */
}

/* 自定义标签内容的样式 */
.el-tabs__item {
  color: #ffffff; /* 设置文字颜色 */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.alert-box {
  margin-bottom: 10px;
  
}
</style>
