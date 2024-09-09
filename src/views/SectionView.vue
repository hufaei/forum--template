<template>
  <div>
    <SectionComponent />
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import SectionComponent from '@/components/sections/SectionComponent.vue'; 
</script>

<style scoped>
h2 {
  color: #2c3e50;
  text-align: center;
}
</style>