<template>
  <footer class="mt-16 border-t border-gray-200">
    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-primary">EduLearn</h3>
          <p class="text-gray-600">Empowering learners worldwide with quality education.</p>
        </div>
        <div class="space-y-2">
          <h4 class="font-semibold text-gray-800">Company</h4>
          <router-link to="/about" class="block text-gray-600 hover:text-primary">About Us</router-link>
          <router-link to="/careers" class="block text-gray-600 hover:text-primary">Careers</router-link>
          <router-link to="/contact" class="block text-gray-600 hover:text-primary">Contact</router-link>
        </div>
        <div class="space-y-2">
          <h4 class="font-semibold text-gray-800">Legal</h4>
          <router-link to="/privacy" class="block text-gray-600 hover:text-primary">Privacy Policy</router-link>
          <router-link to="/terms" class="block text-gray-600 hover:text-primary">Terms of Service</router-link>
          <router-link to="/cookies" class="block text-gray-600 hover:text-primary">Cookie Policy</router-link>
        </div>
        <div class="space-y-2">
          <h4 class="font-semibold text-gray-800">Connect</h4>
          <a href="#" class="block text-gray-600 hover:text-primary">Twitter</a>
          <a href="#" class="block text-gray-600 hover:text-primary">Facebook</a>
          <a href="#" class="block text-gray-600 hover:text-primary">LinkedIn</a>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
        <p>&copy; 2025 EduLearn. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
