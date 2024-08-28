<template>
  <div>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="section in sections"
        :key="section.id"
        :label="section.name"
        :name=section.id
      >
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
                <img v-if="topic.image" :src="topic.image" alt="Topic Image">
              </div>
              <div class="topic-footer">
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
  

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
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
  console.log(sectionId)
  loading.value = true;
  try {
    const data = await fetchTopics(sectionId);
    topics.value.push(...data);
    offset += data.length;
  } catch (error : any) {
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
const handleTabClick = (tab:any) => {
     console.log(tab); // 查看 tab 对象的结构
     const tabId = tab.paneName;
     console.log('Tab ID:', tabId); // 查看获取的 Tab ID
     if (tabId) {
       topics.value = [];
       offset = 0;
       loadTopics(parseInt(tabId));
     } else {
       console.error('Tab ID is undefined or not accessible');
     }
   };

onMounted(() => {
  loadSections();
});
</script>

<style scoped>
.topic-card {
  margin-bottom: 20px;
}
.topic-header {
  display: flex;
  justify-content: space-between;
}
.topic-body img {
  max-width: 100%;
  height: auto;
}
.topic-footer {
  display: flex;
  justify-content: space-around;
}
</style>