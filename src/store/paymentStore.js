import { defineStore } from "pinia";
import api from "@/axios";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    loading: false,
    error: null,
    paymentData: null,
  }),
  actions: {
    async initiatePayment(courseId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post(
          "/api/v1/payments/create-paypal-payment/",
          { course_id: courseId }
        );

        if (response.data.status === "enrolled") {
          return { success: true, freeCourse: true };
        }

        this.paymentData = response.data;
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.error || "Payment initiation failed";
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    createPaypalForm() {
      if (!this.paymentData?.payment_url) {
        console.error("Invalid payment data");
        return;
      }
      if (!this.paymentData) return;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = this.paymentData.payment_url;

      Object.entries(this.paymentData.payment_data).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    },
    async initiateChapaPayment(courseId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post(
          "/api/v1/payments/create-chapa-payment/",
          { course_id: courseId }
        );

        if (response.data.status === "enrolled") {
          return { success: true, freeCourse: true };
        }

        this.paymentData = response.data;
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.error || "Chapa payment failed";
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    createChapaForm() {
      if (!this.paymentData?.payment_url) {
        console.error("Invalid Chapa payment data");
        return;
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = this.paymentData.payment_url;

      Object.entries(this.paymentData.payment_data).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    },
  },
});
