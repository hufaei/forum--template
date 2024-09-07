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
    <div
      v-infinite-scroll="loadMoreTopics"
      :infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      class="content"
    >
      <el-card
        shadow="hover"
        v-for="topic in topics"
        :key="topic.id"
        class="topic-card"
        @click="navigateToTopic(topic)"
      >
        <div class="topic-content">
          <div class="topic-header">
            <div style="display: flex;flex-direction:row;align-items: center;">
              <el-avatar
              v-if="userMap[topic.userId]"
              :src="userMap[topic.userId].avatar"
              shape="square"
              size="default"
              class="user-avatar"
              />
              <div v-if="userMap[topic.userId]" class="user-nickname">
                {{ userMap[topic.userId].nickname }}
              </div>
            </div>
            <span class="created-at">{{ formatDate(topic.createdAt) }}</span>
          </div>

          <div class="topic-body">
            <h4 style="padding-left:7%;text-align: start;">{{ topic.content }}</h4>
            <div v-if="topicImages(topic.image).length > 0" class="image-gallery">
              <el-image
                v-for="(image, index) in topicImages(topic.image)"
                :key="index"
                :src="image"
                fit="cover"
                lazy
                class="topic-image"
              />
            </div>
          </div>
          <div class="topic-footer"></div>
        </div>
      </el-card>
      <p v-if="loading">Loading...</p>
    </div>


    <!-- 固定的右侧区域，使用 el-card -->
    <el-card class="otherview" shadow="hover">
      <p>这里是右侧固定的内容。</p>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { fetchSections, type Section } from '@/requestMethod/useSections';
import { fetchTopics, type Topic } from '@/requestMethod/useTopics';
import { getUserVo } from '@/requestMethod/useUser';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const sections = ref<Section[]>([]);
const topics = ref<Topic[]>([]);
const userMap = ref<Record<number, { avatar: string; nickname: string }>>({});
const activeTab = ref(1);
const loading = ref(false);
const hasMore = ref(true); // 控制是否还有更多数据
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
  router.push({ name: 'topic', params: { topicId: topic.id } });
};

const loadTopics = async (sectionId: number) => {
  loading.value = true;
  try {
    const data = await fetchTopics(sectionId, offset);

    if (data.length === 0) {
      hasMore.value = false;
      loading.value = false;
      return;
    }

    // 去除重复话题
    const existingTopicIds = new Set(topics.value.map(topic => topic.id));
    const uniqueData = data.filter((topic:any) => !existingTopicIds.has(topic.id));

    // 将新话题追加到话题列表中
    topics.value.push(...uniqueData);
    offset += 1;

    // 为每个话题的 userId 获取用户信息
    for (const topic of uniqueData) {
      if (!userMap.value[topic.userId]) {
        const userInfo = await getUserVo(topic.userId);
        userMap.value[topic.userId] = {
          avatar: userInfo.avatar,
          nickname: userInfo.nickname,
        };
      }
    }
  } catch (error) {
    ElMessage.error('加载话题失败');
  } finally {
    loading.value = false;
  }
};

const loadMoreTopics = () => {
  console.log("话题页数：",offset)
  if (!loading.value && hasMore.value) {
    console.log("话题页数：",offset)
    loadTopics(activeTab.value);
  }else{
    console.log("话题页数：",offset)
  }
};

const handleTabClick = (section: Section) => {
  topics.value = [];
  offset = 0;
  hasMore.value = true; // 重置 hasMore 标志位
  loadTopics(section.id);
};

const topicImages = (imageStr: string | null): string[] => {
  return imageStr ? imageStr.split(',') : [];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

onMounted(() => {
  loadSections();
});
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 90vh;
  overflow: hidden;
}

/* 左侧导航栏 */
.sidebar {
  position: fixed;
  top: 100px;
  left: 20px;
  width: 200px;
  min-height: 80%;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 5%;
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
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 中间内容区域 */
.content {
  margin-top: 2%;
  margin-left: 220px;
  margin-right: 320px;
  padding: 20px;
  overflow-y: auto;
  max-height: 90%;
  flex-grow: 1;
  background-color: #f5f5f5;
  border-radius: 10px;
}

/* 右侧固定区域 */
.otherview {
  position: fixed;
  top: 100px;
  right: 30px;
  width: 20%;
  min-height: 80%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 5%;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.7);
}

/* 话题卡片 */
.topic-card {
  margin-bottom: 20px;
}

/* 话题头部 */
.topic-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}

.user-id {
  float: left;
}

.created-at {
  float: right;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 10px;
}

.topic-image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  object-fit: cover;
}

.user-avatar {
  margin-right: 10px;
}

.user-nickname {
  font-weight: bold;
}
</style>
