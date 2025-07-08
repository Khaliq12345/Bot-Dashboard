<template>
  <DashBoardHeader title="Bots Dashboard">
    <div
      v-if="loadingData"
      class="place-items-center place-content-center my-15"
    >
      <UProgress animation="carousel" color="secondary" />
    </div>
    <!-- When Loaded -->
    <div v-else class="mt-10">
      <div
        class="mb-10 flex flex-col md:flex-row gap-5 items-center justify-center"
      >
        <UCard
          v-for="botCard in botCards"
          class="w-full rounded-2xl max-w-md shadow-2xl md:text-lg text-sm"
          variant="outline"
          :class="{
            'bg-gray-300': !botCard.id,
            'bg-green-300': botCard.id && botCard.status == 'success',
            'bg-red-300': botCard.id && botCard.status != 'failed',
          }"
        >
          <div class="text-center">
            <h1 class="text-2xl font-bold">{{ botCard.creator }}</h1>
            <p class="text-gray-500">{{ botCard.bot_type }}</p>
          </div>
          <USeparator class="mx-5 my-3" />
          <div v-if="botCard.id" class="text-left">
            <div class="mb-3">
              <span class="font-bold">Running Status :</span>
              <span
                class="ml-2"
                :class="
                  isMoreThanOneHourAgo(botCard.last_run)
                    ? 'text-amber-600'
                    : 'text-green-600'
                "
              >
                {{
                  isMoreThanOneHourAgo(botCard.last_run) ? "Inactive" : "Active"
                }}
              </span>
            </div>
            <!--  -->
            <div class="mb-3" v-for="col in columns">
              <span class="font-bold">{{ col["title"] }}: </span>
              <span class="ml-2">
                {{ botCard[col["key"]] }}
              </span>
            </div>
            <!--  -->
          </div>
          <div v-else class="py-15 font-bold">No Data</div>
        </UCard>
      </div>
      <!--  -->
      <div class="mb-10">
        <!-- Table -->
        <UCollapsible :default-open="true">
          <UButton
            class="w-full p-4 bg-gray-300 rounded-bl-none rounded-br-none"
          >
            <span class="font-bold text-sm md:text-lg"> Bot Status Table </span>
          </UButton>
          <template #content>
            <UCard class="bg-gray-100 w-full">
              <BotsTable :creators="creatorsLst" />
            </UCard>
          </template>
        </UCollapsible>
      </div>
    </div>
  </DashBoardHeader>
</template>

<script setup lang="ts">
import type { SupabaseClient } from "@supabase/supabase-js";
import BotsTable from "~/components/Bots/BotsTable.vue";

interface Column {
  title: string;
  key: string;
}

// Initialise supabase client
const supabase = inject("supabase") as SupabaseClient;

// declare variables
const creatorsLst: Ref<any[]> = ref([]);
const loadingData: Ref<boolean> = ref(false);
const botTypes: Array<String> = ["comment"];
const botCards: Array<any> = [];
const columns: Column[] = [
  {
    title: "Last Run",
    key: "last_run",
  },
  {
    title: "Last Execution Run Status",
    key: "status",
  },
  {
    title: "Error",
    key: "last_error",
  },
];

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
      const creator = creatorsLst.value[i];
      for (const j in botTypes) {
        const botType = botTypes[j];
        // console.log(creator, botType)
        let { data, error } = await supabase
          .from("bot_status")
          .select("*")
          .eq("creator", creator)
          .eq("bot_type", botType)
          .order("last_run", { ascending: false })
          .limit(1);
        let latestBotStatus = {
          id: null,
          created_at: null,
          creator: creator,
          bot_type: botType,
          status: null,
          last_error: null,
          last_run: null,
          user: null,
        };
        if (error) {
          // console.error('Erreur lors de la récupération du statut du bot:', error);
        } else if (data && data.length > 0) {
          latestBotStatus = data[0];
        } else {
          // console.log('Aucun statut de bot correspondant trouvé.');
        }
        botCards.push(latestBotStatus);
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
