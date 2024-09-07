import { getRequestConfig } from '@/utils/RequestConfig';
import { useRequest, type ResponseData} from '@miitvip/admin-pro';
import { ElMessage } from 'element-plus';
import type { Ref } from 'vue';

const { $request } = useRequest();
const rconfig = getRequestConfig()

const fetchTopics = async (sectionId: number,current:number) => {
  try {
    const response: ResponseData = await $request.get(`http://localhost:8080/topics/get/TopicsVo/${sectionId}/${current}`, {}, rconfig);
    if (response.ret.code === 200) {
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('获取话题列表失败，请重试。');
    throw error;
  }
};
const fetchTopic = async (topicId: number) => {
  try {
    const response: ResponseData = await $request.get(`http://localhost:8080/topics/get/TopicVo/${topicId}`, {}, rconfig);
    if (response.ret.code === 200) {
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('获取话题列表失败，请重试。');
    throw error;
  }
};

const fetchTopicsByUserId = async (userId: number) => {
  try {
    const response: ResponseData = await $request.get(`http://localhost:8080/topics/get/TopicsVoByUserId/${userId}`, {}, rconfig);
    if (response.ret.code === 200) {
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('根据用户ID获取话题列表失败，请重试。');
    throw error;
  }
};
const addTopic = async (data: { content: string; image:string[] ; sectionId: number; userId: number }) => {
  try {
    const response: ResponseData = await $request.post(`http://localhost:8080/topics/add`, data, rconfig);
    if (response.ret.code === 200) {
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('发布话题失败，请重试。');
    throw error;
  }
};

// 添加删除话题的方法
const deleteTopic = async (topicId: number) => {
  try {
    const response: ResponseData = await $request.post(`http://localhost:8080/topics/delete`, 
    { "id":topicId }
    , rconfig);
    if (response.ret.code === 200) {
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('删除话题失败，请重试。');
    throw error;
  }
};
export { fetchTopics, fetchTopic, fetchTopicsByUserId, addTopic, deleteTopic};

export interface Topic {
  id: number;
  userId: number;
  image: string | null;
  content: string;
  createdAt: string;
}
