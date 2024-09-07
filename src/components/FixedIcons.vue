<template>
  <div class="fixed-icons">
    <!-- 悬停时显示通知窗口 -->
    <div class="icon-container" @mouseover="setActiveIcon('announce')" @mouseleave="setActiveIcon('')">
      <el-image 
        :src="activeIcon === 'announce' ? announceActive : announce" 
        alt="Announce" 
        class="ficon"
      />
      <el-card v-if="activeIcon === 'announce'" class="notification-popup">
        <template #header>
          <div class="card-header">
            <span>通知：</span>
            <span style="font-size: 10px;">只展示最新的三条记录</span>
          </div>
        </template>
        <div v-for="announcement in announcements" :key="announcement.id" class="text-item">
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
        @click="getdialog" 
      />
    </div>

    <el-dialog v-model="showFeedbackModal" title="反馈" width="30%" center>
      <el-form>
        <el-form-item label="问题描述:">
          <el-input
            type="textarea"
            placeholder="请输入反馈内容"
            :rows="4"
            :maxlength="100"
            show-word-limit
            v-model="feedbackContent"
            class="feedback-textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showFeedbackModal = false" round style="button">取消</el-button>
          <el-button type="primary" round @click="submitFeedback">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <mi-backtop
      :width="40"
      :height="40"
      :radius="48"
      :offset="10"
      :duration="1000"
      tip="回到顶部"
      :position="{bottom: 130, right: 40 }"
      background="#0000"
      :icon="createVNode('img', { src: activeIcon === 'gotop' ? gotopActive : gotop, class: 'ficon' })"
    />
  </div>
</template>

<script setup lang="ts">
import { createVNode } from 'vue';
import { ref, onMounted } from 'vue';

// 导入图标
import announce from '@/assets/announce.png';
import announceActive from '@/assets/announce-a.png';
import gotop from '@/assets/gotop.png';
import gotopActive from '@/assets/gotop-a.png';
import feedback from '@/assets/feedback.png';
import feedbackActive from '@/assets/feedback-a.png';
import { fetchAnnouncements, announcements } from '@/requestMethod/useAnnouncements';

// 定义状态
const activeIcon = ref<string>(''); // 控制哪个图标被激活
const showFeedbackModal = ref<boolean>(false); // 控制反馈弹窗显示状态
const feedbackContent = ref<string>(''); // 反馈内容

// 设置当前激活的图标
const setActiveIcon = (iconName: string): void => {
  activeIcon.value = iconName;
};

// 打开反馈弹窗
const getdialog = (): void => {
  showFeedbackModal.value = true;
};

// 提交反馈
const submitFeedback = (): void => {
  console.log('提交反馈:', feedbackContent.value);
  showFeedbackModal.value = false;
  alert('反馈已提交！');
};

// 在组件挂载时加载通知数据
onMounted(async () => {
  await fetchAnnouncements();
  console.log(announcements);
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
.ficon {
  width: 40px;
  height: 40px;
}
.text-item {
  font-size: 12px;
}
button {
  width: 30%;
  background-color: white;
  color: black;
  font-size: 15px;
  padding: 1em 2em;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 1px solid rgb(158, 168, 167);
  box-shadow: 0 0 0 0 rgb(25, 25, 25);
}
button:hover {
  transform: translateY(-4px) translateX(-2px);
  box-shadow: 2px 5px 0 0 rgb(31, 31, 31);
}
</style>
