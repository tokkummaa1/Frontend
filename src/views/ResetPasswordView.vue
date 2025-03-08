<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
      </div>

      <div v-if="successMessage" class="bg-green-100 p-3 rounded-md text-green-700">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="bg-red-100 p-3 rounded-md text-red-700">
        {{ errorMessage }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input id="email" v-model="email" name="email" type="email" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
          <span v-if="!loading">Send Reset Instructions</span>
          <span v-else>Sending...</span>
        </button>

        <div class="text-center text-sm">
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await axios.post('http://localhost:8000/api/v1/users/reset_password/', {
      email: email.value
    });

    successMessage.value = 'Password reset instructions have been sent to your email.';
    email.value = '';
  } catch (error) {
    errorMessage.value = error.response?.data?.email?.[0] ||
      'Something went wrong. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>