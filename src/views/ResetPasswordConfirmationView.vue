<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
      </div>

      <div v-if="passwordChangedSuccess" class="bg-green-100 p-3 rounded-md text-green-700">
        <i class="fas fa-check-circle mr-2"></i>
        Password reset successfully. Redirecting to login...
      </div>

      <div v-if="errorOccurred" class="bg-red-100 p-3 rounded-md text-red-700">
        <i class="fas fa-times-circle mr-2"></i>{{ errorMessage }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="confirmResetPassword">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="new_password" class="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input 
                id="new_password" 
                v-model="new_password" 
                :type="showHidePassword ? 'password' : 'text'"
                class="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="New password"
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

          <div>
            <label for="re_new_password" class="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input 
                id="re_new_password" 
                v-model="re_new_password" 
                :type="showHidePassword ? 'password' : 'text'"
                class="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm new password"
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
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reset Password
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

<script>
import api from "@/axios";
import { useRouter } from 'vue-router';

export default {
  name: "ResetPasswordConfirmation",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      new_password: "",
      re_new_password: "",
      passwordChangedSuccess: false,
      showHidePassword: true,
      errorOccurred: false,
      errorMessage: "",
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showHidePassword = !this.showHidePassword;
    },
    async confirmResetPassword() {
      const data = JSON.stringify({
        uid: this.$route.params.uid,
        token: this.$route.params.token,
        new_password: this.new_password,
        re_new_password: this.re_new_password,
      });

      await api.post("/api/v1/users/reset_password_confirm/", data, {
          headers: { "Content-Type": "application/json" },
        })
        .then(() => {
          this.passwordChangedSuccess = true;
          this.errorOccurred = false;
          setTimeout(() => this.router.push('/login'), 2000);
        })
        .catch((error) => {
          this.errorOccurred = true;
          this.errorMessage = Object.values(error.response?.data || {})[0]?.[0] || 
            "An error occurred. Please try again.";
        });
    },
  },
  created() {
    document.title = "Reset Password Confirmation";
  },
};
</script>