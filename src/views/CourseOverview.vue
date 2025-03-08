<template>
  <div class="course-overview">
    <h1 class="text-3xl font-bold mb-4">{{ course.title }}</h1>
    <div class="prose max-w-none mb-8" v-html="formattedDescription"></div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-2">Course Details</h3>
        <p>Modules: {{ course.modules?.length || 0 }}</p>
        <p>Lessons: {{ totalLessons }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-2">Your Progress</h3>
        <div class="h-2 bg-gray-200 rounded-full">
          <div 
            class="h-full bg-green-500 rounded-full transition-all duration-500"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <p class="mt-2 text-sm">{{ completedLessons }} / {{ totalLessons }} lessons completed</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

const formattedDescription = computed(() => marked(props.course.description));
const totalLessons = computed(() => 
  props.course.modules?.reduce((acc, module) => acc + module.lessons.length, 0) || 0
);
</script>