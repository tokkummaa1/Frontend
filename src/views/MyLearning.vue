<template>
  <div class="my-learning-container">
    <div v-if="loading" class="text-center p-8">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
      <p class="mt-2 text-gray-600">Loading course content...</p>
    </div>
    
    <VideoCard 
      v-else-if="currentCourse" 
      :course="currentCourse" 
      @back="router.push('/my-courses')"
    />
    
    <div v-else class="text-center p-8 text-gray-500">
      <i class="fas fa-exclamation-circle text-3xl mb-4"></i>
      <p>Course not found</p>
      <button 
        @click="router.push('/my-courses')"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Back to My Courses
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseStore } from '@/store/courseStore';
import VideoCard from '@/components/cards/VideoCard.vue';

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const currentCourse = ref(null);
const loading = ref(true);

const loadCourse = async () => {
  loading.value = true;
  try {
    const courseId = parseInt(route.params.courseId);
    await courseStore.fetchEnrolledCourses(); // Refresh course data
    currentCourse.value = courseStore.enrolledCourses.find(c => c.id === courseId);
    
    if (!currentCourse.value) {
      throw new Error('Course not found');
    }
  } catch (error) {
    console.error('Error loading course:', error);
    router.replace('/my-courses');
  } finally {
    loading.value = false;
  }
};

onMounted(loadCourse);
watch(() => route.params.courseId, loadCourse);
</script>