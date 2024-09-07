<template>
  <div class="topic-detail">
    <div class="topic-header">
      <div style="display:flex;align-items: center;">
        <el-avatar v-if="user" :src="user.avatar" shape="square" size="large" class="user-avatar" />
        <div style="font-weight: bold;font-size:medium">{{ user?.nickname }}</div>
      </div>
      
      <span>分享</span>
    </div>
    <div class="topic-body">
      <p style="padding-left:10%;text-align: start;">{{ topic?.content }}</p>

      <div v-if="topicImages(topic?.image).length > 0" class="image-gallery">
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
    <div class="topic-footer">
      <span>浏览数: {{ topic?.viewCount }}</span>
      <span>{{ topic?.createdAt }}</span>
    </div>
    <el-divider></el-divider>

    <!-- 评论列表 -->
    <div
      v-infinite-scroll="loadMoreComments"
      infinite-scroll-disabled="false"
      infinite-scroll-distance="10"
      infinite-scroll-immediate=false
      class="comments"
    >
      <el-card v-for="comment in comments" :key="comment.id" class="comment-card">
        <div class="comment-content">{{ comment.nickName }}: {{ comment.content }}</div>
        <div class="comment-footer">
          <el-divider />
          <span v-if="replyCounts[comment.id] > 0" @click="toggleReplies(comment.id)" class="replies-toggle">
            共{{ replyCounts[comment.id] }}条回复
            <el-icon><arrow-down /></el-icon>
          </span>
          <span v-else @click="toggleReplies(comment.id)" class="click-reply">暂无回复，点击回复此话题</span>
          <div v-if="showRepliesMap[comment.id]" class="replies-container">
            <el-card v-for="reply in repliesMap[comment.id]" :key="reply.id" class="reply-card">
              <div>
                <router-link :to="`/profile/${reply.userId}`">{{ reply.nickName }}</router-link> 回复: {{ reply.content }}
              </div>
              <div class="reply-time">{{ formatReplyTime(reply.createdAt) }}</div>
            </el-card>
            <div class="reply-input">
              <input
                v-model="newReplyContent"
                :placeholder=replyPlaceholder
                type="textarea"
                class="custom-input"
                @keyup.enter="submitReply(comment.id)"
                clearable maxlength=100 show-word-limit
              />
              <img @click="submitReply(comment.id)" class="send-icon" src="@/assets/send.png" alt="发送">
            </div>
          </div>
        </div>
      </el-card>
      <el-empty v-if="!comments.length" description="暂无评论" />
    </div>

    <!-- 评论输入框 -->
    <div class="comment-input">
      <el-input v-model="newComment" placeholder="输入评论..." />
      <el-button @click="submitComment">提交</el-button>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <img :src="likeIcon" @click="toggleLike" class="icon" alt="点赞">
      <img src="@/assets/comment.png" class="icon" alt="评论">
      <img src="@/assets/share.png" class="icon" alt="分享">
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { fetchComments, submitCommentApi, type Comment } from '@/requestMethod/useComment';
import { fetchReplies, addReply, type Replies } from '@/requestMethod/useReplies';
import { fetchTopic } from '@/requestMethod/useTopics'; // 获取话题详情
import { getUserVo } from '@/requestMethod/useUser'; // 获取用户信息
import { ElMessage } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';

const route = useRoute();
const topicId = route.params.topicId as string; // 从路由中获取 topicId
const likeIcon = ref<string>("/src/assets/point-re.png");

let topic = ref<any>(null); // 用于存储话题详情
let user = ref<{ nickname: string; avatar: string } | null>(null); // 用于存储用户信息
let hasMore = ref<boolean>(true); // 标志位，用于控制是否还有更多数据
// 评论相关
let comments = ref<Comment[]>([]);
let newComment = ref<string>('');
let newReplyContent = ref<string>(''); // 用于回复的内容
let loading = ref<boolean>(false); // 保留loading用于加载评论部分
let currentPage = ref<number>(1); // 当前页数，初始化为1
// 回复相关
let repliesMap = reactive<Record<number, Replies[]>>({});
let showRepliesMap = reactive<Record<number, boolean>>({});
let replyCounts = reactive<Record<number, number>>({});
let totalReplies = ref<number>(0);
let replyTo = ref<number | null>(null); // 当前要回复的评论 ID
let replyPlaceholder = computed(() => 
  replyTo.value ? `回复 ${comments.value.find(c => c.id === replyTo.value)?.nickName}` : '输入回复...'
);

// 获取话题详情并加载用户信息
const loadTopicDetails = async () => {
  try {
    const topicData = await fetchTopic(Number(topicId));
    topic.value = topicData;
    const userData = await getUserVo(topicData.userId);
    user.value = {
      nickname: userData.nickname,
      avatar: userData.avatar,
    };
    console.log("加载话题详情：", topic.value);
    await loadComments(); // 加载第一页的评论
  } catch (error) {
    ElMessage.error('加载话题详情或用户信息失败');
  }
};

