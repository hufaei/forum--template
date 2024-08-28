<!-- MainPage.vue -->
<template>

  <div>
    <h1>Welcome, {{ user.nickname }}</h1>
    <p>{{ user.self_intro }}</p>
    <p>Email: {{ user.email }}</p>
    <p>Account created at: {{ formattedDate }}</p>
  </div>
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