<template>
  <div class="container">
    <mi-title title="编辑话题" />
    <el-tabs v-model="activeTab" class="tabs-container">
      <el-tab-pane label="编辑" name="edit">
        <div class="edit-section">
          <el-input
            type="textarea"
            v-model="content"
            placeholder="请输入话题内容"
            :rows="6"
            :maxlength="150"
            show-word-limit
          />
          <el-select
            v-model="selectedSection"
            placeholder="请选择发布的板块"
            class="section-select"
            :clearable="false">

            <el-option
              v-for="section in sections"
              :key="section.id"
              :label="section.name"
              :value="section.id"
            />
          </el-select>
          <!-- 手动文件选择 -->
          <el-upload
            ref="uploadRef"
            class="upload"
            action="http://localhost:8080/topics/uploadImages"
            list-type="picture-card"
            with-credentials
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :data="uploadData"
            :auto-upload="false"
            :limit="3"
            :multiple="true"
            :before-upload="beforeUpload"
            v-model:file-list="fileList">

            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">最多上传三张图片，点击发布时上传</div>
            </template>
          </el-upload>
          
          <el-button @click="submitDraft" type="default">存入草稿</el-button>
          <el-button @click="submitPublish" type="primary">提交发布</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="草稿箱" name="drafts">
        <div v-if="drafts.length === 0" class="no-drafts">
          功能未开发
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, type UploadFile } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import { fetchSections, type Section } from '@/requestMethod/useSections';
import { addTopic } from '@/requestMethod/useTopics';
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps,UploadInstance } from 'element-plus'

const uploadRef = ref<UploadInstance>()
const userStore = useUserStore();
const userId = userStore.user.id;
const activeTab = ref('edit');
const content = ref('');
const selectedSection = ref<number | null>(null);
const sections = ref<Section[]>([]);
const imageUrlList = ref<string[]>([]); // 存储上传成功后图片URL
const fileList = ref<UploadFile[]>([]);

const drafts = ref<Array<{ content: string; sectionId: number }>>([]);

// 上传时的数据
const uploadData = computed(() => {
  return {
    sectionId: selectedSection.value
  };
});

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件');
  }
  return isImage;
};

const handleUploadSuccess: UploadProps['onSuccess'] = (
  response: any,  // 根据你的后端返回类型进行调整
  file: UploadFile,
  fileList: UploadFile[]
) => {
  imageUrlList.value.push(response.data);  // 确保 response.data 是 URL

};

const handleUploadError: UploadProps['onError'] = (
  error: any,  // 根据你的错误类型进行调整
  file: UploadFile,
  fileList: UploadFile[]
) => {
  ElMessage.error('上传失败：',error);
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
    uploadRef.value!.submit();
    // 轮询等待图片先上传成功
    await new Promise((resolve, reject) => {
      const checkImagesLoaded = setInterval(() => {
        if (imageUrlList.value.length === fileList.value.length) {
          clearInterval(checkImagesLoaded);
          resolve(true);
        }
      }, 1000);
    });

    // 发送添加话题的请求
    await addTopic({
      content: content.value,
      image: imageUrlList.value, 
      sectionId: selectedSection.value,
      userId: userId
    });

    ElMessage.success('发布成功');
    clearInputs();
  } catch (error) {
    ElMessage.error('发布失败，请重试。');
  }
};
const submitDraft = () => {
  ElMessage.info('存入草稿功能暂未实现');
};

const clearInputs = () => {
  content.value = '';
  selectedSection.value = null;
  fileList.value = [];
  imageUrlList.value = [];
};

onMounted(() => {
  fetchSectionsData();
});

const fetchSectionsData = async () => {
  try {
    const response = await fetchSections();
    sections.value = response;
  } catch (error) {
    ElMessage.error('获取板块列表失败，请重试。');
  }
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  padding: 20px;
  box-sizing: border-box;
}

.tabs-container {
  flex: 1;
  background-color:#FFFFFF99;
  padding-top:1%;
  padding-left: 3%;
  padding-right: 3%;
  margin-top: 20px;
}

.edit-section {
  padding: 30px;
  background: #b9f8ed66;
  border-radius: 4px;
}

.section-select {
  margin-top: 5%;
  width: 100%;
}

.upload {
  margin: 10px 0;
}

.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.uploaded-image {
  max-width: 100px;
  max-height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.no-drafts {
  text-align: center;
  color: #888;
}
</style>
