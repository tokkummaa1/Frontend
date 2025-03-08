<!-- App.vue -->
<template>
  <div id="app">
    <NavBar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue';


import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useEnrollmentStore } from '@/store/enrollmentStore';


const authStore = useAuthStore();


const enrollmentStore = useEnrollmentStore();

onMounted(async () => {
  if (authStore.isAuthenticated) {  // Check using auth store's computed property
    await enrollmentStore.fetchEnrollmentCount();
  }
});
</script>