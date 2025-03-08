<template>
  <div class="my-courses container mx-auto px-4 py-8 max-w-7xl">
    <h1 class="text-3xl font-bold mb-4">My Enrolled Courses ({{ enrollmentStore.count }})</h1>
    
    <!-- Tabs Navigation -->
    <div class="tabs mb-8 border-b border-gray-200">
      <button 
        @click="activeTab = 'ongoing'"
        :class="{ 'text-blue-600 border-blue-600': activeTab === 'ongoing' }"
        class="px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-colors"
      >
        Ongoing ({{ ongoingCourses.length }})
      </button>
      <button 
        @click="activeTab = 'completed'"
        :class="{ 'text-blue-600 border-blue-600': activeTab === 'completed' }"
        class="px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-colors"
      >
        Completed ({{ completedCourses.length }})
      </button>
    </div>

    <div v-if="loading" class="text-center">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
      <p class="mt-2 text-gray-600">Loading your courses...</p>
    </div>

    <template v-else>
      <!-- Ongoing Courses -->
      <div v-if="activeTab === 'ongoing'">
        <div v-if="ongoingCourses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          <EnrolledCourseCard 
            v-for="course in ongoingCourses" 
            :key="course.id" 
            :course="course"
          />
        </div>
        <div v-else class="text-center text-gray-500 py-12">
          <i class="fas fa-running text-4xl mb-4"></i>
          <p>No ongoing courses - keep learning!</p>
        </div>
      </div>

      <!-- Completed Courses -->
      <div v-if="activeTab === 'completed'">
        <div v-if="completedCourses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          <EnrolledCourseCard 
            v-for="course in completedCourses" 
            :key="course.id" 
            :course="course"
          />
        </div>
        <div v-else class="text-center text-gray-500 py-12">
          <i class="fas fa-trophy text-4xl mb-4"></i>
          <p>No completed courses yet - you can do it!</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCourseStore } from '@/store/courseStore';
import { useQuizStore } from '@/store/quizStore';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import EnrolledCourseCard from '@/components/cards/EnrolledCourseCard.vue';

const courseStore = useCourseStore();
const quizStore = useQuizStore();
const enrollmentStore = useEnrollmentStore();
const { enrolledCourses } = storeToRefs(courseStore);
const loading = ref(true);
const activeTab = ref('ongoing');

const isCourseCompleted = (course) => {
  const totalLessons = course.modules.flatMap(m => m.lessons).length;
  if (totalLessons === 0) return false;

  const progress = Array.isArray(course.progress) ? course.progress : [];
  const completedLessons = course.modules.flatMap(m => m.lessons)
    .filter(lesson => {
      return progress.some(p => p.lesson?.id === lesson.id && p.completed) ||
            quizStore.isAssessmentCompleted(lesson.assessment?.id);
    }).length;

  return completedLessons === totalLessons;
};

const ongoingCourses = computed(() => 
  enrolledCourses.value.filter(course => !isCourseCompleted(course))
);

const completedCourses = computed(() => 
  enrolledCourses.value.filter(course => isCourseCompleted(course))
);

onMounted(async () => {
  try {
    loading.value = true;
    await Promise.all([
      courseStore.fetchEnrolledCourses(),
      quizStore.fetchAttempts(),
      enrollmentStore.fetchEnrollmentCount() // Fetch count on mount
    ]);
  } catch (error) {
    console.error('Failed to load courses:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.tabs button {
  margin-bottom: -1px;
}

.tabs button:hover:not(.active) {
  border-color: #e5e7eb;
  color: #4b5563;
}
</style>