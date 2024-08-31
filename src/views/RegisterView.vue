<template>
  <div>
    <mi-register :action="handleSubmit" :title="title" :captcha="false" :background="bg1" :username-tip="false" />
    <!-- 显示错误信息 -->
    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />
  </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router';
import { register, errorMessage } from '@/requestMethod/useUser'; // 导入注册方法
import bg1 from '@/assets/background.png';

const router = useRouter();
const title="LISchool";
// 提交处理函数
const handleSubmit = async (data?: any) => {
  const isSuccess = await register(data);

  if (isSuccess) {
    router.replace('/login'); // 注册成功后跳转到登录页面
  }
};
</script>