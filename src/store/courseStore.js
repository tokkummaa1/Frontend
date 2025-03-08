import { defineStore } from "pinia";
import api from "@/axios";

export const useCourseStore = defineStore("courses", {
  state: () => ({
    enrolledCourses: JSON.parse(localStorage.getItem("enrolledCourses")) || [],
    currentCourseIndex: Number(localStorage.getItem("currentCourseIndex")) || 0,
    currentCourse: JSON.parse(localStorage.getItem("currentCourse")) || null,
    progress: JSON.parse(localStorage.getItem("progress")) || {},
    searchedCourses: [],
    lastViewedLesson:
      JSON.parse(localStorage.getItem("lastViewedLesson")) || {}, // { courseId: lessonId }
  }),
  actions: {
    async fetchEnrolledCourses() {
      try {
        const { data: enrollments } = await api.get("/api/v1/enrollments/");
        const { data: serverProgress } = await api.get("/api/v1/progress/");
        console.log("Enrollments:", JSON.stringify(enrollments));
        console.log("Server progress:", JSON.stringify(serverProgress));

        this.progress = Object.keys(serverProgress || {}).reduce((acc, key) => {
          acc[key] = Array.isArray(serverProgress[key])
            ? serverProgress[key]
            : [];
          return acc;
        }, {});

        console.log("Progress after fetch:", JSON.stringify(this.progress));

        this.enrolledCourses = await Promise.all(
          enrollments.map(async (enrollment) => {
            const { data: course } = await api.get(
              `/api/v1/courses/${enrollment.course}/`,
              { params: { expand: "modules.lessons" } }
            );
            return {
              ...course,
              progress: this.progress[course.id] || [],
            };
          })
        );
        localStorage.setItem(
          "enrolledCourses",
          JSON.stringify(this.enrolledCourses)
        );
        localStorage.setItem("progress", JSON.stringify(this.progress));
      } catch (error) {
        console.error(
          "Failed to fetch courses or progress:",
          error.response?.status,
          error.response?.data
        );
        this.progress = {};
        this.enrolledCourses = [];
      }
    },

    async updateLessonProgress(courseId, lessonId, completed) {
      const currentProgress = Array.isArray(this.progress[courseId])
        ? this.progress[courseId]
        : [];
      const newProgress = [...currentProgress];
      const existing = newProgress.find((p) => p.lesson.id === lessonId);

      if (!existing) {
        newProgress.push({
          lesson: { id: lessonId },
          completed: true,
          updated_at: new Date().toISOString(),
        });
      } else {
        existing.completed = true;
        existing.updated_at = new Date().toISOString();
      }

      console.log(
        "Updating lesson:",
        lessonId,
        "New progress:",
        JSON.stringify(newProgress)
      );
      this.progress = { ...this.progress, [courseId]: newProgress };
      this.enrolledCourses = this.enrolledCourses.map((course) =>
        course.id === courseId
          ? { ...course, progress: [...newProgress] }
          : course
      );

      localStorage.setItem("progress", JSON.stringify(this.progress));
      localStorage.setItem(
        "enrolledCourses",
        JSON.stringify(this.enrolledCourses)
      );

      try {
        const response = await api.post("/api/v1/progress/", {
          courseId,
          lessonId,
          completed: true,
        });
        console.log(
          "Server response:",
          response.status,
          JSON.stringify(response.data)
        );
      } catch (error) {
        console.error(
          "Failed to update progress on server:",
          error.response?.status,
          error.response?.data
        );
      }
    },

    setLastViewedLesson(courseId, lessonId) {
      this.lastViewedLesson[courseId] = lessonId;
      localStorage.setItem(
        "lastViewedLesson",
        JSON.stringify(this.lastViewedLesson)
      );
      console.log(
        "Set last viewed lesson for course",
        courseId,
        "to",
        lessonId
      );
    },

    getLastViewedLesson(courseId) {
      return this.lastViewedLesson[courseId] || null;
    },

    setCurrentCourseIndex(index) {
      this.currentCourseIndex = index;
      localStorage.setItem("currentCourseIndex", index);
    },

    setCurrentCourse(course) {
      this.currentCourse = course;
      localStorage.setItem("currentCourse", JSON.stringify(course));
    },

    $reset() {
      this.enrolledCourses = [];
      this.currentCourseIndex = 0;
      this.currentCourse = null;
      this.progress = {};
      // Preserve lastViewedLesson across logout/login
      localStorage.removeItem("enrolledCourses");
      localStorage.removeItem("currentCourseIndex");
      localStorage.removeItem("currentCourse");
      localStorage.removeItem("progress");
    },

    async searchCourses(query) {
      try {
        const response = await api.get("/api/v1/courses/search/", {
          params: { search: query, expand: "modules.lessons" },
        });
        this.searchedCourses = response.data;
      } catch (error) {
        console.error("Search failed:", error);
      }
    },
  },

  persist: {
    paths: [
      "enrolledCourses",
      "currentCourseIndex",
      "currentCourse",
      "progress",
      "lastViewedLesson",
    ],
    storage: localStorage,
  },
});
