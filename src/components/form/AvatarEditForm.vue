<template>
  <div style="padding: 60px;">
    <mi-title title="头像预览" />
    <div class="avatar-preview">
      <div class="avatar-item">
        <el-avatar shape="square" :src="user.avatar" class="avatar-large" />
        <span>184px</span>
      </div>
      <div class="avatar-item">
        <el-avatar shape="square" :src="user.avatar" class="avatar-medium" />
        <span>64px</span>
      </div>
      <div class="avatar-item">
        <el-avatar shape="square" :src="user.avatar" class="avatar-small" />
        <span>32px</span>
      </div>
      <div class="loader">
        <el-upload
          class="avatar-uploader"
          list-type="picture"
          :show-file-list="false"
          :http-request="handleAvatarUpload"
          :before-upload="beforeAvatarUpload"
        >
          <el-tooltip content="点击上传用户头像" placement="top">
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
          </el-tooltip>
        </el-upload>
        <div style="display:flex;flex-direction:column">
          <span>从您的设备上传一个文件</span>
          <span>头像文件应该为jpg以及png格式</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { ElMessage } from 'element-plus';
import type { UploadProps } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { uploadAvatar } from '@/requestMethod/useUser'; // 确保路径正确

const userStore = useUserStore();
const user = computed(() => userStore.user);
const handleAvatarUpload: UploadProps['httpRequest'] = async (options) => {
  const file = options.file as File;

  const url = await uploadAvatar(file);

  if (typeof url === 'string') {
    // 如果返回值是 string 类型，则更新用户头像
    userStore.updateAvatar(url);
  }
};


const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isJPG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png';
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error('头像图片必须是 JPG 或 PNG 格式！');
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB！');
  }
  return isJPG && isLt2M;
};
</script>

<style scoped>
.avatar-preview {
  display: flex;
  gap: 20px;
  justify-content: start;
  align-items: baseline;
  margin-top: 20px;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar-large {
  width: 184px;
  height: 184px;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-medium {
  width: 64px;
  height: 64px;
}

.avatar-small {
  width: 32px;
  height: 32px;
}

.loader {
  display: flex;
  transform: translateY(-60px); /* 使用 transform 移动元素 */
  flex-direction: row;
  justify-items: baseline;
  align-items: baseline;
  width: fit-content;
  padding: 20px;
  margin-left: 50px;
  margin-bottom: 20px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed black;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
</style>
