<template>
  <!-- 忘记密码组件 -->
  <mi-forget
    :check-username-action="handleCheckEmail"
    :send-code-action="handleSendCode"
    :check-code-action="handleCheckCode"
    :reset-password-action="handleResetPassword"
    :resendDowntime="120"
    :email-expired="expire"
    :background="bg1"
    :redirect-to="redirect"
    :title="title"
  />
  <!-- 显示错误信息 -->
  <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />
  <!-- 显示成功提示 -->
  <el-alert v-if="successMessage" :title="successMessage" type="success" show-icon />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Correctly import useRouter from vue-router
import { sendEmail, verifyCode, verifyEmail, changePwd } from '@/requestMethod/useUser';
import bg1 from '@/assets/background.png';

const title = "忘记密码";  
const expire = ref<string>("2分钟");
const redirect = ref<any>("/login");
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

let Remail = ref<string>();
const router = useRouter();

// 校验邮箱逻辑
const handleCheckEmail = async (data?: any) => {
  try {
    const result = await verifyEmail(data);
    if (result) {
      return true;
    } else {
      errorMessage.value = '用户不存在';
      return false;
    }
  } catch (error) {
    errorMessage.value = '用户不存在';
    return false;
  }
};

// 发送验证码逻辑
const handleSendCode = async (data?: any) => {
  try {
    Remail.value = data.username;
    const result = await sendEmail(data.username);
    if (result) {
      return true;
    } else {
      errorMessage.value = '发送验证码失败';
      return false;
    }
  } catch (error) {
    errorMessage.value = '发送验证码失败';
    return false;
  }
};

// 校验验证码逻辑
const handleCheckCode = async (data?: any) => {
  try {
    const result = await verifyCode(Remail, data.code);
    if (result) {
      return true;
    } else {
      errorMessage.value = '验证码校验失败';
      return false;
    }
  } catch (error) {
    errorMessage.value = '验证码校验失败';
    return false;
  }
};

// 重置密码逻辑（添加延迟跳转）
const handleResetPassword = async (data?: any) => {
  try {
    const result = await changePwd(data.username, data.password);
    if (result) {
      successMessage.value = '密码重置成功，3秒后跳转到登录页面';
      // 延迟3秒后跳转到登录页面
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return true;
    } else {
      errorMessage.value = '重置密码失败';
      return false;
    }
  } catch (error) {
    errorMessage.value = '重置密码失败';
    return false;
  }
};
</script>
