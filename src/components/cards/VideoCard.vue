<template>
  <div v-if="isLoading" class="flex items-center justify-center h-screen">
    <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
    <p class="ml-2">Loading course...</p>
  </div>
  <div v-else>
    <RatingPopup 
      v-if="showRatingPopup"
      :course-id="course.id"
      :show="showRatingPopup"
      @close="showRatingPopup = false"
    />
    <div class="video-container flex flex-col md:flex-row h-screen bg-gray-50">
      <!-- Sidebar (unchanged) -->
      <div class="sidebar w-full md:w-80 border-r bg-white p-4 overflow-y-auto">
        <div class="flex items-center gap-4 mb-6">
          <div class="relative w-14 h-14">
            <svg class="w-full h-full transform -rotate-90">
              <circle 
                cx="50%" cy="50%" r="20" class="text-gray-200" stroke-width="4" fill="none" stroke="currentColor"
              />
              <circle 
                cx="50%" cy="50%" r="20" class="text-blue-600" stroke-width="4" fill="none" stroke-linecap="round"
                stroke="currentColor" :stroke-dasharray="125.6" :stroke-dashoffset="125.6 - (125.6 * courseProgress) / 100"
              />
            </svg>
            <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700">
              {{ Math.round(courseProgress) }}%
            </span>
          </div>
          <h2 class="text-xl font-bold">{{ course.title }}</h2>
        </div>
        <div v-for="module in course.modules" :key="module.id" class="mb-4">
          <div class="module-header flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 rounded"
            @click="toggleModule(module.id)">
            <h3 class="font-semibold">{{ module.title }}</h3>
            <span class="transform transition-transform" :class="{ 'rotate-90': expandedModules[module.id] }">›</span>
          </div>
          <div v-show="expandedModules[module.id]" class="lessons ml-4">
            <div 
              v-for="lesson in module.lessons" 
              :key="`${lesson.id}-${isLessonCompleted(lesson)}`"
              class="lesson-item flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              :class="{ 'bg-blue-50': activeLesson?.id === lesson.id }" 
              @click="selectLesson(lesson)"
            >
              <div class="mr-2 w-6 h-6 flex items-center justify-center">
                <svg 
                  v-if="isLessonCompleted(lesson) || quizStore.isAssessmentCompleted(lesson.assessment?.id)" 
                  class="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none"
                >
                  <circle cx="12" cy="12" r="10" class="stroke-current fill-green-100" stroke-width="1.5"/>
                  <path class="stroke-current" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M7 12l3 3 7-7"/>
                </svg>
                <input v-else type="checkbox" :checked="isLessonCompleted(lesson)"
                  @click.stop="toggleLessonCompletion(lesson)"
                  class="w-full h-full text-blue-600 rounded-full border-2 border-gray-300 focus:ring-blue-500"
                >
              </div>
              <span class="flex-1">{{ lesson.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Content -->
      <div class="flex-1 p-4 md:p-8 overflow-y-auto">
        <div class="max-w-4xl mx-auto">
          <div class="video-wrapper mb-4 md:mb-8">
            <iframe v-if="validVideoUrl" :src="activeLesson.video" @load="handleVideoLoad" @error="handleVideoError"
              class="w-full aspect-video" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
            ></iframe>
            <div v-else class="text-gray-500 p-8 text-center h-96 flex items-center justify-center">
              <div>
                <i class="fas fa-video-slash text-4xl mb-2"></i>
                <p>No video available for this lesson</p>
              </div>
            </div>
          </div>
          <div class="lesson-content bg-white p-6 rounded-lg shadow">
            <h2 class="text-2xl font-bold mb-4">{{ activeLesson?.title }}</h2>
            <div ref="contentRef" class="prose max-w-none" v-html="formattedContent"></div>
          </div>
          <div class="mt-8" v-if="activeLesson">
            <QuizCard v-for="assessment in lessonAssessments" :key="assessment.id" :assessment="assessment" :entity-id="activeLesson.id"/>
          </div>
          <div class="navigation-controls mt-4 md:mt-8 py-4 border-t">
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div class="progress-indicator text-sm md:text-base">
                Lesson {{ currentLessonIndex + 1 }} of {{ totalLessons }}
              </div>
              <div class="flex gap-2 md:gap-4 w-full md:w-auto">
                <button @click="previousLesson" class="w-full md:w-auto px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  ← Previous
                </button>
                <button @click="nextLesson" class="w-full md:w-auto px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {{ isLastLesson ? 'Finish Course' : 'Next Lesson →' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; 
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import api from '@/axios';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCourseStore } from '@/store/courseStore';
import QuizCard from './QuizCard.vue';
import { useQuizStore } from '@/store/quizStore';
import { useRatingStore } from '@/store/ratingStore';
import RatingPopup from '@/components/RatingPopup.vue';

const quizStore = useQuizStore();
const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const { enrolledCourses, currentCourseIndex } = storeToRefs(courseStore);
const ratingStore = useRatingStore();

const videoError = ref(false);
const isLoading = ref(true);
const showRatingPopup = ref(false);
const contentRef = ref(null); // Ref to the content div

const props = defineProps({
  course: { type: Object, required: true }
});

const progress = computed(() => {
  const course = courseStore.enrolledCourses.find(c => c.id === props.course.id);
  return course?.progress || [];
});

const courseProgress = computed(() => {
  const totalLessons = props.course.modules.flatMap(m => m.lessons).length;
  const completedLessons = props.course.modules
    .flatMap(m => m.lessons)
    .filter(lesson => isLessonCompleted(lesson))
    .length;
  return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
});

const isLessonCompleted = (lesson) => {
  const progressArray = Array.isArray(progress.value) ? progress.value : [];
  return progressArray.some(p => p.lesson?.id === lesson.id && p.completed) ||
        quizStore.isAssessmentCompleted(lesson.assessment?.id);
};

const toggleLessonCompletion = async (lesson) => {
  if (isLessonCompleted(lesson)) return;
  try {
    console.log('Toggling lesson:', lesson.id, 'Before:', isLessonCompleted(lesson));
    await courseStore.updateLessonProgress(props.course.id, lesson.id, true);
    console.log('After toggle:', isLessonCompleted(lesson));
  } catch (error) {
    console.error('Progress update failed:', error);
  }
};

const activeLesson = ref(null);
const expandedModules = ref({});

const validVideoUrl = computed(() => {
  const url = activeLesson.value?.video;
  return url && /youtube\.com\/embed\/[a-zA-Z0-9_-]{11}/.test(url);
});

const handleVideoLoad = () => {
  isLoading.value = false;
  videoError.value = false;
};

const handleVideoError = () => {
  videoError.value = true;
  isLoading.value = false;
};

const toggleModule = (moduleId) => {
  expandedModules.value[moduleId] = !expandedModules.value[moduleId];
};

const selectLesson = (lesson) => {
  activeLesson.value = lesson;
  props.course.modules.forEach((module, modIndex) => {
    const lessonIndex = module.lessons.findIndex(l => l.id === lesson.id);
    if (lessonIndex !== -1) {
      currentModuleIndex.value = modIndex;
      currentLessonIndex.value = lessonIndex;
    }
  });
  courseStore.setLastViewedLesson(props.course.id, lesson.id);
};

// Configure marked
marked.setOptions({
  breaks: true, 
});

const formattedContent = computed(() => {
  if (!activeLesson.value?.content) return '';
  const html = marked(activeLesson.value.content);
  return html;
});

// Highlight code after content is rendered
watch(formattedContent, async () => {
  await nextTick(); // Wait for DOM update
  if (contentRef.value) {
    Prism.highlightAllUnder(contentRef.value);
  }
});

const totalLessons = computed(() => {
  return props.course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
});

const currentLessonIndex = ref(0);
const currentModuleIndex = ref(0);

const isLastLesson = computed(() => {
  const lastModuleIndex = props.course.modules.length - 1;
  const lastLessonIndex = props.course.modules[lastModuleIndex]?.lessons.length - 1;
  return currentModuleIndex.value === lastModuleIndex && 
        currentLessonIndex.value === lastLessonIndex;
});

const handleLessonCompletion = async () => {
  console.log('handleLessonCompletion called for course:', props.course.id);
  try {
    const hasRated = await ratingStore.checkHasRated(props.course.id);
    console.log('Has rated:', hasRated);
    if (!hasRated) {
      showRatingPopup.value = true;
    }
  } catch (error) {
    console.error('Rating check failed:', error);
  }
};

const nextLesson = async () => {
  console.log('nextLesson called, isLastLesson:', isLastLesson.value);
  if (activeLesson.value && !isLessonCompleted(activeLesson.value)) {
    await toggleLessonCompletion(activeLesson.value);
  }

  const totalModules = props.course.modules.length;
  const currentModule = props.course.modules[currentModuleIndex.value];
  if (currentLessonIndex.value < currentModule.lessons.length - 1) {
    currentLessonIndex.value++;
  } else if (currentModuleIndex.value < totalModules - 1) {
    currentModuleIndex.value++;
    currentLessonIndex.value = 0;
  }

  updateActiveLesson();

  if (isLastLesson.value && isLessonCompleted(activeLesson.value)) {
    await handleLessonCompletion();
  }
  console.log('After next:', JSON.stringify(progress.value));
};

const previousLesson = () => {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--;
  } else if (currentModuleIndex.value > 0) {
    currentModuleIndex.value--;
    const prevModule = props.course.modules[currentModuleIndex.value];
    currentLessonIndex.value = prevModule.lessons.length - 1;
  }
  updateActiveLesson();
};

