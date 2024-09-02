<!-- MainPage.vue -->
<template>
  <router-view />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const user = computed(() => userStore.user);

const formattedDate = computed(() => {
  const date = new Date(user.value.createdAt);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
});
</script>