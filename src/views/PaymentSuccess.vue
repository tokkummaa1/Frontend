<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div v-if="loading" class="text-center py-8">
        <Spinner class="w-12 h-12 mx-auto text-blue-600" />
        <p class="mt-4 text-gray-600">Verifying payment...</p>
      </div>

      <div v-else-if="payment" class="space-y-4">
        <div class="text-center">
          <CheckCircleIcon class="w-12 h-12 mx-auto text-green-600" />
          <h2 class="text-2xl font-bold mt-4">Payment Successful! 🎉</h2>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <dl class="space-y-2">
            <div class="flex justify-between">
              <dt class="text-gray-600">Payment ID:</dt>
              <dd class="font-medium">{{ payment.payment_id }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600">Amount:</dt>
              <dd class="font-medium">${{ payment.amount }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600">Course:</dt>
              <dd class="font-medium">{{ payment.course.title }}</dd>
            </div>
          </dl>
        </div>

        <router-link 
          to="/my-courses" 
          class="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Access Your Course
        </router-link>
      </div>

      <div v-else class="text-center py-8">
        <ExclamationTriangleIcon class="w-12 h-12 mx-auto text-red-600" />
        <h2 class="text-xl font-bold mt-4">Payment Verification Failed</h2>
        <p class="mt-2 text-gray-600">
          Please contact support with reference ID: {{ paymentId }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/axios'
import Spinner from '@/views/Spinner.vue'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const paymentId = ref(route.query.payment_id)
const payment = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get(`/api/v1/payments/${paymentId.value}/`, {
      validateStatus: (status) => status < 500 // Handle 404 specifically
    })
    
    if (response.status === 404) {
      error.value = 'Payment record not found'
      return
    }

    payment.value = response.data
    
    // Additional verification for Chapa payments
    if (payment.value.gateway === 'chapa' && !payment.value.status) {
      await verifyChapaPayment()
    }

  } catch (error) {
    console.error('Payment verification failed:', error)
    error.value = 'Payment verification failed'
  } finally {
    loading.value = false
  }
})

const verifyChapaPayment = async () => {
  try {
    const verification = await api.post('/api/v1/payments/verify-chapa/', {
      tx_ref: payment.value.chapa_tx_ref
    })
    
    if (verification.data.status === 'success') {
      payment.value.status = true
    }
  } catch (err) {
    console.error('Chapa verification failed:', err)
  }
}
</script>