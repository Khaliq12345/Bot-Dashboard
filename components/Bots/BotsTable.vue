<template>
  <div class="w-full">
    <div class="flex flex-row justify-center md:justify-between w-full gap-4 mb-5">
      <TableFilters :creators="creators" :orders="sortOrders" :statuses="sortStatuses" :with-status="true" @update-creator="(value) => (selectedCreator = value)"
    @update-limit="(value) => (limit = value)"
    @update-status="(value) => (sortStatus = value)"
    @update-order="(value) => (sortOrder = value)" @export-c-s-v="useexportCSV(botData, cols, 'bots_status')" />
    </div>
    <TableModel :columns0="columns" :data0="botData" :creators-lst="creators"
      :key="`${botData.length}_${selectedCreator}_${sortOrder}`" />
    <UButtonGroup class="mt-5">
      <UButton color="neutral" variant="outline" label="Prev" @click="page > 0 ? page-- : {}" />
      <UButton color="neutral" variant="outline" label="Next" @click="page++" />
    </UButtonGroup>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { SupabaseClient } from "@supabase/supabase-js";

const props = defineProps({
  creators: { type: Array<any>, required: true },
});


// initialize variables
const botData = ref<Array<any>>([]);
const sortOrders = ["asc", "desc"];
const sortOrder = ref(sortOrders[0]);
const sortStatuses = ["success", "failed"];
const sortStatus = ref(sortStatuses[0]);
const selectedCreator = ref(props.creators[0]);
const limit = ref(10);
const page = ref(1);
const tableLoading: Ref<boolean> = ref(false);
const cols: string[] = [
  "id",
  "created_at",
  "creator",
  "bot_type",
  "status",
  "last_error",
  "last_run",
  "user",
];
const columns: TableColumn<any>[] = [];

//initialize supabase
const supabase = inject("supabase") as SupabaseClient;

// setting up the columns
cols.forEach((col) => {
  let keyName = "";
  let cell = "";
  if (col == "id") {
    keyName = "#";
    cell = "#";
  } else {
    keyName = col.replace("_", " ").toUpperCase();
    cell = "";
  }
  columns.push({
    accessorKey: col,
    header: keyName,
    cell: ({ row }) => `${cell}${row.getValue(col)}`,
    meta: {
      class: {
        th: "text-red-900 text-center",
        td: "text-gray-800",
      },
    },
  });
});

// Functions
const loadData = async () => {
  tableLoading.value = true;
  console.log(
    selectedCreator.value,
    limit.value,
    page.value,
    sortOrder.value,
    sortOrder.value == "asc",
  );
  // loadingData.value = true;
  if (page.value == 0) {
    page.value = 1;
  }
  const offset = limit.value * (page.value - 1);
  try {
    let stmt = supabase
      .from("bot_status")
      .select("*")
      .eq("creator", selectedCreator.value)
      .eq("status", sortStatus.value)
      .order("created_at", { ascending: sortOrder.value === "asc" })
      .limit(limit.value)
      .range(offset, offset + limit.value);
    const { data } = await stmt;
    botData.value = data as any;
    // console.log(botData.value);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    tableLoading.value = false;
  }
};


// monitor changes in a few sources
watch(
  () => [sortStatus, selectedCreator.value, limit.value, page.value],
  async (
    [newCreator, newLimit, newPage],
    [oldCreator, oldLimit, oldPage],
  ) => {
    await loadData();
  },
);

watch(sortOrder, async (newVal, oldVal) => {
  await loadData();
});

watch(sortStatus, async (newVal, oldVal) => {
  await loadData();
});


// load some data when component loads
onMounted(async () => {
  await loadData();
});
</script>
