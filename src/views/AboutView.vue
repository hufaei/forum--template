<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()

let userId = 100

const goTo = ()=> {
    // router.push("/user/007/name/邓瑞")
    // router.push({ path: '/content', query: { params1: 200, params2: '邓瑞' } })
    router.push({ name: 'content', query: { id: '300'}})
}
</script>

<template>
	<router-link to="/content1/100">路径字符串传参</router-link> <br>
	<!-- 动态属性绑定 -->
    <router-link :to="{ path: '/content', query: { id: 200 } }">查询字符串传参 - 动态属性绑定</router-link> <br>
	<!-- 定义路由名称 -->
	<router-link :to="{ name: 'content1', params: { id: '300'}}">路径传参 - 定义路由名称</router-link> <br>
	<!-- 编程式导航 -->
	<button @click="goTo()">编程式导航</button>
</template>

<style scoped>

</style>