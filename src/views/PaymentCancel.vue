<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
      <XCircleIcon class="w-12 h-12 mx-auto text-yellow-600" />
      <h2 class="text-2xl font-bold mt-4">Payment Cancelled</h2>
      <p class="mt-2 text-gray-600">The payment process was not completed.</p>
      
      <div class="mt-6 space-y-4">
        <router-link 
          :to="`/courses/${courseId}`"
          class="block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Return to Course
        </router-link>
        <router-link 
          to="/my-courses"
          class="block text-blue-600 hover:text-blue-800 text-sm"
        >
          View My Courses
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { XCircleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const courseId = ref(route.query.course_id)
</script>