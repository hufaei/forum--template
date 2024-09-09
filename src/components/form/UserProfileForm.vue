<template>
  <el-form :model="user" class="custom-form">
    <el-form-item label-width="80px" label="昵称">
      <el-input 
        clearable
        v-model="formData.nickname" />
    </el-form-item>
    <el-form-item label-width="80px" label="个人简介">
      <el-input
       v-model="formData.self_intro"
        type="textarea" rows=4 placeholder="请输入个人简介"
        clearable maxlength=50 show-word-limit />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { updateUser, errorMessage } from '@/requestMethod/useUser'; // 引入 updateUser 方法

const userStore = useUserStore();
const user = computed(() => userStore.user);

// 创建一个表单数据对象，并用用户当前信息进行初始化
const formData = reactive({
  nickname: user.value.nickname,
  self_intro: user.value.self_intro,
});

// 提交表单
const submit = async () => {
  await updateUser(formData);
};
</script>

<style scoped>
.custom-form {
  max-width: 80%;
  margin: 0 auto;
  background-color: #00000080; 
  padding: 20px;
  border-radius: 10px;
}
</style>