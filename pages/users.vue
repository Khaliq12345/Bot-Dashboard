<template>
  <div class="min-h-screen flex">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden w-full">
      <!-- Header -->
      <header class="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-center">
          <!-- Mobile Menu Button -->
          <h3 class="text-2xl font-semibold text-center">
            User/Scraper Dashboard
          </h3>
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
        <div
          v-if="loadingData"
          class="place-items-center place-content-center my-15"
        >
          <UProgress animation="carousel" color="secondary" />
        </div>
        <!-- When Loaded -->
        <div v-else class="mt-10">
          <div v-for="variation in variations" class="mb-10">
            <!-- Unassigned Card  -->
            <UCollapsible :default-open="true">
              <UButton
                class="w-full p-4 bg-gray-300 rounded-bl-none rounded-br-none"
              >
                <span class="font-bold text-sm md:text-lg">
                  {{ variation.title }}
                </span>
              </UButton>
              <template #content>
                <UCard class="bg-gray-100 w-full">
                  <UsersTable
                    :creators="creatorsLst"
                    :user-type="variation.userType"
                  />
                </UCard>
              </template>
            </UCollapsible>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveComponent } from "vue";

const UButton = resolveComponent("UButton");

// Initialise supabase client
const supabase = inject("supabase") as SupabaseClient;

// declare variables
const creatorsLst: Ref<any[]> = ref([]);
const loadingData: Ref<boolean> = ref(false);
const variations: Array<any> = [
  {
    userType: "Unassigned",
    title: "Unassigned Users",
  },
  {
    userType: "Untreated",
    title: "Untreated Users",
  },
];

// Functions
async function loadCreators() {
  loadingData.value = true;
  try {
    let { data } = await supabase.from("creators").select("*");
    creatorsLst.value = data?.map((d) => d.creator) ?? [];
  } catch (err) {
    console.error("Error:", err);
  } finally {
    loadingData.value = false;
  }
}
onMounted(async () => {
  await loadCreators();
});
</script>
