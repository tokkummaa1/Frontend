import { defineStore } from "pinia";
import api from "@/axios";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    assessments: {},
    attempts: [],
  }),
  actions: {
    async fetchAssessments(entityType, entityId) {
      try {
        const params = {
          assessment_type: entityType === "lesson" ? "quiz" : entityType,
          [entityType === "lesson"
            ? "lesson_id"
            : entityType === "module"
            ? "module_id"
            : "course_id"]: entityId,
        };

        const response = await api.get(`/api/v1/assessments/`, { params });
        this.assessments[`${entityType}-${entityId}`] = response.data;
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
    },

    async fetchAttempts() {
      try {
        const response = await api.get("/api/v1/user-attempts/");
        this.attempts = response.data;
      } catch (error) {
        console.error("Error fetching attempts:", error);
      }
    },

    async submitAttempt(assessmentId, responses) {
      try {
        const response = await api.post("/api/v1/user-attempts/", {
          assessment: assessmentId,
          responses: responses,
        });
        this.attempts.push(response.data);
        return response.data;
      } catch (error) {
        console.error("Submission failed:", error.response?.data);
        throw error;
      }
    },

    isAssessmentCompleted(assessmentId) {
      return this.attempts.some(
        (attempt) => attempt.assessment === assessmentId && attempt.passed
      );
    },

    async deleteAttempt(attemptId) {
      try {
        await api.delete(`/api/v1/user-attempts/${attemptId}/`);
        this.attempts = this.attempts.filter(
          (attempt) => attempt.id !== attemptId
        );
        return true;
      } catch (error) {
        console.error("Delete attempt failed:", error);
        throw error;
      }
    },
  },
  getters: {
    currentAttempt: (state) => (assessmentId) => {
      return state.attempts.find((a) => a.assessment === assessmentId);
    },
  },
});
