<template>
  <div>
    <h2>Section View</h2>
    <SectionComponent />
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import SectionComponent from '@/components/sections/SectionComponent.vue'; // 根据你的实际路径调整导入路径
</script>

<style scoped>
h2 {
  color: #2c3e50;
  text-align: center;
}
</style>