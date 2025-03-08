<template>
  <div class="checkout-container max-w-2xl mx-auto p-6">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Spinner class="w-16 h-16 text-white" />
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Free Course Enrollment -->
    <div v-if="freeCourse" class="text-center p-8 bg-green-50 rounded-xl">
      <CheckCircleIcon class="w-16 h-16 mx-auto text-green-600 mb-4" />
      <h3 class="text-2xl font-bold mb-2">Enrollment Successful!</h3>
      <p class="text-lg mb-4">You're now enrolled in {{ course?.title }}</p>
      <router-link 
        to="/my-courses" 
        class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Access Course
      </router-link>
    </div>

    <!-- Payment Section -->
    <div v-else-if="course" class="bg-white shadow-lg rounded-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ course.title }}</h1>
        <p class="text-2xl font-semibold text-gray-600">ETB {{ course.price }}</p>
      </div>

      <div class="space-y-6">
        <!-- PayPal Button -->
        <button 
          @click="initiatePaypalPayment"
          :disabled="processingPayment"
          class="w-full flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all duration-300"
        >
          <svg class="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.365 1.193c.756 3.477 3.462 5.11 6.175 5.11 1.51 0 3.063-.37 3.063-.37.603-.15.71.398.237.744-1.483 1.05-2.766 2.037-2.766 3.45 0 2.774 2.406 4.04 2.406 6.054 0 4.098-3.127 5.72-7.705 5.72h-8.46c-.576 0-1.076-.4-1.13-.97L2.084 3.784c-.053-.57.35-1.065.925-1.065h5.17c.576 0 1.075.4 1.13.97l.544 3.506c.053.57-.35 1.065-.925 1.065H6.76c-.576 0-1.075.4-1.13.97l-.11.696-.328 2.118c-.053.57.35 1.065.925 1.065h2.927c.576 0 1.075-.4 1.13-.97l.11-.696.327-2.118c.054-.57-.35-1.065-.925-1.065H8.81c-.576 0-1.075-.4-1.13-.97l-.11-.696-.328-2.118c-.053-.57.35-1.065.925-1.065h3.853z" fill="currentColor"/>
          </svg>
          <span class="text-xl font-semibold text-white">Pay with PayPal</span>
        </button>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <!-- Chapa Button -->
        <button 
          @click="initiateChapaPayment"
          :disabled="processingPayment"
          class="w-full flex items-center justify-center px-6 py-4 bg-green-600 hover:bg-green-700 rounded-xl shadow-md transition-all duration-300"
        >
          <svg class="w-8 h-8 mr-3" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z" fill="#1C4D28"/>
            <path d="M47.8 80.6L57.9 47.8H76.7C81.5 47.8 84.6 50.1 85.3 54.5C85.7 57.1 85.1 59.4 83.7 61.3C82.3 63.2 80 64.6 76.8 65.4L85.2 80.6H72.6L66.5 65.4H56.3L50.2 80.6H47.8ZM61.4 60.3H69.5C73.3 60.3 75.3 59.1 75.6 56.7C75.8 55.3 75.2 54.2 73.8 53.4C72.4 52.6 70.4 52.2 67.8 52.2H63.8L61.4 60.3Z" fill="white"/>
          </svg>
          <span class="text-xl font-semibold text-white">Pay with Chapa</span>
        </button>
      </div>

      <!-- Payment Security Info -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <LockClosedIcon class="w-5 h-5 inline-block mr-2" />
        Secure payment processing
      </div>
    </div>

    <!-- Course Not Found -->
    <div v-else class="text-center p-8 bg-red-50 rounded-xl">
      <ExclamationTriangleIcon class="w-16 h-16 mx-auto text-red-600 mb-4" />
      <h2 class="text-2xl font-bold">Course Not Found</h2>
      <router-link 
        to="/courses" 
        class="inline-block mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Browse Courses
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/axios';
import { usePaymentStore } from '@/store/paymentStore';
import { useCourseStore } from '@/store/courseStore';
import Spinner from '@/views/Spinner.vue';

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();
const courseStore = useCourseStore();

const course = ref(null);
const loading = ref(false);
const error = ref(null);
const freeCourse = ref(false);

onMounted(async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/v1/courses/${route.params.courseId}/`);
    course.value = response.data;
    
    // Handle free courses immediately
    if (course.value.price === 0) {
      await handleFreeCourse();
    }
  } catch (err) {
    error.value = 'Failed to load course details';
  } finally {
    loading.value = false;
  }
});

const handleFreeCourse = async () => {
  try {
    const result = await paymentStore.initiatePayment(course.value.id);
    if (result.freeCourse) {
      freeCourse.value = true;
      courseStore.fetchEnrolledCourses();
    }
  } catch (err) {
    error.value = err.message || 'Enrollment failed';
  }
};

const initiatePayment = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (course.value.price === 0) {
      await handleFreeCourse();
      return;
    }

    const result = await paymentStore.initiatePayment(course.value.id);
    if (result.success) {
      paymentStore.createPaypalForm();
    }
  } catch (err) {
    error.value = err.message || 'Payment initialization failed';
  } finally {
    loading.value = false;
  }
};


const initiatePaypalPayment = async () => {
  try {
    loading.value = true
    const result = await paymentStore.initiatePayment(course.value.id)
    if (result.success) {
      paymentStore.createPaypalForm()
    }
  } catch (err) {
    error.value = err.message || 'Payment initialization failed'
  } finally {
    loading.value = false
  }
}

const initiateChapaPayment = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Verify email first
    const profileResponse = await api.get('/api/v1/users/me/')
    if (!profileResponse.data.email) {
      error.value = 'Please update your email address first'
      return
    }

    const result = await paymentStore.initiateChapaPayment(course.value.id)
    if (result.success) {
      paymentStore.createChapaForm()
    }
  } catch (err) {
    error.value = err.message || 'Chapa payment failed to initialize'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    loading.value = true;
    const response = await api.get(`/api/v1/courses/${route.params.courseId}/`);
    course.value = response.data;
    
    // Handle free courses immediately
    if (course.value.price === 0) {
      await handleFreeCourse();
    }
  } catch (err) {
    error.value = 'Failed to load course details';
    console.error('Course load error:', err);
  } finally {
    loading.value = false;
  }
});
</script>