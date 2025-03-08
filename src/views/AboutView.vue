<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-primary text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold">About EduLearn</h1>
        <p class="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Empowering minds through innovative education and lifelong learning.
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Our Mission</h2>
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="md:w-1/2">
            <p class="text-gray-700 text-lg">
              At EduLearn, we believe education is the key to unlocking potential. Our mission is to provide accessible, high-quality learning experiences that inspire curiosity, foster growth, and prepare individuals for a dynamic world. With cutting-edge courses and a passion for teaching, we’re here to make learning a lifelong adventure.
            </p>
          </div>
          <div class="md:w-1/2">
            <img src="@/assets/aboutImage.webp" alt="Mission Image" class="rounded-lg shadow-md">
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="bg-gray-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-32 h-32 mx-auto bg-tertiary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <h3 class="mt-4 text-xl font-semibold text-gray-900">Jane Doe</h3>
            <p class="text-gray-600">Founder & CEO</p>
            <p class="mt-2 text-gray-700">Leading with a vision for transformative education.</p>
          </div>
          <div class="text-center">
            <div class="w-32 h-32 mx-auto bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              JS
            </div>
            <h3 class="mt-4 text-xl font-semibold text-gray-900">John Smith</h3>
            <p class="text-gray-600">Head of Content</p>
            <p class="mt-2 text-gray-700">Crafting engaging and impactful courses.</p>
          </div>
          <div class="text-center">
            <div class="w-32 h-32 mx-auto bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              EM
            </div>
            <h3 class="mt-4 text-xl font-semibold text-gray-900">Emily Miles</h3>
            <p class="text-gray-600">Tech Lead</p>
            <p class="mt-2 text-gray-700">Building a seamless learning platform.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-secondary text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold">Join Us on This Journey</h2>
        <p class="mt-4 text-lg max-w-2xl mx-auto">
          Ready to start learning? Explore our courses or get in touch with us today!
        </p>
        <div class="mt-8 flex justify-center gap-4">
          <router-link
            to="/courses/:id"
            class="px-6 py-3 bg-white text-secondary font-medium rounded-md hover:bg-gray-100"
          >
            Browse Courses
          </router-link>
          <router-link
            to="/contact"
            class="px-6 py-3 bg-tertiary text-white font-medium rounded-md hover:bg-purple-700"
          >
            Contact Us
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
</script>