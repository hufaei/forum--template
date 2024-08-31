<template>
  <mi-login :action="handleSubmit" :background=bg1 :captcha="false" :title="title"/>
  <!-- 显示错误信息 -->
  <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { loginUser } from '@/requestMethod/useUser';
  import bg1 from '@/assets/background.png'

  const title="LISchool";
  const router = useRouter();

  const errorMessage = ref<string | null>(null);

  const handleSubmit = async (data?: any) => {
    const success = await loginUser(data.username, data.password);

    if (success) {
    router.push('/main'); // 登录成功后重定向到主页面
  }
}


/**
 * 自定义登录逻辑事件处理.
 * 如下是 acion 为 string 类型的 url 接口地址时,
 * 默认请求接口时封装的 data 提交数据 ( 自定义时忽略此结构 ):
 * 
 * ```
 * 
 * ```
 */
  //  const data = {
  //      username: '',      // 账户
  //      password: '',                 // 登录密码
  //     //  captcha: true,                      // 是否开启验证码
  //     //  cuid: '',                           // 后端生成用于校验滑块验证码的唯一值
  //     //  remember: true                      // 记住登录状态
  //  }

</script>