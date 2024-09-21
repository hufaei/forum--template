// src/utils/RequestConfig.ts
import { useUserStore } from '@/stores/userStore';
import { type RequestConfig } from '@miitvip/admin-pro';
import config from '@/utils/Config'; // 引入配置文件
import { createPinia, setActivePinia } from 'pinia';

// 创建 Pinia 实例
const pinia = createPinia();

// 手动设置 active Pinia
setActivePinia(pinia);

/**
 * 生成请求配置
 * @returns {RequestConfig} 请求配置对象
 */
export const getRequestConfig = (): RequestConfig => {
  const userStore = useUserStore();
  const token = userStore.token; 
  console.log(config.baseURL)
  
  return {
    baseURL: config.baseURL,
    headers: {
      'Content-Type': 'application/json',
      'satoken': token // 添加额外的 headers
    },
    retry: 3,
    retryDelay: 100,
    retryCount: 0,
    responseType: 'json',
    withCredentials: false // 若携带凭证--自动传入 satoken 字段的 cookie（可在后端设置如何读取）
  };
};

/**
 * 生成上传图片的请求配置
 * @returns {RequestConfig} 请求配置对象
 */
export const ImageRConfig = (): RequestConfig => {
  const userStore = useUserStore();
  const token = userStore.token; 
  
  return {
    baseURL: config.baseURL, // 使用配置文件中的 baseURL
    headers: {
      'Content-Type': 'multipart/form-data', // 上传图片时的 Content-Type
      'satoken': token
    },
    retry: 3,
    retryDelay: 100,
    retryCount: 0,
    responseType: 'json',
    withCredentials: false 
  };
};
