<template>
  <div class="enrolled-course-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
    <div class="relative">
      <img 
        :src="course.thumbnail || '/placeholder-image.jpg'"
        alt="Course thumbnail"
        class="w-full h-48 object-cover"
      >
    </div>

    <div class="p-6 flex flex-col flex-1">
      <h3 class="text-xl font-bold text-gray-800 mb-2">{{ course.title }}</h3>
      <p class="text-gray-600 text-sm mb-4 flex-1">{{ truncateDescription(course.description) }}</p>
      
      <div class="flex items-center gap-2 mb-4">
        <i class="fas fa-play-circle text-blue-600 text-xl"></i>
        <div class="progress-bar bg-gray-200 rounded-full h-2 flex-1">
          <div 
            class="bg-primary h-2 rounded-full transition-all duration-500"
            :style="{ width: `${courseProgress}%` }"
          ></div>
        </div>
        <span class="text-sm text-gray-600 font-medium whitespace-nowrap">
          {{ courseProgress }}%
        </span>
      </div>

      <button
        @click="handleContinue"
        :class="[
          isCompleted 
            ? 'bg-green-500 hover:bg-green-600 cursor-default'
            : 'bg-primary hover:bg-blue-700'
        ]"
        class="w-full text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        <i v-if="!isCompleted" class="fas fa-play-circle mr-2"></i>
        {{ isCompleted ? 'Course Completed' : 'Continue Learning' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/store/courseStore';
import { useQuizStore } from '@/store/quizStore';

const router = useRouter();
const courseStore = useCourseStore();
const quizStore = useQuizStore();

const props = defineProps({
  course: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      title: 'Course Title',
      description: 'Course description',
      category: null,
      progress: [], // Default to empty array
      thumbnail: null,
      modules: []
    })
  }
});

const courseProgress = computed(() => {
  const totalLessons = props.course.modules.flatMap(m => m.lessons).length;
  const completedLessons = props.course.modules
    .flatMap(m => m.lessons)
    .filter(lesson => isLessonCompleted(lesson))
    .length;
  
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
});

const isLessonCompleted = (lesson) => {
  const progress = Array.isArray(props.course.progress) ? props.course.progress : [];
  return progress.some(p => p.lesson?.id === lesson.id && p.completed) ||
        quizStore.isAssessmentCompleted(lesson.assessment?.id);
};

const truncateDescription = (text, length = 100) => {
  return text?.length > length ? text.substring(0, length) + '...' : text;
};

const isCompleted = computed(() => {
  const totalLessons = props.course.modules.flatMap(m => m.lessons).length;
  const completedLessons = props.course.modules
    .flatMap(m => m.lessons)
    .filter(lesson => isLessonCompleted(lesson)).length;
  
  return totalLessons > 0 && completedLessons === totalLessons;
});

const handleContinue = () => {
  if (isCompleted.value) return;
  courseStore.setCurrentCourse(props.course);
  router.push(`/my-learning/${props.course.id}`);
};
</script>

<style scoped>
.enrolled-course-card {
  transition: transform 0.3s ease;
}

.enrolled-course-card:hover {
  transform: translateY(-4px);
}

.progress-bar {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}
</style>