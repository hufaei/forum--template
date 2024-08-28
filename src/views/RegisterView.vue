<template>
  <div>
    <mi-register :action="handleSubmit" :captcha="false" :background=bg1 :username-tip="false"/>
    <!-- 显示错误信息 -->
    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Modal ,useApi, useTools, useRequest, type ResponseData, type RequestConfig } from '@miitvip/admin-pro';
import { ElMessage } from 'element-plus'; // 引入Element Plus用于显示消息
import bg1 from '@/assets/background.png'
// const api = useApi();
const { $tools } = useTools();
const { $request } = useRequest();
const router = useRouter();

const rconfig: RequestConfig = {
  // baseURL:"",
  headers: {
    'Content-Type': 'application/json'
  },
  retry: 3,
  retryDelay: 100,
  retryCount: 0,
  responseType: 'json',
  withCredentials: true // 允许携带凭证
};

const errorMessage = ref<string | null>(null);

// 提交处理函数
const handleSubmit = async (data?: any) => {
  console.log(data)
  try {
    const response: ResponseData = await $request.post(
      'http://localhost:8080/users/add',
      {
        nickname: data.username,
        password: data.password,
        email: data.email, // 作为账号
        confirm: data.confirm,
        username: data.email
      },
      rconfig
    );

    if (response.ret.code === 200) {
      router.replace('/login'); // 返回登录界面
      console.log(response.data);
    } else {
      console.error('Registration failed:', response.ret.message);
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
    }
  } catch (error) {
    console.error('Registration failed:', error);
    errorMessage.value = '注册失败，请重试。';
    ElMessage.error('注册失败，请重试。');
  }
};
</script>