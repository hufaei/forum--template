import { ref } from 'vue';
import { useRequest, type ResponseData } from '@miitvip/admin-pro';
import { ElMessage } from 'element-plus';
import { getRequestConfig } from '@/utils/RequestConfig';

const { $request } = useRequest();

const announcements =  ref<Announcement[]>([]);
const errorMessage = ref<string | null>(null);
const currentPage = ref(1);
const pageSize = ref(3);
const total = ref(0);
const searchText = ref('');
const sortField = ref('updatedAt');
const sortOrder = ref('descend');
const rconfig = getRequestConfig()
const fetchAnnouncements = async () => {
  try {
    const response: ResponseData = await $request.post(
      'http://localhost:8080/announcements/list/page',
      {
        current: currentPage.value,
        pageSize: pageSize.value,
        id: null,
        searchText: searchText.value,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
      },rconfig
    );
    
    if (response.ret.code === 200) {
      announcements.value = response.data.records;
      total.value = response.data.total;
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
    }
  } catch (error) {
    errorMessage.value = '获取通知列表失败，请重试。';
    ElMessage.error('获取通知列表失败，请重试。');
  }
};

export { fetchAnnouncements, announcements, errorMessage,  total, searchText, sortField, sortOrder };
// 在 useAnnouncements.ts 文件中
export interface Announcement {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}