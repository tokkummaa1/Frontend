<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Account Activation
        </h2>
      </div>

      <div v-if="activationSuccess" class="bg-green-100 p-3 rounded-md text-green-700">
        <i class="fas fa-check-circle mr-2"></i>
        Account activated successfully. Redirecting to login...
      </div>

      <div v-else>
        <div v-if="errorOccurred" class="bg-red-100 p-3 rounded-md text-red-700 mb-4">
          <i class="fas fa-times-circle mr-2"></i>
          {{ errorMessage }}
        </div>

        <div v-if="showResendForm" class="space-y-4">
          <p class="text-gray-600">Enter your email to resend activation link:</p>
          <input
            v-model="resendEmail"
            type="email"
            placeholder="Your email"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="resendActivation"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Resend Activation Link
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/axios";
import { useRouter } from 'vue-router';

export default {
  name: "ActivateAccountView",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      activationSuccess: false,
      errorOccurred: false,
      showResendForm: false,
      errorMessage: "",
      resendEmail: "",
    };
  },
  methods: {
    async activateAccount() {
      try {
        const response = await api.post(
          "api/v1/users/activation/", // Verify correct endpoint
          {
            uid: this.$route.params.uid,
            token: this.$route.params.token,
          }
        );

        if (response.status === 204) {
          this.activationSuccess = true;
          setTimeout(() => this.router.push('/login'), 2000);
        }
      } catch (error) {
        this.errorOccurred = true;
        this.errorMessage = error.response?.data?.detail || 
          "Invalid or expired activation link.";
        
        // Show resend form for specific errors
        if (this.errorMessage.toLowerCase().includes('stale')) {
          this.showResendForm = true;
        }
      }
    },

    async resendActivation() {
      if (!this.resendEmail) {
        this.errorMessage = "Please enter a valid email address";
        return;
      }

      try {
        await api.post("/api/v1/users/resend_activation/", {
          email: this.resendEmail
        });

        this.errorMessage = "Activation email resent. Please check your inbox.";
        this.showResendForm = false;
        this.errorOccurred = false;
      } catch (error) {
        this.errorMessage = error.response?.data?.email?.[0] || 
          "Failed to resend activation email. Please try again.";
      }
    }
  },
  created() {
    document.title = "Activate Account";
  },
  async mounted() {
    await this.activateAccount();
  },
};
</script>