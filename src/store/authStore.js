import { useCourseStore } from "@/store/courseStore";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useEnrollmentStore } from "@/store/enrollmentStore";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || "");
  const email = ref(localStorage.getItem("email") || "");
  const selectedNavbarItem = ref(
    localStorage.getItem("selectedNavbarItem") || "home"
  );

  const isAuthenticated = computed(() => !!token.value);

  const router = useRouter();
  const courseStore = useCourseStore();
  const enrollmentStore = useEnrollmentStore();

  const initialize = () => {
    token.value = localStorage.getItem("token") || "";
    email.value = localStorage.getItem("email") || "";

    if (token.value) {
      axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;
      if (window.location.pathname !== "/login") {
        router.push("/");
      }
    }
  };

  const login = async (newToken, newEmail) => {
    token.value = newToken;
    email.value = newEmail;
    localStorage.setItem("token", newToken);
    localStorage.setItem("email", newEmail);
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

    try {
      await Promise.all([
        courseStore.fetchEnrolledCourses(),
        enrollmentStore.fetchEnrollmentCount(),
      ]);
      console.log(
        "Post-login data fetched, enrollment count:",
        enrollmentStore.count
      );
    } catch (error) {
      console.error("Failed to fetch data after login:", error);
    }
  };

  const logout = () => {
    courseStore.$reset();
    enrollmentStore.resetCount();

    token.value = "";
    email.value = "";
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    delete axios.defaults.headers.common.Authorization;

    router.push("/login");
    console.log("Logged out, enrollment count:", enrollmentStore.count);
  };

  return {
    token,
    email,
    selectedNavbarItem,
    isAuthenticated,
    login,
    logout,
    initialize,
  };
});
