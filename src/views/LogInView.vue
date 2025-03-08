<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Log In
        </h2>
      </div>

      <div v-if="showAlertDialog" class="bg-red-100 p-3 rounded-md text-red-700">
        <i class="fas fa-times-circle mr-2"></i>{{ errorMessage }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="submitForm">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
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
                :type="showHidePassword ? 'password' : 'text'"
                required
                class="block w-full p-1 pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
              >
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i
                  :class="showHidePassword ? 'fa-eye' : 'fa-eye-slash'"
                  class="fas cursor-pointer text-gray-400 hover:text-gray-500"
                  @click="togglePasswordVisibility"
                ></i>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
              <span v-if="!loading">Log In</span>
    <span v-else>
      <i class="fas fa-spinner fa-spin mr-2"></i>Logging in...
    </span>
        </button>

        <div class="text-center text-sm space-y-2">
          <router-link 
            to="/reset-password" 
            class="font-medium text-blue-600 hover:text-blue-500 block"
          >
            Forgot password?
          </router-link>
          <router-link 
            to="/signup" 
            class="font-medium text-gray-600 hover:text-gray-500 block"
          >
            Don't have an account? Sign Up
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import api from '@/axios';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const email = ref('');
const password = ref('');
const showHidePassword = ref(true);
const showAlertDialog = ref(false);
const errorMessage = ref('');

const togglePasswordVisibility = () => {
  showHidePassword.value = !showHidePassword.value;
};

const submitForm = async () => {
  loading.value = true;
  try {
    const response = await api.post("/api/v1/jwt/create", {
      email: email.value,
      password: password.value
    });

    if (response.data.access) {
      authStore.login(response.data.access, email.value);
      router.replace({ name: 'home' });
    }
  } catch (error) {
    errorMessage.value =  
      'Invalid email or password. Please try again.';
    showAlertDialog.value = true;
    password.value = '';
  } finally {
    loading.value = false;
  }
};
</script>