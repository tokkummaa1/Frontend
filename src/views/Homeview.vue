<template>
  <div class="home-view container mx-auto px-4 py-8 max-w-7xl">

    <!-- Loading State -->
    <div v-if="loading" class="space-y-12">
      <!-- Hero Banner Skeleton -->
      <div class="bg-gray-200 rounded-xl p-8 md:p-12 mb-12 animate-pulse">
        <div class="max-w-3xl mx-auto space-y-4">
          <div class="h-10 bg-gray-300 rounded w-3/4"></div>
          <div class="h-6 bg-gray-300 rounded w-1/2"></div>
          <div class="h-12 bg-gray-300 rounded w-40"></div>
        </div>
        
      </div>

      <!-- Featured Courses Skeleton -->
      <div class="space-y-8">
        <div class="h-8 bg-gray-200 rounded w-1/4"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          <div v-for="n in 9" :key="n" class="bg-white p-6 rounded-lg shadow-sm">
            <div class="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div class="mt-4 space-y-2">
              <div class="h-5 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loaded State -->
    <div v-else>
      <!-- Hero Banner -->
    <div class="bg-primary rounded-xl p-8 md:p-12 mb-12 text-center md:text-left">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Start Learning with EduLearn</h1>
        <p class="text-lg md:text-xl text-white opacity-90 mb-8">Explore thousands of courses in various fields from our website.</p>
        <router-link 
          to="/courses/:id"
          class="inline-block px-8 py-3 text-lg font-medium bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
        >
          Browse Courses
        </router-link>
      </div>
    </div>

      <!-- Featured Courses -->
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Featured Courses</h2>
      <div v-if="courses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
        <CourseCard 
          v-for="course in courses.slice(0, 9)"
          :key="course.id"
          :course="course"
        />
      </div>
      
      <div v-else class="text-center text-gray-500 py-12">
        <i class="fas fa-book-open text-4xl mb-4"></i>
        <p>No courses available yet</p>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/axios';
import CourseCard from '@/components/cards/CourseCard.vue';
import Footer from '@/components/Footer.vue';

const courses = ref([]);
const loading = ref(true);

const fetchCourses = async () => {
    loading.value = true;
  try {
    const response = await api.get('/api/v1/courses/');
    courses.value = response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    courses.value = []; // Reset on error
  } finally {
    loading.value = false;
  }
};

// Keep the rest of your code
const handleEnrollment = async (courseId) => {
  try {
    await api.post(`/api/v1/courses/${courseId}/enroll/`);
    
    // Update local state immediately
    const course = courses.value.find(c => c.id === courseId);
    if (course) {
      course.enrollments_count += 1;
      course.is_enrolled = true;
      
      // Add to My Courses immediately
      const enrollmentResponse = await api.get(`/api/v1/courses/${courseId}/`);
      courses.value.push(enrollmentResponse.data);
    }
  } catch (error) {
    console.error('Enrollment failed:', error);
  }
};

const handleRefresh = async () => {
  await fetchCourses();
};

onMounted(fetchCourses);
</script>