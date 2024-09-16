import { getRequestConfig } from '@/utils/RequestConfig';
import { useRequest, type ResponseData } from '@miitvip/admin-pro';
import { ElMessage } from 'element-plus';

const { $request } = useRequest();
const rconfig = getRequestConfig();

// 获取回复列表
const fetchReplies = async (commentId: number) => {
  try {
    const response: ResponseData = await $request.get(`http://localhost:8080/replies/get/repliesVo/${commentId}`, {}, rconfig);
    if (response.ret.code === 200) {
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('获取回复列表失败，请重试。');
    throw error;
  }
};

// 添加回复
const addReply = async (data: { commentId: number; content: string; userId: number }) => {
  try {
    const response: ResponseData = await $request.post('http://localhost:8080/replies/add', data, rconfig);
    if (response.ret.code === 200) {
      return response.data; // 新回复的 ID
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('添加回复失败，请重试。');
    throw error;
  }
};

export { fetchReplies, addReply };

export interface Replies {
  id: number;
  userId: number;
  nickName: string;
  content: string;
  createdAt: string;
}
