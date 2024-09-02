<template>
      <div class="fixed-icons">
        <!-- 悬停时显示通知窗口 -->
        <div class="icon-container" @mouseover="setActiveIcon('announce')" @mouseleave="setActiveIcon('')">
          <el-image 
            :src="activeIcon === 'announce' ? announceActive : announce" 
            alt="Announce" 
            class="ficon"
          />
          <!-- 悬停时的通知窗口 -->
          <el-card v-if="activeIcon === 'announce'" class="notification-popup">
            <template #header>
              <div class="card-header">
                <span>通知：</span>
                <span style="font-size: 10px;">只展示最新的三条记录</span>
              </div>
            </template>
            <!-- 遍历通知列表 -->
            <div v-for="announcement in announcements" :key="announcement.id" class="text-item" >
                {{ announcement.title }}：{{ announcement.content }} 
                <div style="color: rgb(147, 198, 196);">
                    {{ new Date(announcement.updatedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
                </div>
            </div>
          </el-card>
        </div>
  
        <!-- 弹出反馈窗口 -->
        <div class="icon-container" @mouseover="setActiveIcon('feedback')" @mouseleave="setActiveIcon('')">
          <el-image 
            :src="activeIcon === 'feedback' ? feedbackActive : feedback" 
            alt="Feedback" 
            class="ficon"
            @click="showFeedbackModal = true" 
          />
        </div>
          <!-- 返回顶部按钮 -->
          <div class="icon-container" @mouseover="setActiveIcon('gotop')" @mouseleave="setActiveIcon('')">
            <el-image 
              :src="activeIcon === 'gotop' ? gotopActive : gotop" 
              alt="GoTop" 
              class="ficon"
              @click="scrollToTop" 
            />
          </div>
        <!-- 反馈弹窗 -->
        <el-dialog v-if=showFeedbackModal title="反馈">
          <p>在这里输入你的反馈内容。</p>
          <template v-slot:footer>
            <span class="dialog-footer">
              <el-button @click="showFeedbackModal = false">取消</el-button>
              <el-button type="primary" @click="submitFeedback">提交</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  
  // 导入图标
  import announce from '@/assets/announce.png';
  import announceActive from '@/assets/announce-a.png';
  import gotop from '@/assets/gotop.png';
  import gotopActive from '@/assets/gotop-a.png';
  import feedback from '@/assets/feedback.png';
  import feedbackActive from '@/assets/feedback-a.png';
  import {fetchAnnouncements, announcements} from '@/requestMethod/useAnnouncements';
  // 定义状态
  const activeIcon = ref<string>(''); // 控制哪个图标被激活
  const showFeedbackModal = ref<boolean>(false); // 控制反馈弹窗显示状态
  
  // 设置当前激活的图标
  const setActiveIcon = (iconName: string): void => {
    activeIcon.value = iconName;
  };
  
  // 返回顶部功能
  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  // 提交反馈功能
  const submitFeedback = (): void => {
    showFeedbackModal.value = false;
    // 在此处理反馈提交逻辑...
    alert('反馈已提交！');
  };
  // 在组件挂载时连接 GoEasy
    onMounted(async () => {
        await fetchAnnouncements();
        console.log(announcements)
    });
  </script>
  
  <style scoped>
  .fixed-icons {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    position: fixed;
    right: 2.5rem;
    bottom: 2rem;
    z-index: 1000;
  }
  .icon-container {
    position: relative;
  }
  
  .notification-popup {
    position: absolute;
    left: -330px; /* 显示在图标的左侧 */
    top: -200px;
    width: 320px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 10px;
    z-index: 1000;
    text-align: left;
  }
  .ficon{
    width: 40px;
    height: 40px;
  }
  .text-item{
    font-size: 12px;
  }
  </style>
  