
import { getRequestConfig } from '@/utils/RequestConfig';
import { useRequest, type ResponseData} from '@miitvip/admin-pro';
import { ElMessage } from 'element-plus';

const { $request } = useRequest();
const rconfig=getRequestConfig()

const fetchSections = async () => {
  try {
    const response: ResponseData = await $request.get('http://localhost:8080/sections/all',{},rconfig);
    if (response.ret.code === 200) {
      return response.data;
    } else {
      ElMessage.error(response.ret.message);
      throw new Error(response.ret.message);
    }
  } catch (error) {
    ElMessage.error('获取板块列表失败，请重试。');
    throw error;
  }
};

export { fetchSections };
export interface Section {
    id: number;
    name: string;
    description: string;
  }