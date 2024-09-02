<template>
  <div class="forgot-password-container">
    <div>内容我暂定好吧，姑且写一个跳转</div>
    <div><router-link to="/reset-password" class="forgot-password-link">
      密码不太好记？修改密码
    </router-link></div>
    
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 高度占满整个视口高度，确保垂直居中 */
}

.forgot-password-link {
  font-size: 18px;
  text-decoration: none;
  color: #3498db; /* 你可以根据需求调整颜色 */
  transition: color 0.3s ease;
}

.forgot-password-link:hover {
  color: #2980b9; /* 悬停时颜色变化 */
}
</style>
