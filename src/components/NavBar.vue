<template>
  <nav class="bg-white shadow-sm relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Left Side - Logo & Mobile Menu -->
        <div class="flex items-center">
          <button @click="toggleMobileMenu" class="md:hidden p-2 text-gray-600 hover:text-gray-800">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    :d="isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
            </svg>
          </button>
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-primary ml-2">EduLearn</span>
          </router-link>
        </div>

        <!-- Center - Search Input (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-2xl mx-8">
          <div class="relative w-full">
            <input
              v-model="navSearchQuery"
              @keyup.enter="handleNavbarSearch"
              type="text"
              placeholder="Search courses..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <button 
              @click="handleNavbarSearch"
              class="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Desktop Navigation Items -->
        <div class="hidden md:flex items-center space-x-4 ml-4">
          <router-link 
            to="/" 
            class="px-3 py-2 text-gray-600 hover:text-gray-800"
          >
            Home
          </router-link>
          <router-link 
            to="/my-courses" 
            class="px-2 text-gray-600 hover:text-gray-800 relative"
          >
            My Courses
            <span 
              v-if="enrollmentCount > 0"
              class="absolute -top-2 -right-4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              {{ enrollmentCount }}
            </span>
          </router-link>
          <router-link 
            to="/courses/:id"
            class="px-3 py-2 text-gray-600 hover:text-gray-800"
          >
            All Courses
          </router-link>
          <router-link to="/about" class="px-3 py-2 text-gray-600 hover:text-gray-800"
          >
            About Us
          </router-link>
          <router-link to="/contact" class="px-3 py-2 text-gray-600 hover:text-gray-800"
          >
            Contact
          </router-link>
          <router-link
            v-if="!authStore.token"
            to="/login"
            class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-[#1D4ED8]"
          >
            Log In
          </router-link>
          <router-link
            v-if="!authStore.token"
            to="/signup"
            class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-[#1D4ED8]"
          >
            Sign Up
          </router-link>
        </div>

        <!-- Right Side - Navigation Links -->
        <div class="flex items-center space-x-4">
          <div class="md:hidden">
            <button @click="toggleSearch" class="p-2 text-gray-600 hover:text-gray-800">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
          <router-link
            v-if="!authStore.token"
            to="/login"
            class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-[#1D4ED8] md:hidden"
          >
            Log In
          </router-link>
          <router-link
            v-if="!authStore.token"
            to="/signup"
            class="px-4 py-2 sm-p-1 rounded-md text-sm font-medium bg-primary text-white hover:bg-[#1D4ED8] md:hidden"
          >
            Sign Up
          </router-link>
          <!-- Profile Dropdown -->
          <div class="relative" v-if="authStore.token" ref="profileContainer">
            <button 
              @click="toggleProfileMenu"
              class="flex items-center space-x-2 focus:outline-none"
            >
              <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                {{ userInitial }}
              </div>
            </button>

            <!-- Dropdown Menu -->
            <div v-show="showProfileMenu" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
              <button 
                @click="showLogoutConfirm = true"
                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link 
            v-for="link in mobileLinks"
            :key="link.path"
            :to="link.path"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </router-link>
        </div>
        <div v-show="showMobileSearch" class="px-3 py-2">
          <input
            v-model="navSearchQuery"
            @keyup.enter="handleNavbarSearch"
            type="text"
            placeholder="Search courses..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Popup -->
    <ConfirmLogoutPopup 
      :show="showLogoutConfirm"
      @close="showLogoutConfirm = false"
      @confirm="logOut"
    />
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/store/courseStore';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { storeToRefs } from 'pinia';
import ConfirmLogoutPopup from '@/components/ConfirmLogoutPopup.vue';

const courseStore = useCourseStore();
const authStore = useAuthStore();
const router = useRouter();
const enrollmentStore = useEnrollmentStore();
const { count: enrollmentCount } = storeToRefs(enrollmentStore);

// State
const isMobileMenuOpen = ref(false);
const showProfileMenu = ref(false);
const showMobileSearch = ref(false);
const showLogoutConfirm = ref(false);
const navSearchQuery = ref('');
const profileContainer = ref(null); // Ref for profile button container

// Data
const mobileLinks = [
  { path: '/my-courses', label: 'My Courses' },
  { path: '/courses/:id', label: 'All Courses' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact' },
  { path: '/profile', label: 'Profile' },
];

// Computed
const userInitial = computed(() => {
  return authStore.email?.charAt(0).toUpperCase() || 'U';
});

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  showMobileSearch.value = false;
};

const toggleSearch = () => {
  showMobileSearch.value = !showMobileSearch.value;
  if (showMobileSearch.value) isMobileMenuOpen.value = true;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const handleClickOutside = (event) => {
  if (profileContainer.value && !profileContainer.value.contains(event.target)) {
    showProfileMenu.value = false;
  }
};

const logOut = () => {
  authStore.logout();
  showProfileMenu.value = false;
  showLogoutConfirm.value = false;
  router.push({ name: 'login' });
};

const handleNavbarSearch = () => {
  if (navSearchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: navSearchQuery.value.trim() }
    });
    navSearchQuery.value = '';
  }
};

// Lifecycle Hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>