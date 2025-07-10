<template>
    <DashBoardHeader title="Scraper Dashboard">
        <div v-if="loadingData || !botCard" class="place-items-center place-content-center my-15">
            <UProgress animation="carousel" color="secondary" />
        </div>
        <!-- When Loaded -->
        <div v-else class="mt-10">
            <!-- Bot Card -->
            <div class="mb-10 flex flex-col md:flex-row gap-5 items-center justify-center">
                <UCard class="w-full rounded-2xl max-w-md shadow-2xl md:text-lg text-sm" variant="outline" :class="{
                    'bg-gray-300': !botCard.id,
                    'bg-green-300': botCard.id && botCard.status == 'success',
                    'bg-red-300': botCard.id && botCard.status == 'failed',
                    'bg-amber-300': botCard.id && botCard.status == 'running',
                }">
                    <div class="text-center">
                        <h1 class="text-2xl font-bold uppercase mb-1">{{ botCard.status }}</h1>
                        <p class="text-gray-500">Last Run Status</p>
                    </div>
                    <USeparator class="mr-5 my-3" />
                    <div v-if="botCard.id" class="text-left">
                        <div class="mb-2" v-for="col in columns">
                            <div v-if="botCard[col.key]" class="">
                                <span class="font-bold">{{ col["title"] }}: </span>
                                <span class="ml-2">
                                    {{ botCard[col["key"]] }}
                                </span>
                            </div>

                        </div>

                    </div>
                    <div v-else class="py-15 font-bold">No Data</div>
                </UCard>
            </div>
            <!--  -->
            <USeparator class="mb-10" />
            <!--  -->
            <!-- General Metrics -->
            <div v-if="generalMetricskeys" class="mb-10 flex flex-wrap gap-2 md:gap-5 items-center justify-center">
                <div class="" v-for="item in generalMetrics">
                    <UCard variant="soft" class="text-center shadow-2xl" :class="item.color">
                        <div class="flex items-center justify-start">
                            <div class="text-left">
                                <UIcon :name="item.icon" size="30" class="mr-5" />
                                <h3 class="text-md md:text-lg font-bold mb-2">
                                    {{ generalMetricskeys[item['key']] }}
                                </h3>
                                <p class="font-semibold">{{ item.title }}</p>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </div>
    </DashBoardHeader>
</template>

<script setup lang="ts">
import type { SupabaseClient } from "@supabase/supabase-js";

// Initialise supabase client
const supabase = inject("supabase") as SupabaseClient;

// declare variables
const loadingData: Ref<boolean> = ref(false);
const botCard: Ref<any> = ref(null);
const columns: any[] = [
    {
        title: "Created At",
        key: "created_at",
    },
    {
        title: "Error Details",
        key: "error",
    },
];
const generalMetricskeys: Ref<any> = ref({
    totalSuccess: 0,
    totalFails: 0,
    successRate: '',
    failRate: '',
})
const generalMetrics = [
    {
        title: "Total Success",
        icon: "i-lucide-check-check",
        key: "totalSuccess",
        color: "bg-green-200",
    },
    {
        title: "Total Fails",
        icon: "i-lucide-circle-x",
        key: "totalFails",
        color: "bg-red-200",
    },
    {
        title: "Success Rate",
        icon: "i-lucide-square-percent",
        key: "successRate",
        color: "bg-green-200",
    },
    {
        title: "Fail Rate",
        icon: "i-lucide-diamond-percent",
        key: "failRate",
        color: "bg-red-200",
    },
];

// Functions
async function loadCardsInfo() {
    console.log("Calling");
    loadingData.value = true;
    try {
        let { data, error } = await supabase
            .from("scraping_status")
            .select("*")
            .order("id", { ascending: false })
            .eq('id', '2')
            .limit(1);
        if (data && data.length > 0) {
            botCard.value = data[0];
        }
        // Working Metrics
        const { data: history, error: historyError } = await supabase
            .from("scraping_status")
            .select("*");

        if (history) {
            const totalRuns = history.length;
            const successes = history.filter(
                (x) => x.status === "success",
            ).length;
            const failures = history.filter((x) => x.status === "failed").length;
            const successrate = totalRuns ? (successes / totalRuns) * 100 : 0;
            const failurerate = totalRuns ? (failures / totalRuns) * 100 : 0;
            generalMetricskeys.value = {
                totalSuccess: successes,
                totalFails: failures,
                successRate: `${successes}/${totalRuns} (${Number(successrate.toFixed(2))} %)`,
                failRate: `${failures}/${totalRuns} (${Number(failurerate.toFixed(2))} %)`,
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
