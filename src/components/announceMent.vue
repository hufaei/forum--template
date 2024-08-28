<template>
    <div>
      <el-input v-model="searchText" placeholder="Search..." @change="fetchAnnouncements" style="margin-bottom: 20px;"></el-input>
      <el-table :data="announcements" style="width: 100%">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="title" label="Title"></el-table-column>
        <el-table-column prop="content" label="Content"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px;"
      ></el-pagination>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { fetchAnnouncements, announcements, errorMessage, currentPage, pageSize, total, searchText, sortField, sortOrder } from '@/requestMethod/useAnnouncements';
  
  // 页面加载时获取数据
  onMounted(() => {
    fetchAnnouncements();
  });
  
  // 监听分页变化
  const handlePageChange = (page: number) => {
    currentPage.value = page;
    fetchAnnouncements();
  };
  
  // 监听页面大小变化
  const handleSizeChange = (size: number) => {
    pageSize.value = size;
    fetchAnnouncements();
  };
  </script>
  
  <style scoped>
  /* 样式可以根据需要进行调整 */
  </style>