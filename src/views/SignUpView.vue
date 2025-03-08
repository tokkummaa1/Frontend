<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Create Account
        </h2>
      </div>

      <div v-if="errors.length" class="bg-red-100 p-3 rounded-md text-red-700">
        <div v-for="error in errors" :key="error" class="flex items-center">
          <i class="fas fa-times-circle mr-2"></i>{{ error }}
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="submitForm">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="mt-1 block w-full rounded-md p-1 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="username"
            >
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Email"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full p-1 pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
              >
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i
                  :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                  class="fas cursor-pointer text-gray-400 hover:text-gray-500"
                  @click="togglePasswordVisibility"
                ></i>
              </div>
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                id="confirm-password"
                v-model="repeatPassword"
                :type="showRepeatPassword ? 'text' : 'password'"
                required
                class="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm Password"
              >
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i
                  :class="showRepeatPassword ? 'fa-eye-slash' : 'fa-eye'"
                  class="fas cursor-pointer text-gray-400 hover:text-gray-500"
                  @click="toggleRepeatPasswordVisibility"
                ></i>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span v-if="!loading">Sign Up</span>
          <span v-else>
            <i class="fas fa-spinner fa-spin mr-2"></i>Creating Account...
          </span>
        </button>

        <div class="text-center text-sm">
          <router-link 
            to="/login" 
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Already have an account? Log In
          </router-link>
        </div>
      </form>

      <div v-if="hideForm" class="bg-green-100 p-3 rounded-md text-green-700">
        <i class="fas fa-check-circle mr-2"></i>
        Account created successfully. Please check your email to verify your account.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/axios';

const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const repeatPassword = ref('');
const showPassword = ref(false); // Separate toggle for password
const showRepeatPassword = ref(false); // Separate toggle for confirm password
const hideForm = ref(false);
const errors = ref([]);
const loading = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleRepeatPasswordVisibility = () => {
  showRepeatPassword.value = !showRepeatPassword.value;
};

const validateForm = () => {
  errors.value = [];
  
  if (!username.value.trim()) errors.value.push('Username is required');
  if (!email.value.trim()) errors.value.push('Email is required');
  if (!password.value.trim()) errors.value.push('Password is required');
  if (password.value !== repeatPassword.value) {
    errors.value.push('Passwords do not match');
  }

  return errors.value.length === 0;
};

const submitForm = async () => {
  loading.value = true;
  if (!validateForm()) {
    loading.value = false;
    return;
  }

  try {
    const response = await api.post('/api/v1/users/', {
      name: username.value,
      email: email.value,
      password: password.value,
      re_password: repeatPassword.value
    });

    if (response.status === 201) {
      hideForm.value = true;
      errors.value = [];
      setTimeout(() => router.push('/login'), 3000);
    }
  } catch (error) {
    errors.value = Object.values(error.response?.data || {}).flat();
  } finally {
    loading.value = false;
  }
};
</script>