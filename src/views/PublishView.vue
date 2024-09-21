<template>
  <div class="container">
    <mi-title title="编辑话题" />
    <el-tabs v-model="activeTab" class="tabs-container" @tab-click="handleTabClick">
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
            action="http://47.108.166.11:8081/topics/uploadImages"
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
        <div v-if="draft.content" class="draft-container">
          <el-card style="width: 100%;">
            <template v-slot:header>
              <mi-link path="http://47.108.166.11/main/section" target="_self">
                {{ getSectionName(draft.sectionId) }}
              </mi-link>
            </template>
            <div class="draft-content">
              <p style="text-align: left;padding-left:8%;padding-right:8%">{{ draft.content }}</p>
              <div class="draft-images">
                <img v-for="url in draft.imageUrls" :key="url" :src="url" class="draft-image" />
              </div>
            </div>
            <el-divider border-style="dashed">继续编辑将不保留图片</el-divider>
            <div class="draft-footer">
              
              <el-button @click="continueEditing">继续编辑</el-button>
            </div>
          </el-card>
        </div>
        <div v-else class="no-drafts">
          暂无草稿
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
import { addTopic, saveDraft, getDraft } from '@/requestMethod/useTopics';
import { Plus } from '@element-plus/icons-vue';
import type { UploadProps, UploadInstance } from 'element-plus';

const uploadRef = ref<UploadInstance>();
const userStore = useUserStore();
const userId = userStore.user.id;
const activeTab = ref('edit');
const content = ref('');
const selectedSection = ref<number | null>(null);
const sections = ref<Section[]>([]);
const imageUrlList = ref<string[]>([]); 
const fileList = ref<UploadFile[]>([]);

const draft = ref<{ content: string; imageUrls: string[]; sectionId: any }>({
  content: '',
  imageUrls: [],
  sectionId: 0,
});

// 上传时的数据  目前问题：草稿箱图片无法保存————但是又不想上传到服务器去。。
const uploadData = computed(() => ({
  sectionId: selectedSection.value,
}));

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
  imageUrlList.value.push(response.data);  
};

const handleUploadError: UploadProps['onError'] = (
  error: any,  // 根据你的错误类型进行调整
  file: UploadFile,
  fileList: UploadFile[]
) => {
  ElMessage.error('上传失败：', error);
};

const submitPublish = async () => {
  console.log(fileList)
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

    await new Promise((resolve) => {
      const checkImagesLoaded = setInterval(() => {
        if (imageUrlList.value.length === fileList.value.length) {
          clearInterval(checkImagesLoaded);
          resolve(true);
        }
      }, 1000);
    });

    // 添加话题
    await addTopic({
      content: content.value,
      image: imageUrlList.value, 
      sectionId: selectedSection.value,
      userId: userId,
    });

    ElMessage.success('发布成功');
    clearInputs();
  } catch (error) {
    ElMessage.error('发布失败，请重试。');
  }
};

const clearInputs = () => {
  content.value = '';
  selectedSection.value = null;
  fileList.value = [];
  imageUrlList.value = [];
};

onMounted(async () => {
  fetchSectionsData();
  await loadDraft();
});

const fetchSectionsData = async () => {
  try {
    const response = await fetchSections();
    sections.value = response;
  } catch (error) {
    ElMessage.error('获取板块列表失败，请重试。');
  }
};

const getSectionName = (sectionId: number | null) => {
  const section = sections.value.find((section) => section.id === sectionId);
  return section ? section.name : '未知板块';
};

// 点击草稿箱标签时，加载草稿数据
const handleTabClick = async (tab: any) => {
  if (tab.name === 'drafts') {
    await loadDraft();
  }
};

// 加载草稿数据，但不自动加载到编辑器
const loadDraft = async () => {
  try {
    const response = await getDraft(); // 调用接口获取草稿数据
    draft.value = response;
  } catch (error) {
    ElMessage.error('草稿加载失败，请重试。');
    console.error('Error loading draft:', error);
  }
};

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const submitDraft = async () => {
  try {
    // 转换所有文件为 Base64 编码
    const base64Promises = fileList.value.map(file => convertToBase64(file.raw as File));
    const base64List = await Promise.all(base64Promises);

    draft.value = {
      content: content.value,
      sectionId: selectedSection.value,
      imageUrls: base64List // 保存 Base64 编码
    };

    await saveDraft(draft.value);
    clearInputs();
    ElMessage.success('草稿已保存');
  } catch (error) {
    ElMessage.error('草稿保存失败，请重试。');
    console.error('Error saving draft:', error);
  }
};

const continueEditing = () => {
  content.value = draft.value.content;
  selectedSection.value = draft.value.sectionId;
  fileList.value = [];
  
  activeTab.value = 'edit';
  ElMessage.success('已加载草稿内容');
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
  background-color: #FFFFFF99;
  padding-top: 1%;
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

.draft-container {
  min-width: 700px;
  
  padding: 20px;
  display: flex;
  justify-content: center;
}

.draft-content {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.draft-images {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10%;
  gap: 10px;
  margin-top: 10px;
}

.draft-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.draft-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.no-drafts {
  text-align: center;
  color: #888;
  margin-top: 50px;
}
</style>
