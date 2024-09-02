<template>
    <el-container>
      <!-- 侧边栏 -->
        <div class="sider-logo">
          <el-avatar :src="user.avatar" size="large" class="avatar-logo" />
        <el-menu
          default-active="1"
          class="el-menu-vertical"
          text-color="#000000"
          @select="handleSelect"
        >
          <el-menu-item index="1">一般</el-menu-item>
          <el-menu-item index="2">头像</el-menu-item>
          <el-menu-item index="3">隐私</el-menu-item>
        </el-menu>
      </div>
        
  
      <!-- 主体内容 -->
      <el-container>
        <el-header>
          <div class="left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>首页</el-breadcrumb-item>
              <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- <div class="right">
            <el-input placeholder="搜索" class="input-with-select">
              <template v-slot:prepend>
<el-select  placeholder="搜索">
                <el-option label="用户" value="user"></el-option>
                <el-option label="内容" value="content"></el-option>
              </el-select>
</template>
            </el-input>
          </div> -->
        </el-header>

        <div class="main-content">
          <component :is="currentComponent" />
        </div>
          
  
        <el-footer>
          &copy; 2024 Your Company. All rights reserved.
        </el-footer>
      </el-container>
    </el-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineComponent, markRaw } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import UserProfileForm from '@/components/form/UserProfileForm.vue';
  import AvatarEditForm from '@/components/form/AvatarEditForm.vue';
  import PrivacySettingsForm from '@/components/form/PrivacySettingsForm.vue';
  
  // 用户数据
  const userStore = useUserStore();
  const user = computed(() => userStore.user);
  
  // markRaw标记一个对象为非响应式，这样Vue就不会跟踪这个对象的变化
  const components = {
    UserProfileForm: markRaw(UserProfileForm),
    AvatarEditForm: markRaw(AvatarEditForm),
    PrivacySettingsForm: markRaw(PrivacySettingsForm)
  };
  const currentComponent = ref<typeof components[keyof typeof components]>(UserProfileForm);
  
  const handleSelect = (key: string) => {
    switch (key) {
      case '1':
        currentComponent.value = UserProfileForm;
        break;
      case '2':
        currentComponent.value = AvatarEditForm;
        break;
      case '3':
        currentComponent.value = PrivacySettingsForm;
        break;
    }
  };
  </script>
  
  <style scoped>

  .sider-logo {
    width: 20%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.6);
  }
  
  .avatar-logo {
    border-radius: 50%;
  }
  
  .left {
    float: left;
  }
  
  .right {
    float: right;
  }
  
  .el-main {
    min-height: 85vh;
    padding: 20px;
    background-color: #191a1a;
  }
  .el-menu-vertical{
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.4);
  }
  .main-content{
    width: 100%;
    height: 100%;
  }
  </style>
  