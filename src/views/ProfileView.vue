<template>
    <el-container id="uservo">
        <div style="padding: 20px; background-color: #f4f5f7;display: flex; flex-direction: column; width:80%;height:100%">
          <div class="header">
            <el-image :src="displayUser.avatar" alt="Avatar" class="avatar" shape="square" />
            <div class="profile-info">
              <div style="display: flex; flex-direction: row; align-items: baseline;">
                <h1 class="username">{{ displayUser.nickname }}</h1>
                <div class="status">在线</div>
                <div class="created-at">（于{{ formattedDate }}日来到论坛）</div>
              </div>
              <p>{{ displayUser.self_intro }}</p>
              <p v-if="isCurrentUser">邮箱：{{ displayUser.email }}</p>
              <div v-if="!isCurrentUser" style="display: flex; flex-direction: row; justify-content: space-evenly;">
                <el-button type="primary" @click="sendMessage(displayUser)">发送消息</el-button>
                <el-button size="small" @click="toggleothorfollow(Number(route.params.userId))">
                {{ isMutual ? '互相关注' : '已关注' }}
              </el-button>
              </div>
            </div>
          </div>
          <div style="display: flex; direction: column;height:70%">
            <div class="followers-showcase">
              <mi-title :title="isCurrentUser ? '我的动态：' : '他的动态：'" color="#ff5722" :margin="{ top: 24, bottom: 24 }" />
              <el-card class="showcase-item" v-for="(topic, index) in displayUser.topics" :key="topic.id">
                <template v-slot:header>
                  <div class="clearfix">
                    <el-avatar :src="topic.avatar" shape="square" size="default" class="game-avatar" />
                    <div class="game-nickname">{{ topic.nickname }}</div>
                    <el-icon v-if="isCurrentUser" class="d-icon">
                      <img
                        :alt="'删除话题'"
                        class="delete-icon"
                        @mouseover="hoverIndex = index"
                        @mouseleave="hoverIndex = null"
                        @click="confirmDelete(topic.id)"
                        :src="hoverIndex === index ? deleteIconHover : deleteIcon"
                      />
                    </el-icon>
                  </div>
                </template>
                <div class="game-content">{{ topic.content }}</div>
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
                <div class="game-footer">
                  <span class="game-time">{{ formatDate(topic.createdAt) }}</span>
                  <mi-link path="http://localhost:5173/main/section" target="_self">
                    {{topic.sectionName}}
                  </mi-link>
                  <div></div>
                  <div class="game-icons">
                    
                    <router-link :to="`/main/topic/${topic.id}`">
                      <div><img src="@/assets/point-re.png" class="game-icon" alt="点赞">
                      <span>{{ topic?.thumbs }}</span></div>
                      
                    </router-link>

                    <router-link :to="`/main/topic/${topic.id}`">
                      <img src="@/assets/comment.png" class="game-icon" alt="评论">
                    </router-link>
                    
                  </div>
                </div>
              </el-card>
              
            </div>
          </div>
        </div>

      <div class="friendscard">
        <h3>{{ isCurrentUser ? '我的关注' : '他的关注' }}</h3>
        <el-row type="flex" justify="space-evenly" align="middle" class="showfollow" v-for="friend in displayUser.follows" :key="friend.id">
          <el-col :span="12">
            <router-link :to="`/profile/${friend.id}`">
              <el-avatar 
                shape="square" 
                :size="60" 
                :src="friend.avatar"
              ></el-avatar>
            </router-link>
          </el-col>
          <el-col :span="12">
            <div>{{ friend.nickname }}</div>
            <el-button v-if="isCurrentUser" size="small" @click="toggleFollow(friend)">
              {{ friend.isMutual ? '互相关注' : '已关注' }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getUserVo } from '@/requestMethod/useUser';
  import { getFollows, followsList, checkMutualFollow, toggle } from '@/requestMethod/useFollowers';
  import { fetchTopicsByUserId } from '@/requestMethod/useTopics';
  import { useOtherUserStore } from '@/stores/otherUserStore';
  import { useUserStore } from '@/stores/userStore';
  import { deleteTopic } from '@/requestMethod/useTopics';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import deleteIcon from '@/assets/delete.png';
  import deleteIconHover from '@/assets/delete-a.png';

  const hoverIndex = ref<number | null>(null);
  interface User {
    id: number;
    avatar: string;
    nickname: string;
    status: string;
    self_intro: string;
    email:string;
    topics: { id: number; avatar: string; nickname: string; content: string; image: string | null; sectionName: string; createdAt: string;thumbs:number|0}[];
    follows: { id: number; avatar: string; nickname: string ;isMutual:boolean}[];
    createdAt: string;
  }
  const displayUser = ref<User>({
    id: 0,
    avatar: '',
    nickname: '',
    status: '在线',
    self_intro: '',
    email: '',
    topics: [],
    follows: [],
    createdAt: ''
  });
  
  const route = useRoute();
  const router = useRouter();
  const otherUserStore = useOtherUserStore();
  const userStore = useUserStore();
  
  const isCurrentUser = computed(() => {
    return displayUser.value.id === userStore.user.id;
  });

  const confirmDelete = async (topicId: number) => {
  ElMessageBox.confirm('确定删除此话题？', '确认删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const result = await deleteTopic(topicId);
        if (result) {
          // 只有在删除成功时才重新加载话题列表
          const userId = Number(route.params.userId) || userStore.user.id;
          const topicsData = await fetchTopicsByUserId(userId);
          if (topicsData) {
            displayUser.value.topics = topicsData.map((topic: any) => ({
              id: topic.id,
              avatar: displayUser.value.avatar,
              nickname: displayUser.value.nickname,
              content: topic.content.length > 50 ? topic.content.substring(0, 50) + '...' : topic.content,
              image: topic.image,
              sectionName: topic.sectionName,
              createdAt: topic.createdAt
            }));
          }
        } else {
          ElMessage.error('删除话题失败，请重试。');
        }
      } catch (error) {
        ElMessage.error('删除话题失败，请重试。');
      }
    })
    .catch(() => {
      // 取消删除时的逻辑
    });
};

  const formattedDate = computed(() => {
    const date = new Date(displayUser.value.createdAt);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' });
  });
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('zh-CN', { hour: 'numeric', minute: 'numeric' });
    }
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' });
  };
  
  const sendMessage = (user: User) => {
    otherUserStore.setOtherUser(user);
    router.push({ name:'ChatRoom' ,params:{id:user.id}});
  };
  
  const toggleFollow = async (friend: any) => {
    const success = await toggle(userStore.user.id, friend.id);
    if (success) {
      friend.isMutual = !friend.isMutual;
      // 可能需要重新获取关注列表
      await getFollows(displayUser.value.id);
    }
  };
  let isMutual=ref<boolean>(true);
  const toggleothorfollow = async(id:any)=>{
    const success = await toggle(userStore.user.id, id);
    if (success) {
      isMutual.value = !isMutual.value;
    }
  };
  
  onMounted(async () => {
    isMutual.value = await checkMutualFollow(userStore.user.id,Number(route.params.userId) );
    const userId = Number(route.params.userId) || userStore.user.id;
    const userData = userId === userStore.user.id ? userStore.user : await getUserVo(userId);
  
    if (userData) {
      displayUser.value = {
        ...displayUser.value,
        id: userData.id,
        avatar: userData.avatar,
        nickname: userData.nickname,
        status: '在线',
        self_intro: userData.self_intro,
        email: userData.email,
        createdAt: userData.createdAt,
      };
  
      const topicsData = await fetchTopicsByUserId(userId);
      if (topicsData) {
        displayUser.value.topics = topicsData.map((topic: any) => ({
          id: topic.id,
          avatar: displayUser.value.avatar,
          nickname: displayUser.value.nickname,
          content: topic.content.length > 50 ? topic.content.substring(0, 50) + '...' : topic.content,
          image: topic.image,
          sectionName: topic.sectionName,
          createdAt: topic.createdAt,
          thumbs:topic.thumbs
        }));
      }
  
      await getFollows(userId);

      if (followsList.value) {
        displayUser.value.follows = await Promise.all(followsList.value.map(async (follower: any) => {
          const isMutual = await checkMutualFollow(userId, follower.followeeId);
          return {
            id: follower.followeeId,
            avatar: follower.avatar,
            nickname: follower.nickname,
            isMutual
          };
        }));
      }
    }
  });
  const topicImages = (imageStr: string | null): string[] => {
  return imageStr ? imageStr.split(',') : [];
};
  </script>
  
  
  <style scoped>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    height: 100vh;
    background: #f4f5f7;
  }
  
  #uservo {
    display: flex;
    flex-direction: row;
    min-height: 100vh;
    width: 100%;
    background-color: #f4f5f7;
  }
  
  .header {
    margin-left: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    height: 30vh;
    width: 80%;
    background-color: #ffffff; 
    justify-content: space-around;
    border-radius: 10px;
    border: 1px solid #ddd; 
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    margin-right: 20px;
    margin: 10px;
  }
  
  .friendscard {
    width: 30%;
    background-color: #ffffff; 
    min-height: 85%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed; 
    right: 3%;
    top: 10%;
    border-radius: 10px; 
    border: 1px solid #ddd; 
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
  }
  
  .main-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    overflow-y: auto;
    height: 100vh;
    background-color: #f4f5f7; 
  }
  
  .showfollow {
    background-color: #ffffff; 
    width: 90%;
    height: 15%;
    margin: 10px;

    border-radius: 10px; 
    border: 1px solid #ddd; 
  }
  
  .el-menu-vertical-demo {
    border-right: none;
  }
  
  .profile-info {
    display: flex;
    flex-direction: column;
  }
  
  .username {
    margin: 0;
  }
  
  .status {
    margin: 5px 0;
  }
  
  .created-at {
    margin-left: 10px;
    font-size: 0.8em;
    color: #ecf0f1;
  }
  
  .summary,
  .recent-activity,
  .followers-showcase {
    width: 80%;
    margin: 20px;
  }
  
  .showcase-item {
    margin-bottom: 10px;
    width: 100%;
    overflow: hidden;
  }
  
  .game-avatar {
    margin-right: 10px;
  }
  
  .game-nickname {
    font-weight: bold;
  }
  
  .game-content {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .game-image {
    margin-top: 10px;
    max-width: 100%;
    height: auto;
  }
  
  .game-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
  }
  
  .game-icons {
    display: flex;
    gap: 10px;
  }
  
  .game-icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
  }
  
  .clearfix {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  
  .delete-icon {
    cursor: pointer;
    transition: transform 0.3s ease, filter 0.3s ease;
    width: 100%;
    height: 100%;
  }
  
  .d-icon {
    margin-left: 550px;
    width: 25px;
    height: 25px;
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
  
  </style>