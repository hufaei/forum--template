
  
  import { ref } from 'vue';
  import { useRequest, type ResponseData} from '@miitvip/admin-pro';
  import { ElMessage } from 'element-plus';
  import { getRequestConfig } from '@/utils/RequestConfig';
import config from '@/utils/Config';
  
  const { $request } = useRequest();
  
  const followsList = ref<Follower[]>([]);
  const errorMessage = ref<string | null>(null);
  
  const rconfig = getRequestConfig()
  
  const getFollows = async (userId: number) => {
    try {
      const response: ResponseData = await $request.get(`${config.baseURL}/follows/get/vo/${userId}`,{}, rconfig);
  
      if (response.ret.code === 200) {
        followsList.value = response.data as Follower[];
      } else {
        errorMessage.value = response.ret.message;
        ElMessage.error(response.ret.message);
      }
    } catch (error) {
      console.error('Failed to fetch follows list:', error);
      errorMessage.value = '获取关注列表失败，请重试。';
      ElMessage.error('获取关注列表失败，请重试。');
    }
  };
  const checkMutualFollow = async (followerId: number, followeeId: number): Promise<boolean> => {
    try {
      const response: ResponseData = await $request.post(
        `${config.baseURL}/follows/checkMutualFollow`,
        {
          "follower_id":followerId,
          "followee_id":followeeId
        },
        rconfig);
      return response.ret.code === 200 && response.data === true;
    } catch (error) {
      console.error('Failed to check mutual follow:', error);
      ElMessage.error('检查互相关注失败，请重试。');
      return false;
    }
  };
  const toggle = async (followerId: number, followeeId: number): Promise<boolean> => {
    try {
      const response: ResponseData = await $request.post(
        `${config.baseURL}/follows/toggle`,
        {
          "followerId":followerId,
          "followeeId":followeeId
        },
        rconfig);
      return response.ret.code === 200 && response.data === true;
    } catch (error) {
      console.error('Failed');
      ElMessage.error('错误，请重试');
      return false;
    }
  };
  export { getFollows, followsList, checkMutualFollow, errorMessage ,toggle};
  export interface Follower {
    id: number;
    followerId: number;
    followeeId: number;
    nickname: string;
    avatar: string;
    self_intro: string;
    isMutual: boolean
  }