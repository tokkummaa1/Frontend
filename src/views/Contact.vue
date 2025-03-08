<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-primary">
          Contact Us
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
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Your email"
            >
          </div>

          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              id="subject"
              v-model="subject"
              type="text"
              required
              class="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Subject"
            >
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              v-model="message"
              required
              class="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Your message"
              rows="4"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <span v-if="!loading">Send Message</span>
          <span v-else>
            <i class="fas fa-spinner fa-spin mr-2"></i>Sending...
          </span>
        </button>
      </form>

      <div v-if="success" class="bg-secondary p-3 rounded-md text-white">
        <i class="fas fa-check-circle mr-2"></i>
        Your message has been sent successfully!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/axios';

const email = ref('');
const subject = ref('');
const message = ref('');
const loading = ref(false);
const errors = ref([]);
const success = ref(false);

const submitForm = async () => {
  loading.value = true;
  errors.value = [];
  success.value = false;

  try {
    const response = await api.post('/api/v1/contacts/', {
      email: email.value,
      subject: subject.value,
      message: message.value
    });

    if (response.status === 201) {
      success.value = true;
      email.value = '';
      subject.value = '';
      message.value = '';
      setTimeout(() => (success.value = false), 5000);
    }
  } catch (error) {
    errors.value = Object.values(error.response?.data || {}).flat() || ['An error occurred. Please try again.'];
    console.error('Contact form error:', error.response?.data);
  } finally {
    loading.value = false;
  }
};
</script>