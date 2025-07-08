<template>
  <DashBoardHeader title="User/Scraper Dashboard">
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
  </DashBoardHeader>
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
