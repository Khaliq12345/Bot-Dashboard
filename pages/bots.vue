<template>
  <div class="min-h-screen flex">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden w-full">
      <!-- Header -->
      <header class="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-center">
          <!-- Mobile Menu Button -->
          <h3 class="text-2xl font-semibold text-center">
            Bots Dashboard
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
        <div v-if="loadingData" class="place-items-center place-content-center my-15">
          <UProgress animation="carousel" color="secondary" />
        </div>
        <!-- When Loaded -->
        <div v-else class="mt-10">
          <div class="mb-10 flex gap-x-5 items-center justify-center">
            <UCard v-for="botCard in botCards" class="w-full rounded-2xl max-w-md shadow-2xl" variant="solid"
              :class="{
                'bg-gray-200': !botCard.id,
                'bg-primary-200': botCard.id && botCard.status == 'success',
                'bg-red-200': botCard.id && botCard.status != 'success',
              }">
              <div class="text-center">
                <h1 class="text-2xl font-bold">{{ botCard.creator }}</h1>
                <p class="text-gray-500">{{ botCard.bot_type }}</p>
              </div>
              <USeparator class="mx-5 my-3" />
              <div v-if="botCard.id" class="text-left">
                <div class="mb-3">
                  <span class="font-bold">Running Status :</span>
                  <span class="ml-2"
                    :class="isMoreThanOneHourAgo(botCard.last_run) ? 'text-amber-600' : 'text-green-600'">
                    {{ isMoreThanOneHourAgo(botCard.last_run) ? 'Inactive' : 'Active' }}
                  </span>
                </div>
                <!--  -->
                <div class="mb-3">
                  <span class="font-bold">Last Run :</span>
                  <span class="ml-2">
                    {{ botCard.last_run }}
                  </span>
                </div>
                <!--  -->
                <div class="mb-3">
                  <span class="font-bold">Global Status :</span>
                  <span class="ml-2">
                    {{ botCard.status }}
                  </span>
                </div>
                <!--  -->
                <div class="mb-3">
                  <span class="font-bold">Last Error :</span>
                  <span class="ml-2">
                    {{ botCard.last_error ?? 'None' }}
                  </span>
                </div>

              </div>
              <div v-else class="py-15 font-bold">
                No Data
              </div>

            </UCard>
          </div>
          <!--  -->
          <div class="mb-10">
            <!-- Table -->
            <UCollapsible :default-open="true">
              <UButton class="w-full p-4 bg-gray-300 rounded-bl-none rounded-br-none">
                <span class="font-bold text-sm md:text-lg">
                  Bot Status Table
                </span>
              </UButton>
              <template #content>
                <UCard class="bg-gray-100 w-full">
                  <BotsTable
                    :creators="creatorsLst"
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
import BotsTable from "~/components/Bots/BotsTable.vue";

// Initialise supabase client
const supabase = inject("supabase") as SupabaseClient;

// declare variables
const creatorsLst: Ref<any[]> = ref([]);
const loadingData: Ref<boolean> = ref(false);
const botTypes: Array<String> = ["comment"];
const botCards: Array<any> = [];

// Functions
async function loadCreators() {
  try {
    let { data } = await supabase.from("creators").select("*");
    creatorsLst.value = data?.map((d) => d.creator) ?? [];
  } catch (err) {
    console.error("Error:", err);
  } finally {
  }
}

async function loadCardsInfo() {
  loadingData.value = true;
  await loadCreators();
  try {
    for (const i in creatorsLst.value) {
      const creator = creatorsLst.value[i]
      for (const j in botTypes) {
        const botType = botTypes[j]
        // console.log(creator, botType)
        let { data, error } = await supabase
          .from("bot_status")
          .select("*")
          .eq('creator', creator)
          .eq('bot_type', botType)
          .order('id', { ascending: false })
          .limit(1);
        let latestBotStatus = { "id": null, "created_at": null, "creator": creator, "bot_type": botType, "status": null, "last_error": null, "last_run": null, "user": null };
        if (error) {
          // console.error('Erreur lors de la récupération du statut du bot:', error);
        } else if (data && data.length > 0) {
          latestBotStatus = data[0];
        } else {
          // console.log('Aucun statut de bot correspondant trouvé.');
        }
        botCards.push(latestBotStatus)
      }
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    loadingData.value = false;
  }
}

onMounted(async () => {
  await loadCardsInfo();
});
</script>
