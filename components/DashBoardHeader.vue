<template>
  <div class="min-h-screen flex">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden w-full">
      <!-- Header -->
      <header class="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-center">
          <!-- Mobile Menu Button -->
          <h3 class="text-2xl font-semibold text-center">{{ title }}</h3>
        </div>
      </header>
      <!-- Main Content -->
      <main class="text-center overflow-y-auto md:p-4 p-1 lg:p-8">
        <!-- Welcome -->
        <div class="flex justify-center">
          <div class="flex flex-col ml-4">
            <span class="text-2xl md:text-3xl m-5">
              Welcome, <span class="font-bold text-primary-800"> Here </span> !
            </span>
          </div>
        </div>
        <!-- Page Content -->
        <!-- Loading -->
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
