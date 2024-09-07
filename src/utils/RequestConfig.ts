import { useUserStore } from '@/stores/userStore';
import { type RequestConfig } from '@miitvip/admin-pro';
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
  

  return {
    headers: {
      'Content-Type': 'application/json',
      'satoken':token
    },
    retry: 3,
    retryDelay: 100,
    retryCount: 0,
    responseType: 'json',
    withCredentials: false // 允许携带凭证---目前不明原因的报错因此解决但是我知道这允许cookies自动传入satoken
  };
};
export const ImageRConfig = (): RequestConfig => {
  const userStore = useUserStore();
  const token = userStore.token; 
  

  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      'satoken':token
    },
    retry: 3,
    retryDelay: 100,
    retryCount: 0,
    responseType: 'json',
    withCredentials: false // 允许携带凭证---目前不明原因的报错因此解决但是我知道这允许cookies自动传入satoken
  };
};