<template>
  <div class="layout-container">
    <!-- 固定的左侧导航栏 -->
    <nav class="sidebar">
      <ul>
        <li
          v-for="section in sections"
          :key="section.id"
          @click="handleTabClick(section)"
          class="sidebar-item"
        >
          {{ section.name }}
        </li>
      </ul>
    </nav>

    <!-- 中间滚动的内容区域 -->
    <div class="content">
      <div v-infinite-scroll="loadMoreTopics" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <el-card shadow="hover"
          v-for="topic in topics"
          :key="topic.id"
          class="topic-card"
          @click="navigateToTopic(topic)"
        >
          <div class="topic-content">
            <div class="topic-header">
              <span>{{ topic.userId }}</span>
              <span>{{ topic.createdAt }}</span>
            </div>
            <div class="topic-body">
              <p>{{ topic.content }}</p>
              <img v-if="topic.image" :src="topic.image" alt="Topic Image" />
            </div>
            <div class="topic-footer"></div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 固定的右侧区域，使用 el-card -->
    <el-card class="otherview" shadow="hover">
      <p>这里是右侧固定的内容。</p>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { fetchSections, type Section } from '@/requestMethod/useSections';
import { fetchTopics, type Topic } from '@/requestMethod/useTopics';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const sections = ref<Section[]>([]);
const topics = ref<Topic[]>([]);
const activeTab = ref(1);
const loading = ref(false);
let offset = 0;
const router = useRouter();

const loadSections = async () => {
  try {
    const data = await fetchSections();
    sections.value = data;
    if (sections.value.length > 0) {
      activeTab.value = sections.value[0].id;
      loadTopics(sections.value[0].id);
    }
  } catch (error) {
    console.error('Failed to load sections:', error);
  }
};

const navigateToTopic = (topic: Topic) => {
  router.push({ name: 'topic', query: { topic: JSON.stringify(topic) } });
};

const loadTopics = async (sectionId: number) => {
  loading.value = true;
  try {
    const data = await fetchTopics(sectionId);
    topics.value.push(...data);
    offset += data.length;
  } catch (error: any) {
    ElMessage.error('Failed to load topics:', error);
  } finally {
    loading.value = false;
  }
};

const loadMoreTopics = () => {
  if (topics.value.length >= offset) {
    loadTopics(activeTab.value);
  }
};

const handleTabClick = (section: Section) => {
  topics.value = [];
  offset = 0;
  loadTopics(section.id);
};

const scrollContent = (e: WheelEvent) => {
  const contentEl = document.querySelector('.content');
  if (contentEl) {
    contentEl.scrollTop += e.deltaY;
    e.preventDefault(); // 防止页面整体滚动
  }
};

onMounted(() => {
  loadSections();
  window.addEventListener('wheel', scrollContent, { passive: false });
});

onBeforeUnmount(() => {
  window.removeEventListener('wheel', scrollContent);
});
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 左侧导航栏 */
.sidebar {
  position: fixed;
  top: 100px;
  left: 20px;
  width: 200px;
  height: 60%;
  background-color: rgba(255, 255, 255, 0.7); /* 半透明白色背景 */
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  color: white;
}

/* 修改 .sidebar-item 样式 */
.sidebar-item {
  margin-bottom: 15px;
  padding: 10px; 
  border-radius: 5px; 
  transition: background-color 0.3s, box-shadow 0.3s; 
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
}

.sidebar-item:hover {
  background-color: rgba(0, 0, 0, 0.4); /* 悬停时背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 悬停时阴影 */
}

/* 中间内容区域 */
.content {
  margin-left: 220px;
  margin-right: 320px;
  padding: 20px;
  overflow-y: auto;
  height: 90%;
  flex-grow: 1;
  background-color: #f5f5f5;
  border-radius: 10px; /* 圆角边框 */
}

/* 右侧固定区域 */
.otherview {
  position: fixed;
  top: 20%;
  right: 30px;
  width: 20%;
  height: 70%;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.7); /* 半透明白色背景 */
}

.topic-card {
  margin-bottom: 20px;
}
</style>
