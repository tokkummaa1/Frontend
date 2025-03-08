<template>
  <div class="course-page container mx-auto px-4 py-8 max-w-7xl">
    <h1 class="text-3xl font-bold mb-8">All Courses</h1>

    <div v-if="loading" class="text-center">
      <i class="fas fa-spinner fa-spin text-2xl"></i>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
      <CourseCard v-for="course in courses" :key="course.id" :course="course" @enrolled="handleEnrollment" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/axios';
import CourseCard from '@/components/cards/CourseCard.vue'; // Import CourseCard

const route = useRoute();
const courses = ref([]); // Changed from single course to courses array
const loading = ref(true);

onMounted(async () => {
  try {
    // Fetch all courses
    const response = await api.get('/api/v1/courses/');
    courses.value = response.data;
  } catch (error) {
    console.error('Error loading courses:', error);
  } finally {
    loading.value = false;
  }
});


const handleEnrollment = (courseId) => {
  const course = courses.value.find(c => c.id === courseId);
  if (course) {
    course.enrollments_count += 1;
    course.is_enrolled = true;
  }
};
</script>

