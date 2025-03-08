<template>
  <div class="container py-4">
    <SearchSection @search="handleSearch" />
    
    <!-- Results Section -->
    <div v-if="courseStore.searchedCourses.length" class="row g-4 mt-4">
      <div 
        class="col-md-4" 
        v-for="course in courseStore.searchedCourses" 
        :key="course.id"
      >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
        <CourseCard :course="course" />
      </div>
      </div>
    </div>

    <div v-else-if="searchExecuted" class="mt-4 text-center text-muted">
      No courses found matching your search
    </div>
  </div>
</template>

<script>
import { useCourseStore } from '@/store/courseStore'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CourseCard from '@/components/cards/CourseCard.vue'
import SearchSection from '@/components/SearchSection.vue'

export default {
  components: {
    CourseCard,
    SearchSection
  },
  setup() {
    const courseStore = useCourseStore()
    const route = useRoute()
    const searchExecuted = ref(false)

    const performSearch = async (query) => {
      try {
        await courseStore.searchCourses(query)
        searchExecuted.value = true
      } catch (error) {
        console.error("Search error:", error)
      }
    }

    // Handle initial search from URL query
    if (route.query.q) {
      performSearch(route.query.q)
    }

    // Watch for URL changes
    watch(() => route.query.q, (newQuery) => {
      if (newQuery) {
        performSearch(newQuery)
      }
    })

    const handleSearch = (query) => {
      performSearch(query)
    }

    return { courseStore, handleSearch, searchExecuted }
  }
}
</script>