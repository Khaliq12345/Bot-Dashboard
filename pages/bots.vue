<template>
  <DashBoardHeader title="Bots Dashboard">
    <div v-if="loadingData" class="place-items-center place-content-center my-15">
      <UProgress animation="carousel" color="secondary" />
    </div>
    <!-- When Loaded -->
    <div v-else class="mt-10">
      <!-- General Metrics -->
      <div class="mb-10 flex gap-2 md:gap-5 items-center justify-center">
        <div class="" v-for="item in generalMetrics">
          <UCard variant="soft" class="text-center shadow-2xl" :class="item.color">
            <div class="flex items-center justify-start">
              <div class="text-left">
                <UIcon :name="item.icon" size="30" class="mr-5" />
                <h3 class="text-md md:text-lg font-bold mb-2">{{ item.value }}</h3>
                <p class="font-semibold">{{ item.title }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
      <!--  -->
      <USeparator class="mb-10 mx-15" />
      <!-- Bot Cards -->
      <div class="mb-10 flex flex-col md:flex-row gap-5 items-center justify-center">
        <UCard v-for="botCard in botCards" class="w-full rounded-2xl max-w-md shadow-2xl md:text-lg text-sm"
          variant="outline" :class="{
            'bg-gray-300': !botCard.id,
            'bg-green-300': botCard.id && botCard.status == 'success',
            'bg-red-300': botCard.id && botCard.status == 'failed',
          }">
          <div class="text-center">
            <h1 class="text-2xl font-bold">{{ botCard.creator }}</h1>
            <p class="text-gray-500">{{ botCard.bot_type }}</p>
          </div>
          <USeparator class="mx-5 my-3" />
          <div v-if="botCard.id" class="text-left">
            <div class="mb-3">
              <span class="font-bold">Running Status :</span>
              <span class="ml-2" :class="isMoreThanOneHourAgo(botCard.last_run)
                ? 'text-amber-600'
                : 'text-green-600'
                ">
                {{
                  isMoreThanOneHourAgo(botCard.last_run) ? "Inactive" : "Active"
                }}
              </span>
            </div>
            <!--  -->
            <div class="mb-3" v-for="col in columns">
              <span class="font-bold">{{ col["title"] }}: </span>
              <span v-if="!col['key2']" class="ml-2">
                {{ botCard[col["key"]] }}
              </span>
              <span v-if="!col['key']" class="ml-2">
                {{ botCard.metrics[col["key2"]] }}
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
          <UButton class="w-full p-4 bg-gray-300 rounded-bl-none rounded-br-none">
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
  key2: string;
}

// Initialise supabase client
const supabase = inject("supabase") as SupabaseClient;

// declare variables
const creatorsLst: Ref<any[]> = ref([]);
const loadingData: Ref<boolean> = ref(false);
const botTypes: Array<String> = ["comment"];
const botCards: Ref<Array<any>> = ref([]);
const columns: Column[] = [
  {
    title: "Last Run",
    key: "last_run",
    key2: "",
  },
  {
    title: "Last Run Status",
    key: "status",
    key2: "",
  },
  {
    title: "Error",
    key: "last_error",
    key2: "",
  },
  {
    title: "Total Runs",
    key: "",
    key2: "totalRuns",
  },
  {
    title: "Success Rate",
    key: "",
    key2: "successRate",
  },
  {
    title: "Uptime Percentage",
    key: "",
    key2: "uptimePercentage",
  },
  {
    title: "Failure Rate",
    key: "",
    key2: "failureRate",
  },
  {
    title: "Failure Percentage",
    key: "",
    key2: "failurePercentage",
  },
  {
    title: "Last Successful Run",
    key: "",
    key2: "lastSuccessRun",
  },
];
const generalMetrics = [
  { title: 'Total Bots', icon: 'i-lucide-bot', value: computed(() => botCards.value.length), color: 'bg-amber-200' },
  {
    title: 'Active Bots', icon: 'i-lucide-drone', value: computed(() => botCards.value.filter((value) => {
      return !isMoreThanOneHourAgo(value.last_run)
    }).length), color: 'bg-green-200'
  },
  { title: 'Inactive Bots', icon: 'i-lucide-bot-off', value: computed(() => botCards.value.filter((value) => {
      return isMoreThanOneHourAgo(value.last_run)
    }).length), color: 'bg-red-200' },
]

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
        if (data && data.length > 0) {
          latestBotStatus = data[0];
        }
        // Working Metrics
        let metrics = null;
        // All Data
        const { data: history, error: historyError } = await supabase
          .from('bot_status')
          .select('status, last_run, created_at')
          .eq('creator', creator)
          .eq('bot_type', botType)

        if (history) {
          const totalRuns = history.length
          const successes = history.filter((x) => x.status === 'success').length
          const failures = history.filter((x) => x.status === 'failed').length
          // Uptime = % de succès
          const uptime = totalRuns ? (successes / totalRuns) * 100 : 0
          // Taux d'échec
          const failurePercentage = totalRuns ? (failures / totalRuns) * 100 : 0
          // Dernier run réussi
          const lastSuccess = history
            .filter((x) => x.status === 'success')
            .sort((a, b) => new Date(b.last_run).getTime() - new Date(a.last_run).getTime())[0]

          metrics = {
            totalRuns: totalRuns,
            successRate: `${successes} / ${totalRuns}`,
            uptimePercentage: `${Number(uptime.toFixed(2))} %`,
            failureRate: `${failures} / ${totalRuns}`,
            failurePercentage: `${Number(failurePercentage.toFixed(2))} %`,
            lastSuccessRun: lastSuccess?.last_run || null,
          }
        }
        // 
        botCards.value.push({
          ...latestBotStatus,
          metrics: metrics
        });
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
