import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import MakeitAdminPro from '@miitvip/admin-pro'
import { Layout, Login, Register } from '@miitvip/admin-pro'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/userStore';
import VueNavigationBar from 'vue-navigation-bar';
import 'vue-navigation-bar/dist/vue-navigation-bar.css';
import GoEasy from 'goeasy';

const goEasy = GoEasy.getInstance({
    host: 'hangzhou.goeasy.io', //应用所在的区域地址: [hangzhou.goeasy.io, 新加坡暂不支持IM，敬请期待]
    appkey: 'xxxxxxxx自己的key', // common key,
    modules: ['pubsub','im'],
});

// import axios from './utils/axios';
const app = createApp(App)
// 创建 pinia 实例
const pinia = createPinia();
// 注册 pinia 到 Vue 应用
app.use(pinia);

app.use(router)
app.use(ElementPlus)
app.use(MakeitAdminPro)
app.use(VueNavigationBar); 

const components = [Layout, Login, Register]
components.forEach((component) => app.use(component))
const userStore = useUserStore();
if (localStorage.getItem('user')) {
  userStore.setUser(JSON.parse(localStorage.getItem('user') || '{}'));
  }

app.provide('GoEasy', GoEasy);
app.provide('goEasy', goEasy);

app.mount('#app')
