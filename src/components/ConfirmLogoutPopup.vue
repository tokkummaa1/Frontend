<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Are you sure?</h3>
      <p class="text-gray-600 mb-6">Do you really want to log out?</p>
      <div class="flex justify-end space-x-4">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          No
        </button>
        <button 
          @click="$emit('confirm')"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true }
});

defineEmits(['close', 'confirm']);
</script>