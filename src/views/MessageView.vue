<template>
  <div id="chat-page">
    <el-container style="height: 100vh;">
      <el-aside width="200px" class="sidebar">
        <el-tabs
          tab-position="left"
          v-model="activeTab"
          @tab-click="handleTabClick"
        >
          <el-tab-pane label="我的私聊" name="privateChat">
            <!-- 我的私聊内容 -->
          </el-tab-pane>
          <el-tab-pane label="我的关注" name="following">
            <!-- 我的关注内容 -->
          </el-tab-pane>
          <el-tab-pane label="收到的赞" name="receivedLikes">
            <!-- 收到的赞内容 -->
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-main class="main-content">
        <el-alert
          v-if="!isConnected"
          title="未连接到网络"
          type="warning"
          show-icon
          class="alert-box"
        />
        <router-view v-if="isConnected" />
        <el-loading v-if="!isConnected" fullscreen />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElTabPane, ElTabs, ElAlert, ElLoading, type TabsPaneContext } from 'element-plus';
import 'element-plus/theme-chalk/el-tabs.css';
import 'element-plus/theme-chalk/el-tab-pane.css';
import 'element-plus/theme-chalk/el-alert.css';
import 'element-plus/theme-chalk/el-loading.css';

const router = useRouter();
const route = useRoute();
const isConnected = inject('isConnected') as boolean;
const activeTab = ref<any>('privateChat');

function handleTabClick(tab: TabsPaneContext) {
  activeTab.value = tab.paneName;
  console.log(activeTab.value)
  if (tab.paneName === 'following' || tab.paneName === 'receivedLikes') {
    alert('功能未开发');
  } else {
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
onMounted

</script>

<style scoped>
#chat-page {
  display: flex;
  height: 100vh;
}

.sidebar {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
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
