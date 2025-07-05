<script setup lang="ts">
const props = defineProps({
  menuLst: {
    type: Object,
    required: true
  },
  activeMenu: {
    type: Object,
    default: () => ({})
  },
})
const emit = defineEmits(['menu-item-clicked', 'close-sidebar'])
</script>

<template>
  <div class="flex flex-col p-4 md:bg-gray-100 w-full h-full">
    <!-- Title -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-center w-full">Dashboard</h3>
      <div class="md:hidden">
        <UButton icon="i-heroicons-x-mark" variant="ghost" @click="$emit('close-sidebar')" />
      </div>
    </div>
    <div class="mb-2 w-full text-center">
      <h3 class="text-xl font-semibold text-primary-800">Menu List</h3>
    </div>
    <!-- Separator -->
    <USeparator class="my-4"  size="md" />
    <!-- Listing Menu -->
    <nav class="flex-1 space-y-4 w-full">
      <UButton v-for="menu in props.menuLst" :key="menu['id']" variant="ghost"
        class="text-primary hover:bg-primary-700 hover:text-white flex items-center py-2 px-3 rounded-lg w-full"
        :class="{ 'bg-primary-800 text-white': menu['id'] === activeMenu['id'] }"
        @click="$emit('menu-item-clicked', menu)">
        <UIcon :name="menu.icon" class="mr-2 w-5 h-5" />
        <span class="flex-1 text-left">{{ menu['name'] }}</span>
        <!-- Badge -->
        <!-- <UBadge class="rounded-full" :class="{
          'bg-primary-100' : true
        }">
          {{ menu.id }}
        </UBadge> -->
      </UButton>
    </nav>
  </div>
</template>
