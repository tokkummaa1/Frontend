<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg max-w-sm w-full">
      <h3 class="text-xl font-bold mb-4">Rate This Course</h3>
      <div class="flex justify-center mb-4">
        <button 
          v-for="star in 5" 
          :key="star"
          @click="selectedRating = star"
          class="text-3xl mx-1 transition-colors"
          :class="selectedRating >= star ? 'text-yellow-400' : 'text-gray-300'"
        >
          ★
        </button>
      </div>
      <button
        @click="submitRating"
        class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Submit Rating
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRatingStore } from '@/store/ratingStore'

const props = defineProps({
  courseId: Number,
  show: Boolean
})
const emit = defineEmits(['close'])

const ratingStore = useRatingStore()
const selectedRating = ref(0)

const submitRating = async () => {
  if (!selectedRating.value) return
  
  try {
    await ratingStore.submitRating(props.courseId, selectedRating.value)
    emit('close')
  } catch (error) {
    alert('Failed to submit rating. Please try again.')
  }
}
</script>