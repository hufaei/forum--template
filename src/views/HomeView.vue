<template>
  <!-- 左侧热点内容 -->
  <el-card class="hotspot-card">
    <template #header>
      <mi-title :title="'当前热点：'" color="rgb(81, 125, 121)" />
      <!-- 添加一行小字描述 -->
      <small style="color: gray">仅展示近一周的三十条记录</small>

      <!-- 卡片右侧的“换一批”按钮 -->
      <div style="float: right; display: flex; align-items: center; cursor: pointer" @click="changeBatch">
        <el-icon><Refresh /></el-icon>
        <span style="margin-left: 5px;">换一批</span>
      </div>
    </template>

    <div v-for="(hotspot, index) in displayedHotspots" :key="index" class="hotspot-item" @click="redirectToTopic(hotspot.topicId)">
      
      <!-- 用户信息 -->
      <div style="width: 20%; height: 100%; display: flex; flex-direction: column; align-items: center" @click.stop="redirectToUser(hotspot.userId)">
        <el-avatar :src="hotspot.avatar || '@/assets/default-avatar.png'"></el-avatar>
        <p>{{ hotspot.nickname || '未知用户' }}</p>
      </div>
      
      <!-- 热点内容 -->
      <div style="height: 100%; width: 60%;">{{ hotspot.content }}</div>
      
      <!-- 浏览量 -->
      <div style="width: 10%">
        <img src="@/assets/browse.png" alt="浏览数" style="height: 20px; width: 20px;">
        {{ hotspot.viewCount }}
      </div>
    </div>

  </el-card>

  <!-- 右侧作者榜 -->
  <div class="rightside">
    <div class="navigate">
      <img src="@/assets/github.png" alt="github" style="width: 30px; height: 30px;">
      <mi-link path="https://github.com/hufaei?tab=repositories.makeit.vip" target="_blank">
        想了解更多？点击此处
      </mi-link>
    </div>
    <el-card class="author-rank-card">
      <h3>当前发布排行榜</h3>
      <div v-for="(author, index) in authorRankings" :key="index" class="author-item" @click="redirectToUser(author.userId)">
        <el-avatar :src="author.avatar || '@/assets/default-avatar.png'"></el-avatar>
        <div class="author-info">
          <p class="author-name">{{ author.name }}</p>
          <p class="publish-count">发布数：{{ author.publishCount }}</p>
        </div>
        <el-icon @click.stop="redirectToUser(author.userId)"><ArrowRightBold /></el-icon>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ArrowRightBold, Refresh } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';  // 导入 useRouter

import { fetchViewCount } from '@/requestMethod/useComment';
import { fetchTopic } from '@/requestMethod/useTopics'; 
import { getUserVo, getTopUsers } from '@/requestMethod/useUser';

// 定义作者排行榜数据的类型
interface AuthorRanking {
  userId: number;
  name: string;
  publishCount: number;
  avatar: string;
}

// 定义热点数据的类型
interface Hotspot {
  topicId: number;
  content: string;
  viewCount: number;
  avatar: string;
  nickname: string;
  userId: number;  // 新增 userId
}

// 作者排行榜数据
const authorRankings = ref<AuthorRanking[]>([]);

// 热点数据，指定为 Hotspot 类型数组
const hotspots = ref<Hotspot[]>([]);  // 存储所有热点数据
const displayedHotspots = ref<Hotspot[]>([]);  // 当前展示的10条热点数据

const router = useRouter();  // 初始化 router 实例

// 获取热门话题并更新热点信息
const loadHotspots = async () => {
  try {
    const response = await fetchViewCount();
    const topTopics = response;

    for (const topic of topTopics) {
      const topicId = topic.topicId;
      const viewCount = topic.viewCount;

      // 获取话题详情
      const topicResponse = await fetchTopic(topicId);
      const topicData = topicResponse;

      // 获取用户信息
      const userResponse = await getUserVo(topicData.userId);
      const userData = userResponse;

      // 将获取到的内容填充到 hotspots 数组
      hotspots.value.push({
        topicId,
        content: topicData.content,
        viewCount,
        avatar: userData.avatar,
        nickname: userData.nickname,
        userId: topicData.userId  // 存储 userId
      });
    }

    // 从 hotspots 中随机抽取10条作为初始展示数据
    changeBatch();
  } catch (error) {
    console.error('获取热门话题失败', error);
  }
};

// 获取发布话题最多的作者，并更新排行榜数据
const loadAuthorRankings = async () => {
  try {
    const response = await getTopUsers();
    const topUsers = response;

    for (const user of topUsers) {
      const userResponse = await getUserVo(user.user_id);
      const userData = userResponse;

      // 将用户信息填充到 authorRankings 数组
      authorRankings.value.push({
        userId: user.user_id,
        name: userData.nickname,
        publishCount: user.topic_count,
        avatar: userData.avatar
      });
    }
  } catch (error) {
    console.error('获取作者排行榜失败', error);
  }
};

// 随机抽取10条热点数据
const changeBatch = () => {
  if (hotspots.value.length > 0) {
    displayedHotspots.value = hotspots.value
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }
};

// 跳转到话题详情页
const redirectToTopic = (topicId: number) => {
  router.push(`/main/topic/${topicId}`);
};

// 跳转到用户详情页
const redirectToUser = (userId: number) => {
  router.push(`/profile/${userId}`);
};

// 页面加载时调用 loadHotspots 和 loadAuthorRankings 函数
onMounted(() => {
  loadHotspots();
  loadAuthorRankings();
});
</script>


<style scoped>
/* 保持现有样式不变 */
.hotspot-card {
  margin-top: 3%;
  margin-left: 3%;
  width: 60%; 
  background-color: #fff;
}

.author-rank-card {
  width: 100%; 
  background-color: #fff;
}

.hotspot-item {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  text-align: start;
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer; /* 添加点击提示 */
}

.author-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer; /* 添加点击提示 */
}

.author-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.author-name {
  font-weight: bold;
}

.publish-count {
  color: #909399;
}

.arrow-icon {
  font-size: 16px;
  color: #909399;
}

.rightside {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 12%;
  right: 3%;
}

.navigate {
  padding: 10px;
  width: 200px;
  height: 100px;
  margin-bottom: 1.66rem;
  font-size: 1.16rem;
  line-height: 1.29;
  border-radius: 4px;
  background-color: #fff;
}
</style>
