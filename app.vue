<template>
  <div>
    <UApp class="text-red-500">
      <NuxtPage></NuxtPage>
    </UApp>
  </div>
</template>

<script setup lang="ts">
const { supabase } = useSupabaseSub();
provide("supabase", supabase);
</script>
