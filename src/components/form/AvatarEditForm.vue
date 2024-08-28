<template>
  <div>
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
      <el-upload
        class="avatar-uploader"
        list-type="picture"
        :show-file-list="false"
        :http-request="handleAvatarUpload"
        :before-upload="beforeAvatarUpload"
      >
        <el-tooltip content="点击上传用户头像" placement="top">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-tooltip>
      </el-upload>
      <div style="display:flex;flex-direction:column">
        <span>从您的设备上传一个文件</span>
        <span>头像文件应该为jpg以及png格式</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { ElMessage } from 'element-plus';
import type { UploadProps } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { updateUser } from '@/requestMethod/useUser';

const userStore = useUserStore();
const user = computed(() => userStore.user);
const imageUrl = ref('');
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (error) => {
        reject(error);
      };
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
const handleAvatarUpload: UploadProps['httpRequest'] = async (options) => {
  const { file, onSuccess, onError } = options;
  try {
    const compressedAvatar = await compressImage(file as File);
    await updateUser({ avatar: compressedAvatar });
    userStore.setUser({ ...user.value, avatar: compressedAvatar });
    imageUrl.value = compressedAvatar;
    ElMessage.success('头像上传成功！');
  } catch (error) {
    ElMessage.error('上传失败，请重试');
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

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
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
</style>
