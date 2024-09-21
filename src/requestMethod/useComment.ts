import config from '@/utils/Config';
import { getRequestConfig } from '@/utils/RequestConfig';
import { useRequest, type ResponseData} from '@miitvip/admin-pro';
import { ElMessage } from 'element-plus';

const { $request } = useRequest();
const rconfig = getRequestConfig()

const fetchComments = async (topicId: number,current: number) => {
  try {
    const response: ResponseData = await $request.get(`${config.baseURL}/comments/get/commentsVo/${topicId}/${current}`, {}, rconfig);
    if (response.ret.code === 200) {
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('获取评论失败，请重试。');
    throw error;
  }
};
const fetchViewCount = async () => {
  try {
    const response: ResponseData = await $request.get(`${config.baseURL}/comments/getTopViewCounts`, {}, rconfig);
    if (response.ret.code === 200) {
      console.log(response.data)
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('获取浏览量失败，请重试。');
    throw error;
  }
};
const submitCommentApi = async (comment: { content: string; topicId: number; userId: number }) => {
  try {
    const response: ResponseData = await $request.post(`${config.baseURL}/comments/add`, comment, rconfig);
    if (response.ret.code === 200) {
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('提交评论失败，请重试。');
    throw error;
  }
};

export { fetchComments, submitCommentApi ,fetchViewCount};
export interface Comment {
  id: number;
  userId: number;
  nickName: string;
  content: string;
  createdAt: string;
}