import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/axios";

export const useEnrollmentStore = defineStore("enrollment", () => {
  const count = ref(0);

  const fetchEnrollmentCount = async () => {
    try {
      const response = await api.get("/api/v1/enrollments/");
      count.value = response.data.length;
      console.log("Enrollment count fetched:", count.value);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      count.value = 0; // Reset on error
    }
  };

  const resetCount = () => {
    count.value = 0;
    console.log("Enrollment count reset to:", count.value);
  };

  const incrementCount = () => {
    count.value++;
  };

  return { count, fetchEnrollmentCount, incrementCount, resetCount };
});
