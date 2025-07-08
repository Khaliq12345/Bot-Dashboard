<template>
  <div class="w-full">
    <div
      class="flex flex-row justify-center md:justify-between w-full gap-4 mb-5"
    >
      <USelect
        :items="dateOptions"
        v-model="dateOption"
        class="text-black-300"
        name="Sort"
        placeholder="Sort"
      />
      <USelect
        :items="creators"
        v-model="selectedCreator"
        class="text-black-300"
        placeholder="Creators"
      />
      <UInputNumber
        v-model="limit"
        orientation="vertical"
        placeholder="Limit"
        class="text-red-300 w-24"
      />
      <!-- Export -->
      <UButton
        @click="exportCSV(botData)"
        :label="'Export CSV'"
        color="neutral"
        icon="i-heroicons-arrow-down"
      />
    </div>
    <TableModel
      :columns0="columns"
      :data0="botData"
      :creators-lst="creators"
      :key="`${botData.length}_${selectedCreator}_${dateOption}`"
    />
    <UButtonGroup class="mt-5">
      <UButton
        color="neutral"
        variant="outline"
        label="Prev"
        @click="page > 0 ? page-- : {}"
      />
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
const dateOptions = ["asc", "desc"];
const dateOption = ref(dateOptions[0]);
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
    dateOption.value,
    dateOption.value == "asc",
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
      .order("created_at", { ascending: dateOption.value === "asc" })
      .limit(limit.value)
      .range(offset, offset + limit.value);
    const { data } = await stmt;
    botData.value = data as any;
    console.log(botData.value);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    tableLoading.value = false;
  }
};

const exportCSV = (botsLst: Array<any>) => {
  const rows: string[] = [];

  rows.push(cols.join(","));

  for (const match of botsLst) {
    const row = cols.map((key: string) => {
      const value = match?.[key];
      if (typeof value === "string") {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? "";
    });
    rows.push(row.join(","));
  }

  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `bots_status_${timestamp}.csv`;

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// monitor changes in a few sources
watch(
  () => [dateOption, selectedCreator.value, limit.value, page.value],
  async (
    [newDate, newCreator, newLimit, newPage],
    [oldDate, oldCreator, oldLimit, oldPage],
  ) => {
    await loadData();
  },
);

watch(dateOption, async (newVal, oldVal) => {
  await loadData();
});

// load some data when component loads
onMounted(async () => {
  await loadData();
});
</script>