const loadComments = async () => {
  if (!topic.value) {
    ElMessage.error('加载话题失败');
    return;
  }
  loading.value = true;
  try {
    const data = await fetchComments(topic.value.id, currentPage.value);

    if (data.length === 0) {
      // 如果没有更多数据，设置 hasMore 为 false
      hasMore.value = false;
      loading.value = false;
      return;
    }

    // 去除重复评论
    const existingCommentIds = new Set(comments.value.map(comment => comment.id));
    const uniqueData = data.filter((comment: any) => !existingCommentIds.has(comment.id));

    // 将新评论追加到评论列表中
    comments.value.push(...uniqueData);

    // 加载评论的回复
    await Promise.all(
      comments.value.map(async (comment) => {
        const replies = await fetchReplies(comment.id);
        repliesMap[comment.id] = replies;
        replyCounts[comment.id] = replies.length;
        totalReplies.value += replies.length;
      })
    );
  } catch (error) {
    ElMessage.error("获取评论失败");
  } finally {
    loading.value = false;
  }
};

// 修改 loadMoreComments 方法
const loadMoreComments = () => {
  if (!loading.value && topic.value && hasMore.value) {
    currentPage.value += 1; // 增加页数
    loadComments(); // 加载下一页的评论
  }else{
    console.log("当前页数：",currentPage.value)
  }
};

// 提交评论
const submitComment = async () => {
  if (!newComment.value || !topic.value) return;
  try {
    const newCommentData = {
      content: newComment.value,
      topicId: topic.value.id,
      userId: 1 // 随便改反正token会告诉你id是多少
    };
    await submitCommentApi(newCommentData);
    ElMessage.success("评论已提交");
    newComment.value = "";
    currentPage.value = 1; // 重置页数
    comments.value = []; // 清空评论列表
    loadComments(); // 重新加载评论
  } catch (error) {
    ElMessage.error("提交评论失败");
  }
};

const topicImages = (imageStr: string | null): string[] => {
  return imageStr ? imageStr.split(',') : [];
};

// 提交回复
const submitReply = async (commentId: number) => {
  if (!newReplyContent.value) return;
  try {
    const newReplyData = {
      commentId,
      content: newReplyContent.value,
      userId: 1, // 大概不重要
    };
    await addReply(newReplyData);
    ElMessage.success("回复已提交");
    newReplyContent.value = "";
    replyTo.value = null;
    loadComments(); // 重新加载评论
  } catch (error) {
    ElMessage.error("提交回复失败");
  }
};

// 切换回复显示
const toggleReplies = async (commentId: number) => {
  showRepliesMap[commentId] = !showRepliesMap[commentId];
  replyTo.value = commentId; // 设置当前要回复的评论 ID
};

// 格式化回复时间
const formatReplyTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const oneMinute = 60 * 1000;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;
  if (diff < oneMinute) {
    return `刚刚`;
  } else if (diff < oneHour) {
    const minutes = Math.floor(diff / oneMinute);
    return `${minutes}分钟前`;
  } else if (diff < oneDay) {
    const hours = Math.floor(diff / oneHour);
    return `${hours}小时前`;
  }
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

// 点赞图标切换
const toggleLike = () => {
  likeIcon.value =
    likeIcon.value === "/src/assets/point-re.png"
      ? "/src/assets/point.png"
      : "/src/assets/point-re.png";
};

onMounted(async () => {
  await loadTopicDetails(); // 页面挂载时加载话题详情和用户信息
});
</script>



<style scoped>
.topic-detail {
  padding: 30px;
}
.topic-header{
  padding-left: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

}
.topic-footer {
  padding-left: 30px;
  display: flex;
  justify-content: space-between;
}
.user-avatar {
  margin-right: 20px;
}
.topic-body img {
  max-width: 100%;
  height: auto;
}
.comments {
  overflow-y: auto;
  max-height: 400px;
}
.comment-input {
  display: flex;
  margin-top: 20px;
}
.comment-input .el-input {
  flex-grow: 1;
  margin-right: 10px;
}
.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.comment-card {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
}
.comment-footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
}
.comment-content {
  text-align: left;
}
.replies-toggle {
  color: gray;
  cursor: pointer;
  transition: color 0.3s;
  text-align: center;
}
.replies-toggle:hover {
  color: black;
}
.click-reply {
  color: gray;
  cursor: pointer;
  text-align: center;
  transition: color 0.3s;
}
.click-reply:hover {
  color: black;
}
.reply-card {
  margin-top: 10px;
  padding: 5px;
  border-left: 2px solid #ddd;
  text-align: left;
}
.reply-time {
  font-size: 0.8em;
  color: #888;
}
.reply-input {
  display: flex;
  align-items: center;
}
.custom-input {
  background-color: #ffffff;
  width: 100%;
  height: auto;
  padding: 10px;
  border: 2px solid rgb(152, 152, 152);
  border-radius: 5px;
}
.custom-input:focus {
  color: #010101;
  background-color: #effffb;
  transition: .1s;
}
.send-icon {
  margin-left: -35px;
  cursor: pointer;
  color: white;
  width: 24px;
  height: 24px;
}
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 10px;
}
.topic-image {
  width: 200px;
  height: 200px;
  margin-right: 30px;
  object-fit: cover;
}

</style>

