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

        <el-tab-pane label="我的通知" name="following">
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
  if (tab.paneName === 'receivedLikes') {
    console.log('功能未开发');
    router.push({ name: 'ReceivedLikes' });
  }
  if(tab.paneName === 'following'){
    router.push({ name: 'Following' });
  }
  if(tab.paneName === 'privateChat') {
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
  background-color: rgba(255, 255, 255, 0.5); 
  width: 100%; 
  height: 100%;
  border-radius: 8px; 
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
}


.el-tabs__item {
  color: #ffffff; 
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
