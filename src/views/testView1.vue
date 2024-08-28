<template>
  <div class="container">
    <mi-title title="编辑话题" />
 <!-- v-model:activeName="activeTab" -->
    <el-tabs v-model="activeTab" class="tabs-container">
      <el-tab-pane label="编辑" name="edit">
        <div class="edit-section">
          <el-input
            type="textarea"
            v-model="content"
            placeholder="请输入话题内容"
            :rows="4"
            :maxlength="100"
            show-word-limit
          />
          <el-select v-model="selectedSection" placeholder="请选择发布的板块" class="section-select" :clearable="false">
            <el-option
              v-for="section in sections"
              :key="section.id"
              :label="section.name"
              :value="section.id"
            />
          </el-select>
          <el-upload
            class="upload"
            :action="uploadUrl"
            :before-upload="beforeUpload"
            :show-file-list="false"
            :limit="1"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
          >
            <el-button size="small" type="primary">上传图片</el-button>
            <img v-if="imageUrl" :src="imageUrl" class="uploaded-image" />
          </el-upload>
          <el-button @click="submitDraft" type="default">存入草稿</el-button>
          <el-button @click="submitPublish" type="primary">提交发布</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="草稿箱" name="drafts">
        <div v-if="drafts.length === 0" class="no-drafts">
          功能未开发
        </div>
        <!-- 草稿箱内容展示代码 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import { fetchSections, type Section } from '@/requestMethod/useSections'; // 引入 fetchSections 方法
import { addTopic } from '@/requestMethod/useTopics';

const userStore = useUserStore();
const userId = userStore.user.id; // 获取用户 ID

const activeTab = ref('edit'); // 默认选中“编辑” Tab
const content = ref('');
const selectedSection = ref<number | null>(null);
const sections = ref<Section[]>([]);
const imageUrl = ref<string | null>(null);
const drafts = ref<Array<{ content: string; sectionId: number }>>([]);
const uploadUrl = 'http://localhost:8080/upload'; // 假设的上传接口

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件');
  }
  return isImage;
};

const handleUploadSuccess = (response: any, file: File) => {
  imageUrl.value = URL.createObjectURL(file);
  ElMessage.success('图片上传成功');
};

const handleUploadError = () => {
  ElMessage.error('图片上传失败');
};

const fetchSectionsData = async () => {
  try {
    const response = await fetchSections();
    sections.value = response;
  } catch (error) {
    ElMessage.error('获取板块列表失败，请重试。');
  }
};

const submitPublish = async () => {
  if (!content.value) {
    ElMessage.error('内容不能为空');
    return;
  }
  if (!selectedSection.value) {
    ElMessage.error('请选择发布的板块');
    return;
  }
  try {
    await addTopic({
      content: content.value,
      image: imageUrl.value || '',
      sectionId: selectedSection.value,
      userId: userId
    });
    ElMessage.success('发布成功');
    clearInputs();
    // refreshPage();
  } catch (error) {
    ElMessage.error('发布失败，请重试。');
  }
};

const submitDraft = () => {
  // 存入草稿的处理逻辑
  ElMessage.info('存入草稿功能暂未实现');
};

const clearInputs = () => {
  content.value = '';
  selectedSection.value = null;
  imageUrl.value = null;
};

const refreshPage = () => {
  window.location.reload();
};

onMounted(() => {
  fetchSectionsData();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.tabs-container {
  flex: 1;
  background-color: #888;
  margin-top: 20px;
}

.edit-section {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
}

.section-select {
  margin: 10px 0;
  width: 100%;
}

.upload {
  margin: 10px 0;
}

.uploaded-image {
  margin-top: 10px;
  max-width: 100px;
  max-height: 100px;
}

.no-drafts {
  text-align: center;
  color: #888;
}
</style>
