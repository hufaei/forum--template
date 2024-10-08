import { ref } from 'vue';

import { useRequest, type ResponseData} from '@miitvip/admin-pro';
import { ElMessage } from 'element-plus';
import { getRequestConfig,ImageRConfig } from '@/utils/RequestConfig'; // 导入配置函数
const { $request } = useRequest();


const errorMessage = ref<string | null>(null);
const rconfig = getRequestConfig()
const iconfig = ImageRConfig()

interface UsersUpdateRequest {
  id: number;
  nickname: string;
  avatar: string;
  self_intro: string;
}

import { useUserStore } from '@/stores/userStore';
import config from '@/utils/Config';
const userStore = useUserStore();
const loginUser = async (usernameOrEmail: string, password: string) => {
  try {
    const response: ResponseData = await $request.post(`${config.baseURL}/users/login`, {
      "password": password,
      "usernameOrEmail": usernameOrEmail
    }, rconfig);

    if (response.ret.code === 200) {
      const user = response.data;
      const token = response.ret.message; // 从响应头中提取 token

      userStore.setUser(user);
      userStore.setToken(token); // 存储 token
      ElMessage.success('登录成功');
      
      return true;
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
      return false;
    }
  } catch (error) {
    console.error('Login failed:', error);
    errorMessage.value = '登录失败，请重试。';
    ElMessage.error('登录失败，请重试。');
    return false;
  }
};

const updateUser = async (data: Partial<UsersUpdateRequest>) => {
  try {
    const user = userStore.user;
    const updatedData: UsersUpdateRequest = {
      id: user.id,
      nickname: data.nickname || user.nickname,
      avatar: data.avatar || user.avatar,
      self_intro: data.self_intro || user.self_intro
    };

    const response: ResponseData = await $request.post(`${config.baseURL}/users/update`, updatedData, rconfig);

    if (response.ret.code === 200 && response.data === true) {
      userStore.updateUser(updatedData);
      ElMessage.success('用户信息更新成功');
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
    }
  } catch (error) {
    console.error('Update failed:', error);
    errorMessage.value = '更新失败，请重试。';
    ElMessage.error('更新失败，请重试。');
  }
};
const getUserVo = async (userId: number) => {
  try{
    const response: ResponseData = await $request.get(`${config.baseURL}/users/get/vo/${userId}`, {}, rconfig);
    if(response.ret.code == 200){
      return response.data;
      // ElMessage.success('用户信息更新成功');
    }
  }catch(error){
    console.error('get user-information failed:', error);
    errorMessage.value = '获取用户信息失败';
    ElMessage.error('获取用户信息失败');
  }

};
const getTopUsers = async () => {
  try{
    const response: ResponseData = await $request.get(`${config.baseURL}/users/topUsers`, {}, rconfig);
    if(response.ret.code == 200){
      return response.data;
    }
  }catch(error){
    console.error('get user-information failed:', error);
    errorMessage.value = '获取用户信息失败';
    ElMessage.error('获取用户信息失败');
  }

};

// 登出方法
const logoutUser = async () => {
  try {
    const response: ResponseData = await $request.post(`${config.baseURL}/users/logout`, {}, rconfig);

    if (response.ret.code === 200 && response.data === true) {
      userStore.clear(); // 清除本地的用户信息和 token
      ElMessage.success('登出成功');
      return true;
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
      return false;
    }
  } catch (error) {
    console.error('Logout failed:', error);
    errorMessage.value = '登出失败，请重试。';
    ElMessage.error('登出失败，请重试。');
    return false;
  }
};
// 注销方法
const destroy = async () => {
  try {
    const response: ResponseData = await $request.post(`${config.baseURL}/users/self/delete`, {}, rconfig);

    if (response.ret.code === 200 && response.data === true) {
      userStore.clear(); // 清除本地的用户信息和 token
      ElMessage.success('注销成功');
      return true;
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
      return false;
    }
  } catch (error) {
    console.error('destroy failed:', error);
    errorMessage.value = '请重试。';
    ElMessage.error('请重试。');
    return false;
  }
};

interface RegisterData {
  username: string;
  password: string;
  email: string;
  confirm: string;
}

// 注册方法
const register = async (data: RegisterData) => {
  try {
    const response: ResponseData = await $request.post(
      `${config.baseURL}/users/add`,
      {
        nickname: data.username,
        password: data.password,
        email: data.email, // 作为账号
        confirm: data.confirm,
        username: data.email
      },
      rconfig
    );

    if (response.ret.code === 200) {
      ElMessage.success('注册成功');
      return true;
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
      return false;
    }
  } catch (error) {
    console.error('注册失败:', error);
    errorMessage.value = '注册失败，请重试。';
    ElMessage.error('注册失败，请重试。');
    return false;
  }
};
// 發送驗證碼方法
const sendEmail = async (email: string) => {
  try {
    const response: ResponseData = await $request.post(
      `${config.baseURL}/users/sendEmail/${email}`,
      {},
      rconfig
    );

    if (response.ret.code === 200 && response.data === true) {
      ElMessage.success('驗證碼發送成功');
      return true;
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
      return false;
    }
  } catch (error) {
    errorMessage.value = '發生失败，请稍後重试。';
    ElMessage.error('注册失败，请重试。');
    return false;
  }
};
// 驗證方法
const verifyCode = async (Email: any,Code:number) => {
  try {
    const response: ResponseData = await $request.post(
      `http://47.108.166.11:8081/users/verifyCode`,
      {
        email:Email,
        code:Code
      },
      rconfig
    );

    if (response.ret.code === 200 && response.data === true) {
      return true;
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
      return false;
    }
  } catch (error) {
    errorMessage.value = '驗證碼錯誤';
    ElMessage.error('驗證碼錯誤，请重试。');
    return false;
  }
};
// 驗證郵箱方法
const verifyEmail = async (Email: string) => {
  try {
    const response: ResponseData = await $request.post(
      `http://47.108.166.11:8081/users/verifyEmail/${Email}`,
      { },
      rconfig
    );

    if (response.ret.code === 200 && response.data === true) {
      return true;
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
      return false;
    }
  } catch (error) {
    errorMessage.value = '用戶不存在';
    ElMessage.error('用戶不存在');
    return false;
  }
};
// 修改密碼
const changePwd = async (username:string,password:string) => {
  try {
    const response: ResponseData = await $request.post(
      `http://47.108.166.11:8081/users/changePassword`,
      {
        email:username,
        password:password},
      rconfig
    );

    if (response.ret.code === 200 && response.data === true) {
      return true;
    } else {
      errorMessage.value = response.ret.message;
      ElMessage.error(response.ret.message);
      return false;
    }
  } catch (error) {
    errorMessage.value = '修改失敗，請提交問題反饋';
    ElMessage.error('修改失敗，請提交問題反饋');
    return false;
  }
};
const uploadAvatar = async (file: File) => {
  try {
    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('file', file); // 添加文件到 FormData

    // 发起 POST 请求
    const response: ResponseData = await $request.post(
      `${config.baseURL}/users/updateAvatar`,
      formData,
      iconfig
    );

    if (response.ret.code === 200) {
      ElMessage.success('上传成功');
      return response.ret.message;
    } else {
      ElMessage.error(response.ret.message);
      return false;
    }
  } catch (error) {
    console.error('上传失败:', error);
    ElMessage.error('上传失败，请重试。');
    return false;
  }
};
export { getUserVo,changePwd, verifyEmail,verifyCode,sendEmail,updateUser, getTopUsers,loginUser, destroy,logoutUser,register,uploadAvatar ,errorMessage };