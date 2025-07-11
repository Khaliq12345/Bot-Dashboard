<template>
  <DashBoardHeader title="User/Scraper Dashboard">
    <div v-if="loadingData" class="place-items-center place-content-center my-15">
      <UProgress animation="carousel" color="secondary" />
    </div>
    <!-- When Loaded -->
    <div v-else class="mt-10">
      <div class="justify-center items-center">
        <UButtonGroup class="">
          <USelect :items="creatorsLst" v-model="creator" name="Creators" placeholder="Creators" class="text-red-300"
            :required="false" />
          <UButton @click="creator = ''" color="neutral" icon="i-heroicons-x-mark" />
        </UButtonGroup>


        <div class="mt-5 mb-10 flex gap-2 md:gap-5 items-center justify-center">
          <UCard v-for="card in topCards" variant="soft" class="text-center shadow-2xl">
            <div class="flex items-center justify-start">
              <div class="text-left">
                <UIcon :name="card.icon" size="30" class="mr-5" />
                <h3 class="text-md md:text-lg font-bold mb-2">
                  {{ topCardsKeys[card['key']] }}
                </h3>
                <p class="font-semibold">{{ card.title }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
      <!-- Tables -->
      <div v-for="variation in variations" class="mb-10">
        <!-- Unassigned Card  -->
        <UCollapsible :default-open="true">
          <UButton class="w-full p-4 bg-gray-300 rounded-bl-none rounded-br-none">
            <span class="font-bold text-sm md:text-lg">
              {{ variation.title }}
            </span>
          </UButton>
          <template #content>
            <UCard class="bg-gray-100 w-full">
              <UsersTable :creators="creatorsLst" :user-type="variation.userType" />
            </UCard>
          </template>
        </UCollapsible>
      </div>
    </div>

  </DashBoardHeader>
</template>

<script setup lang="ts">
import type { SupabaseClient } from "@supabase/supabase-js";

// Initialise supabase client
const supabase = inject("supabase") as SupabaseClient;

// declare variables
const creatorsLst: Ref<any[]> = ref([]);
const creator: Ref<any> = ref(null);
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
const topCardsKeys: Ref<any> = ref({
  total_assigned: 0,
  total_untreated: 0,
})
const topCards: Array<any> = [
  {
    key: "total_assigned",
    icon: "i-lucide-user-round-check",
    title: "Total Assigned",
  },
  {
    key: "total_untreated",
    icon: "i-lucide-user-round-x",
    title: "Total Untreated",
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
const loadStats = async () => {
  loadingData.value = true;
  try {
    let stmt = supabase
      .from("users")
      .select("*")
    if (creator.value) {
      stmt = stmt.eq("assigned", creator.value);
    }
    const { data } = await stmt;
    console.log("data Loaded -- ", data?.length)
    topCardsKeys.value = {
      total_assigned: data?.filter((v) => v.assigned).length,
      total_untreated: data?.filter((v) => !v.last_interaction_date).length,
    };
  } catch (err) {
    console.error("Error:", err);
  } finally {
    loadingData.value = false;
  }
};

watch(creator, async (newVal, oldVal) => {
  await loadStats();
});

onMounted(async () => {
  await loadCreators();
  await loadStats();
  setInterval(async () => {
    await loadStats();
  }, 60000);
});
</script>
