<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    :ellipsis="false"
    active-text-color="#000000"
  >
    <el-menu-item index="home">
      <el-icon><img src="@/assets/main.png" alt="首页" class="nav-icon"></el-icon>
      首页
    </el-menu-item>
    <el-menu-item index="section">
      <el-icon><img src="@/assets/sections.png" alt="论坛" class="nav-icon"></el-icon>
      论坛
    </el-menu-item>
    <el-menu-item index="publish">
      <el-icon><img src="@/assets/publish.png" alt="发布" class="nav-icon"></el-icon>
      发布
    </el-menu-item>
    <div class="flex-grow" />

    <!-- 用户已登录时显示头像和下拉菜单 -->
    <el-dropdown v-if="isLoggedIn" class="avatar-container" trigger="hover" @command="handleCommand">
      <div class="avatar-wrapper">
        <el-avatar :size="32" :src="user.avatar" />
        <span class="nickname">{{ user.nickname }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">
            <el-icon><img src="@/assets/user.png" alt="用户中心" class="nav-icon"></el-icon>
            用户中心
          </el-dropdown-item>
          <el-dropdown-item command="editProfile">
            <el-icon><img src="@/assets/edit.png" alt="账户设置" class="nav-icon"></el-icon>
            账户设置
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided>
            <el-icon><img src="@/assets/logout.png" alt="登出" class="nav-icon"></el-icon>
            登出
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 用户未登录时显示登录按钮 -->
    <el-menu-item v-else @click="goToLogin">
      <el-icon><img src="@/assets/user.png" alt="未登录" class="nav-icon"></el-icon>
      登录
    </el-menu-item>

    <!-- 私信消息按钮，未登录时点击提示登录 -->
    <el-menu-item index="chat" @click="handleChatClick">
      <mi-notice 
        :width="320"
        :dot="false"
        :amount="unreadTotal"
        :max-amount="9"
        :icon-setting="{ size: 20 }"
        class="message-icon">
        <template #icon>
          <img src="@/assets/private.png" alt="私信" class="nav-icon">
        </template>
      </mi-notice>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import { logoutUser } from '@/requestMethod/useUser'; // 引入登出方法


const router = useRouter();
let userStore = useUserStore();
const isLoggedIn = ref<boolean>(false); // 根据是否存在 token 判断用户是否已登录
const activeIndex = ref('home');
const unreadTotal = ref(0);
let user = userStore.user;
const goEasy = inject('goEasy') as any;
const isConnected = inject('isConnected') as any;

// 获取未读消息数量
const fetchUnreadMessages = async () => {
  if (goEasy && isConnected && isLoggedIn.value) {
    try {
      goEasy.im.latestConversations({
        onSuccess: (result: any) => {
          console.log('Fetched unread messages:', result);
          unreadTotal.value = result.content.unreadTotal; // 假设 result.content 包含 unreadTotal
        },
        onFailed: (error: any) => {
          console.error('Failed to get the latest conversations, code:', error.code, ' content:', error.content);
        }
      });
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }
};


var onConversationsUpdated = function (content:any) {
  unreadTotal.value = content.unreadTotal;
};



// 监听 isConnected 的变化
watch(isConnected, (newValue) => {
  if (newValue) {
    fetchUnreadMessages();
    //监听会话列表更新
    goEasy.im.on(goEasy.IM_EVENT.CONVERSATIONS_UPDATED, onConversationsUpdated);
  }
});

// 初始检查
onMounted(() => {
  const hasReloaded = sessionStorage.getItem('hasReloaded');

  // 如果没有刷新过，进行刷新并设置标记
  if (hasReloaded !== 'true') {
    sessionStorage.setItem('hasReloaded', 'true');
    window.location.reload();
  } 

  if (user && user.id) {
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
  }

  
  if (isConnected) {
    fetchUnreadMessages();
    // //监听会话列表更新
    // goEasy.im.on(goEasy.IM_EVENT.CONVERSATIONS_UPDATED, onConversationsUpdated);
  }
});   

const handleCommand = (command: string) => {
  const userId = user.id; // 获取当前用户 ID

  switch (command) {
    case 'profile':
      router.push({ name: 'profile', params: { userId } });
      break;
    case 'editProfile':
      router.push({ name: 'editProfile'});
      break;
    case 'logout':
      handleLogout();
      break;
    default:
      router.push({ name: command });
      break;
  }
};

const handleSelect = (key: string) => {
  if (key === 'logout') {
    handleLogout();
  } else {
    router.push({ name: key });
  }
};

const handleLogout = async () => {
  const success = await logoutUser();
  if (success) {
    isLoggedIn.value = false; // 更新登录状态
    user = userStore.user;
    router.push({ name: 'home' }); // 登出后导航到首页
  }
};

const goToLogin = () => {
  router.push({ name: 'login' });
};

const handleChatClick = () => {
  if (!isLoggedIn.value) {
    ElMessage.error('请先登录后再查看私信');
  } else {
    router.push({ name: 'chat' });
  }
};

onBeforeUnmount(() => {
  // 当组件取消挂载时，重置 `hasReloaded` 标志
  sessionStorage.setItem('hasReloaded', 'false'); // 或者使用 sessionStorage.removeItem('hasReloaded');
});
</script>

<style scoped>
.el-menu-demo {
  display: flex;
  align-items: center;
  background: white;
  color: black;
}

.flex-grow {
  flex-grow: 1;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.el-menu-item, .el-sub-menu__title {
  display: flex;
  align-items: center;
}

.avatar-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nickname {
  margin-left: 8px;
  color: #1d1d1d;
}

.message-icon {
  display: flex;
  align-items: center;
  margin-left: 15px;
  margin-right: 15px; /* Add margin-right to separate it from the avatar */
}
</style>
