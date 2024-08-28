<template>
    <el-form :model="privacySettings">
      <el-form-item label="旧密码">
        <el-input v-model="privacySettings.oldPassword" type="password" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="privacySettings.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input v-model="privacySettings.confirmNewPassword" type="password" />
      </el-form-item>
      <mi-password :confirm="true" />
      <el-form-item label="公开个人信息">
        <el-select v-model="privacySettings.infoVisibility" placeholder="请选择">
          <el-option label="公开" value="public"></el-option>
          <el-option label="仅好友" value="friends"></el-option>
          <el-option label="均不公开" value="private"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="privacySettings.email" disabled />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue';
  
  const privacySettings = reactive({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    email: '',
    infoVisibility: 'public',
  });
  
  const submit = () => {
    // 提交逻辑
    console.log('Privacy Settings Submitted:', privacySettings);
  };
  </script>
  
  <style scoped>
  .el-form {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  