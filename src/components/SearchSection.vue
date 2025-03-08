<template>
  <div class="container-fluid m-0 p-3">
    <!-- ... existing template ... -->
  </div>
</template>

<script>
export default {
  name: 'SearchSection',
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$emit('search', this.searchQuery.trim())
        this.searchQuery = ''
      }
    }
  }
}
</script>