const updateActiveLesson = () => {
  const newLesson = props.course.modules[currentModuleIndex.value]?.lessons[currentLessonIndex.value];
  if (newLesson) {
    router.replace({
      name: 'my-learning',
      params: { courseId: props.course.id },
      query: { lesson: newLesson.id }
    });
    activeLesson.value = newLesson;
    courseStore.setLastViewedLesson(props.course.id, newLesson.id);
  }
};

const lessonAssessments = computed(() => {
  if (!activeLesson.value?.id) return [];
  const lessonKey = computed(() => `lesson-${activeLesson.value.id}`);
  return quizStore.assessments[lessonKey.value] || [];
});

onMounted(async () => {
  console.log('onMounted triggered');
  try {
    isLoading.value = true;
    await courseStore.fetchEnrolledCourses();
    await quizStore.fetchAttempts();

    const lessonIdFromQuery = route.query.lesson;
    const lastViewedLessonId = courseStore.getLastViewedLesson(props.course.id);

    let targetLesson = null;
    if (lessonIdFromQuery) {
      targetLesson = props.course.modules?.flatMap(m => m.lessons).find(l => l.id === parseInt(lessonIdFromQuery));
    } else if (lastViewedLessonId) {
      targetLesson = props.course.modules?.flatMap(m => m.lessons).find(l => l.id === parseInt(lastViewedLessonId));
    }

    if (targetLesson) {
      activeLesson.value = targetLesson;
      props.course.modules.forEach((module, modIndex) => {
        const lessonIndex = module.lessons.findIndex(l => l.id === targetLesson.id);
        if (lessonIndex !== -1) {
          currentModuleIndex.value = modIndex;
          currentLessonIndex.value = lessonIndex;
        }
      });
    } else if (props.course.modules?.[0]?.lessons?.[0]) {
      activeLesson.value = props.course.modules[0].lessons[0];
      courseStore.setLastViewedLesson(props.course.id, activeLesson.value.id);
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  } finally {
    isLoading.value = false;
    await nextTick(); 
    if (contentRef.value) {
      Prism.highlightAllUnder(contentRef.value); 
    }
  }
});

watch(activeLesson, async (newLesson) => {
  if (newLesson?.id) {
    quizStore.fetchAssessments('lesson', newLesson.id);
    router.replace({ query: { lesson: newLesson.id } });
    await nextTick(); // Wait for DOM update
    if (contentRef.value) {
      Prism.highlightAllUnder(contentRef.value); 
    }
  }
});
</script>