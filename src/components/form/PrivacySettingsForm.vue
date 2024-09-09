<template>
  <div class="account-info-container">
    <mi-title title="个人信息"/>

    <div class="user-info">
      <div><strong>账号：</strong>{{ user.username }}</div>
      <div>
        <strong>邮箱：</strong>{{ user.email }}
        <button @click="modifyEmail" class="modify-email-button">修改邮箱？</button>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="confirmLogout" class="button logout-button">注销账号</button>
      <router-link to="/reset-password" class="button forgot-password-link">
        忘记密码？
      </router-link>
    </div>

    <el-dialog 
      title="确认注销" 
      v-model=showConfirmDialog
      width="30%" 
      center>
      <span>确定要注销账号吗？</span>
      <template #footer>
        <button @click="logout" class="confirm-button">确定</button>
        <button @click="cancelLogout" class="cancel-button">取消</button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { ElMessageBox } from 'element-plus';

const userStore = useUserStore();
const user = userStore.user;

const showConfirmDialog = ref(false);

const confirmLogout = () => {
  showConfirmDialog.value = true;
};

const cancelLogout = () => {
  showConfirmDialog.value = false;
};

const logout = () => {
  // 这里可以调用注销账号的逻辑
  ElMessageBox.alert('账号已注销', '提示');
  showConfirmDialog.value = false;
};

const modifyEmail = () => {
  ElMessageBox.prompt('请输入新的邮箱地址', '修改邮箱', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then(({ value }) => {
    // todo-在这里可以处理邮箱修改逻辑
    ElMessageBox.alert(`邮箱已修改为：${value}`, '提示');
  }).catch(() => {
    ElMessageBox.alert('取消了邮箱修改', '提示');
  });
};
</script>

<style scoped>
.account-info-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  padding-left: 5%; 
  justify-content: start;
  margin: 10%;
  height: 50vh; 
  gap: 20px; 
  background-color: #00000080;
  border-radius: 15px;
}

.user-info {
  margin: 20px;
  font-size: 18px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-info div {
  display: flex;
  align-items: center; 
}

.modify-email-button {
  background: none;
  border: none;
  color: #3498db;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modify-email-button:hover {
  color: #2980b9;
}

.action-buttons {
  display: flex;
  gap: 20px;
}

.button {
  margin-left: 15px;
  background-color: #ffffff00; 
  color: #fff;
  width: 8.5em;
  height: 2.9em;
  border: #414141 0.2em solid; 
  border-radius: 11px;
  text-align: center;
  transition: all 0.6s ease;
}

.button:hover {
  background-color: #b4f5fd; 
  cursor: pointer;
}

.confirm-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.confirm-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-inline: 20px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-inline: 20px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #c0392b;
}

.cancel-button:hover {
  background-color: #7f8c8d;
}
</style>
