<template>
  <div class="course-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    
    :class="{ 'cursor-pointer': isLoggedIn }">
    <div class="thumbnail-container h-48 bg-gray-100 relative">
      <img 
        :src="course.thumbnail || '/placeholder-image.jpg'"
        alt="Course thumbnail"
        class="w-full h-full object-cover"
      >
      <div class="absolute top-2 left-2">

      </div>
    </div>
    
    <div class="p-4 flex flex-col flex-grow">
      <h3 class="text-lg font-bold text-gray-800 mb-2">{{ course.title }}</h3>
<p class="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{{ course.description }}</p>

<div class="flex items-center mb-3">
  <div class="flex text-yellow-400 mr-2">
    <FontAwesomeIcon 
      v-for="n in 5" 
      :key="n"
      :icon="[
        n <= Math.floor(course.average_rating) ? 'fas' : 
        (course.average_rating % 1 >= 0.5 && n === Math.ceil(course.average_rating)) ? 'fas' : 'far',
        'star'
      ]"
      :class="{
        'fa-star-half-alt': n === Math.ceil(course.average_rating) && course.average_rating % 1 !== 0
      }"
    />
  </div>
  <span class="text-sm text-gray-500">({{ course.average_rating?.toFixed(1) || 0 }})</span>
</div>

      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ shortDescription }}
      </p>

      <div class="mt-auto flex items-center justify-between">
        <div>
          <span class="text-lg font-bold text-blue-600">ETB {{ course.price }}</span>
          <span v-if="course.original_price" class="text-sm text-gray-400 line-through ml-2">
            ETB {{ course.original_price }}
          </span>
        </div>
        <button 
          @click="handleEnroll"
          :disabled="!isLoggedIn || isEnrolled"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': !isLoggedIn || isEnrolled }"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';
import api from '@/axios';

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

const authStore = useAuthStore();
const router = useRouter();
const emit = defineEmits(['enrolled']);

const isLoggedIn = computed(() => !!authStore.token);

const isEnrolled = computed(() => {
  return isLoggedIn.value && props.course.is_enrolled;
});

const buttonText = computed(() => {
  if (!isLoggedIn.value) return 'Login to Enroll';
  return isEnrolled.value ? 'Enrolled' : 'Enroll Now';
});

const handleEnroll = async () => {
  if (!isLoggedIn.value) {
    authStore.setRedirectPath(`/courses/${props.course.id}`);
    router.push('/login');
    return;
  }

  // Redirect to checkout page
  router.push(`/checkout/${props.course.id}`);
};

const navigateToCourse = () => {
  if (isLoggedIn.value) {
    router.push('/my-courses');
  }
};
</script>

