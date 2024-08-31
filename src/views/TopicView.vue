<template>
  <div class="topic-detail">
    <div class="topic-header">
      <span>{{ topic.userId }}</span>
      <span>分享</span>
    </div>
    <div class="topic-body">
      <img v-if="topic.image" :src="topic.image" alt="Topic Image">
      <p>{{ topic.content }}</p>
    </div>
    <div class="topic-footer">
      <span>浏览数: {{ topic.viewCount }}</span>
      <span>{{ topic.createdAt }}</span>
    </div>
    <el-divider></el-divider>
    <!-- <div v-if="totalReplies > 0" class="total-replies">共{{ totalReplies }}条回复</div> -->
    <div
      v-infinite-scroll="loadMoreComments"
      infinite-scroll-disabled="false"
      infinite-scroll-distance="1"
      class="comments"
    >
      <!-- 评论列表 -->
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
      <el-empty v-if="!comments.length && !loading.valueOf" description="暂无评论" />
    </div>
    <div class="comment-input">
      <el-input v-model="newComment" placeholder="输入评论..." />
      <el-button @click="submitComment">提交</el-button>
    </div>
    <div class="actions">
      <img :src="likeIcon" @click="toggleLike" class="icon" alt="点赞">
      <img src="@/assets/comment.png" class="icon" alt="评论">
      <img src="@/assets/share.png" class="icon" alt="分享">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchComments, submitCommentApi, type Comment } from '@/requestMethod/useComment';
import { fetchReplies, addReply, type Replies } from '@/requestMethod/useReplies';
import { ElMessage } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';

const route = useRoute();
const topic = JSON.parse(route.query.topic as string);

const comments = ref<Comment[]>([]);
const newComment = ref<string>('');
const newReplyContent = ref<string>(''); // 用于回复的内容
const loading = ref<boolean>(false);
let commentOffset = 0;
const limit = 8;

const repliesMap = reactive<Record<number, Replies[]>>({});
const showRepliesMap = reactive<Record<number, boolean>>({});
const replyCounts = reactive<Record<number, number>>({});
const totalReplies = ref<number>(0);
const likeIcon = ref<string>("/src/assets/point-re.png");

const replyTo = ref<number | null>(null); // 当前要回复的评论 ID
const replyPlaceholder = computed(() => replyTo.value ? `回复 ${comments.value.find(c => c.id === replyTo.value)?.nickName}` : '输入回复...');

const loadComments = async () => {
  loading.value = true;
  try {
    const data = await fetchComments(topic.id);
    comments.value.push(...data.slice(commentOffset, commentOffset + limit));
    await Promise.all(comments.value.map(async (comment) => {
      const replies = await fetchReplies(comment.id);
      repliesMap[comment.id] = replies;
      replyCounts[comment.id] = replies.length;
      totalReplies.value += replies.length;
    }));
  } catch (error) {
    ElMessage.error('获取评论失败');
  } finally {
    loading.value = false;
  }
};

const loadMoreComments = () => {
  if (!loading.value) {
    commentOffset += limit;
    loadComments();
  }
};

const submitComment = async () => {
  if (!newComment.value) return;
  try {
    const newCommentData = {
      content: newComment.value,
      topicId: topic.id,
      userId: 1 // 假设用户ID为1，可以根据实际情况调整
    };
    await submitCommentApi(newCommentData);
    ElMessage.success('评论已提交');
    newComment.value = '';
    commentOffset = 0;
    comments.value = [];
    loadComments();
  } catch (error) {
    ElMessage.error('提交评论失败');
  }
};

const submitReply = async (commentId: number) => {
  if (!newReplyContent.value) return;
  try {
    const newReplyData = {
      commentId,
      content: newReplyContent.value,
      userId: 1 // 假设用户ID为1，可以根据实际情况调整
    };
    await addReply(newReplyData);
    ElMessage.success('回复已提交');
    newReplyContent.value = '';
    replyTo.value = null; // 清空回复状态
    loadComments(); // 重新加载评论
  } catch (error) {
    ElMessage.error('提交回复失败');
  }
};

const toggleReplies = async (commentId: number) => {
  showRepliesMap[commentId] = !showRepliesMap[commentId];
  replyTo.value = commentId; // 设置当前要回复的评论 ID
};

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
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' });
};

const toggleLike = () => {
  likeIcon.value = likeIcon.value === "/src/assets/point-re.png" ? "/src/assets/point.png" : "/src/assets/point-re.png";
};

onMounted(() => {
  loadComments();
});
</script>

<style scoped>
.topic-detail {
  padding: 20px;
}
.topic-header, .topic-footer {
  display: flex;
  justify-content: space-between;
}
.topic-body img {
  max-width: 100%;
  height: auto;
}
.comments {
  overflow-y: auto;
  max-height: 400px; /* 设置一个合理的高度以便触发滚动 */
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
  border-bottom: 1px solid #ddd; /* 添加分割线 */
  border-radius: 10px;
}
.comment-footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
}
.comment-content {
  text-align: left; /* 评论内容靠左显示 */
}
.replies-toggle {
  color: gray;
  cursor: pointer;
  transition: color 0.3s;
  text-align: center; /* 居中显示 */
}
.replies-toggle:hover {
  color: black;
}
.click-reply {
  color: gray;
  cursor: pointer;
  text-align: center; /* 居中显示 */
  transition: color 0.3s;
}

.click-reply:hover {
  color: black;
}

.reply-card {
  margin-top: 10px;
  padding: 5px;
  border-left: 2px solid #ddd;
  text-align: left; /* 回复内容靠左显示 */
}
.reply-time {
  font-size: 0.8em;
  color: #888;
}
.total-replies {
  text-align: center; /* 总回复数居中显示 */
  margin: 10px 0; /* 添加一些上下间距 */
}

.reply-input {
  display: flex;
  align-items: center; /* 输入框和发送图标垂直居中 */
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
  color: #effffb;
  background-color: #effffb;
  outline-color: rgb(65, 65, 65);
  box-shadow: -3px -3px 15px rgb(65, 65, 65);
  transition: .1s;
  transition-property: box-shadow;
}

.send-icon {
  margin-left: -35px; /* 让图标覆盖输入框内 */
  cursor: pointer;
  color: white;
  width: 24px;
  height: 24px;
}
</style>
