<template>
  <div
    class="min-h-screen text-center bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4"
  >
    <UCard class="w-full rounded-2xl p-5 max-w-md shadow-2xl" variant="solid">
      <div class="text-center space-y-3">
        <UIcon
          size="50"
          name="i-lucide-home"
          class="w-12 h-12 mx-auto text-primary-500"
        />
        <h1 class="text-3xl font-bold">Home Page</h1>
        <p class="text-gray-500">Navigation</p>
      </div>
      <UButton
      v-for="m in menus"
        :to="m.path"
        color="neutral"
        class="w-full p-4 bg-primary-200 mt-10 rounded-2xl"
      >
        <span class="font-bold text-xl"> {{ m.name }} </span>
      </UButton>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const menus = [
  {name: "Users / Scrape", path: "/users"},
  {name: "Bot Status", path: "/bots"},
  {name: "Scraper Status", path: "/scraper"},
]
</script>
