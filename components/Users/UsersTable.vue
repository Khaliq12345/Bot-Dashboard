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
        class="text-black-300"
      />
      <!-- Export -->
      <UButton
        @click="exportCSV(users)"
        :label="'Export CSV'"
        color="neutral"
        icon="i-heroicons-arrow-down"
      />
    </div>
    <TableModel
      :columns0="columns"
      :data0="users"
      :creators-lst="creators"
      :key="users.length"
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
  userType: { type: String, required: true },
});

// initialize variables
const users = ref<Array<any>>([]);
const dateOptions = ["asc", "desc"];
const dateOption = ref(dateOptions[0]);
const selectedCreator = ref(props.creators[0]);
const limit = ref(10);
const page = ref(1);
const tableLoading: Ref<boolean> = ref(false);
const cols: string[] = ["id", "user_id", "username", "full_name", "assigned"];
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
const loadUsers = async (userType: string) => {
  tableLoading.value = true;
  console.log(selectedCreator.value, limit.value, page.value);
  // loadingData.value = true;
  if (page.value == 0) {
    page.value = 1;
  }
  const offset = limit.value * (page.value - 1);
  try {
    let stmt = supabase
      .from("users")
      .select("*")
      .eq("creator", selectedCreator.value)
      .order("id", { ascending: dateOption.value === "asc" })
      .limit(limit.value)
      .range(offset, offset + limit.value)
    if (selectedCreator.value && userType == "unassigned") {
      stmt = stmt.eq("assigned", selectedCreator.value);
    } else if (userType == "unTreated") {
      stmt.or(`last_interaction_date.is.null`);
    }
    const { data } = await stmt;
    users.value = data as any;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    tableLoading.value = false;
  }
};

const exportCSV = (usersLst: Array<any>) => {
  const rows: string[] = [];

  rows.push(cols.join(","));

  for (const match of usersLst) {
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
  const filename = `${props.userType}_${timestamp}.csv`;

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
  () => [selectedCreator.value, limit.value, page.value],
  async ([newCreator, newLimit, newPage], [oldCreator, oldLimit, oldPage]) => {
    await loadUsers(props.userType);
  },
);

watch(dateOption, async(newVal, oldVal) =>{
  await loadUsers(props.userType);
})

// load some data when component loads
onMounted(async () => {
  await loadUsers(props.userType);
});
</script>
