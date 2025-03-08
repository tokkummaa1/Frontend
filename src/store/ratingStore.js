import { defineStore } from "pinia";
import api from "@/axios";

export const useRatingStore = defineStore("rating", {
  state: () => ({
    userRatings: {},
  }),
  actions: {
    async submitRating(courseId, rating) {
      try {
        const response = await api.post(`/api/v1/courses/${courseId}/rate/`, {
          rating: rating,
        });

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        // Update local state with new rating
        this.userRatings[courseId] = {
          rating: response.data.rating,
          timestamp: response.data.created_at,
        };

        return true;
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to submit rating. Please try again.";

        console.error("Rating submission failed:", errorMessage);
        throw new Error(errorMessage);
      }
    },

    async checkHasRated(courseId) {
      try {
        const response = await api.get(
          `/api/v1/courses/${courseId}/has_rated/`
        );
        return response.data.has_rated;
      } catch (error) {
        console.error("Failed to check rating:", error);
        // Return true to prevent popup spam on error
        return true;
      }
    },
  },
});
