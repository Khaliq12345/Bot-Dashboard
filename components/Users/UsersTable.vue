<template>
  <div class="w-full">
    <div
      class="flex flex-row justify-center md:justify-between w-full gap-4 mb-5"
    >
    <TableFilters :creators="creators" :orders="sortOrders" @update-creator="(value) => (selectedCreator = value)"
    @update-limit="(value) => (limit = value)"
    @update-order="(value) => (sortOrder = value)" @export-c-s-v="useexportCSV(users, cols, `${props.userType}`)" />
    
    </div>
    <TableModel
      :columns0="columns"
      :data0="users"
      :creators-lst="creators"
      :key="`${users.length}_${selectedCreator}_${sortOrder}`"
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
const sortOrders = ["asc", "desc"];
const sortOrder = ref(sortOrders[0]);
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
      .eq("assigned", selectedCreator.value)
      .order("id", { ascending: sortOrder.value === "asc" })
      .limit(limit.value)
      .range(offset, offset + limit.value);
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

// monitor changes in a few sources
watch(
  () => [selectedCreator.value, limit.value, page.value],
  async ([newCreator, newLimit, newPage], [oldCreator, oldLimit, oldPage]) => {
    await loadUsers(props.userType);
  },
);

watch(sortOrder, async (newVal, oldVal) => {
  await loadUsers(props.userType);
});

// load some data when component loads
onMounted(async () => {
  await loadUsers(props.userType);
});
</script>
