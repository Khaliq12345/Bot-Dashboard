<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui'
  import {resolveComponent } from 'vue'
  const UButton = resolveComponent('UButton')
  const UBadge = resolveComponent('UBadge')
  // Page Loading
  const loadingData = ref(false);
  // Show or Hide the Sidebar
  const isMobileSidebarOpen = ref(false);
  // Menu
  const menuLst = ref([
    {id: 1, name: 'Scraper', icon: "i-lucide-settings"}, 
    // {id: 2, name: 'Any 2', icon: "i-lucide-book"}, 
    // {id: 3, name: 'Malopp', icon: "i-lucide-book"}, 
  ]);
  const activeMenu = ref(
    {id: 1, name: 'Scraper', icon: "i-lucide-book"}, 
  );
  const handleMenuItemClick = async (item: any) => {
      activeMenu.value = item;
  };
  // Supabase 
  const {supabase} = useSupabaseSub()
  // Functions
  async function loadUnAssignedUsers() {
    loadingData.value = true;
    try {
      let { data, error } = await supabase
      .from('users')
      .select("*")
      .is('assigned', null)
      unassignedUsers.value = data ?? [];
    } catch (err) {
        console.error('Error:', err);
    } finally {
        loadingData.value = false;
    }
  }
  async function loadUnTreatedUsers() {
    loadingData.value = true;
    try {
      const now = new Date().toISOString();
      let { data, error } = await supabase
        .from('users')
        .select("*")
        .is('last_interaction_date', null)
        .or(`last_interaction_date.is.null,last_interaction_date.gt.${now}`)
        untreatedUsers.value = data ?? [];
    } catch (err) {
        console.error('Error:', err);
    } finally {
        loadingData.value = false;
    }
  }
  async function loadAllUsers() {
    loadingData.value = true;
    try {
      const now = new Date().toISOString();
      let { data, error } = await supabase
        .from('users')
        .select("*")
        allUsers.value = data ?? [];
    } catch (err) {
        console.error('Error:', err);
    } finally {
        loadingData.value = false;
    }
  }
  const creatorsLst = ref<any>([]);
  async function loadCreators() {
    try {
      let { data, error } = await supabase
      .from('creators')
      .select("*")
      creatorsLst.value = data?.map(d=> d.creator) ?? [];
      console.log(creatorsLst.value)
    } catch (err) {
        console.error('Error:', err);
    } finally {
    }
  }
  // Data Var
  const unassignedUsers = ref<any[]>([])
  const untreatedUsers = ref<any[]>([])
  const allUsers = ref<any[]>([])
  const columns: TableColumn<any>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`,
    meta: {
      class: {
        th: "text-gray-900",
        td: "text-gray-800",
      }
    }
  }, 
  {
    accessorKey: 'user_id',
    header: 'User ID',
    cell: ({ row }) => `${row.getValue('user_id')}`,
    meta: {
      class: {
        th: "text-gray-900",
        td: "text-gray-800",
      }
    }
  }, 
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => `${row.getValue('username')}`,
    meta: {
      class: {
        th: "text-gray-900",
        td: "text-gray-800",
      }
    }
  }, 
  {
    accessorKey: 'full_name',
    header: 'Full Name',
    cell: ({ row }) => `${row.getValue('full_name')}`,
    meta: {
      class: {
        th: "text-gray-900",
        td: "text-gray-800",
      }
    }
  },
  {
    accessorKey: 'assigned',
    header: 'Assigned',
    cell: ({ row }) => {
    return h(UBadge, { class: 'capitalize', variant: 'subtle', color : row.getValue('assigned') ? 'success' : 'error'}, () => row.getValue('assigned') ? row.getValue('assigned') : 'None')
  },
    meta: {
      class: {
        th: "text-gray-900",
        td: "text-gray-800",
      }
    }
  }, 
  ]
  onMounted(async () => {
    await loadAllUsers();
    await loadUnAssignedUsers();
    await loadUnTreatedUsers();
    await loadCreators();
  })
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <div class="hidden md:block md:w-4/12 lg:w-3/12">
      <DashboardSidebar :menuLst="menuLst" :activeMenu="activeMenu" @menu-item-clicked="handleMenuItemClick" />
    </div>
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden w-full ">
      <!-- Header -->
      <header class="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between md:justify-end">
          <!-- Mobile Menu Button -->
          <UButton @click="isMobileSidebarOpen = true" :disabled="isMobileSidebarOpen"
            class="bg-gray-100 hover:bg-gray-300 md:hidden cursor-pointer">
            <UIcon name="i-heroicons-bars-3-bottom-left-20-solid" class="mr-3 text-xl" />
            <h3 class="ml-3 text-lg font-semibold text-center">Dashboard</h3>
          </UButton>
        </div>
      </header>
      <!-- Main Content -->
      <main class="flex-1 text-center overflow-y-auto p-4 sm:p-6 lg:p-8">
        <!-- Welcome -->
        <div class="flex justify-center">
            <div class="flex flex-col ml-4">
              <span class="mr-4 text-2xl mb-10">
                Welcome, <span class="font-bold text-primary-800"> Here </span> !
              </span>
            </div>
        </div>
        <!-- Page Content -->
        <!-- Loading -->
        <div v-if="loadingData" class="place-items-center place-content-center my-15">
          <Loading />
          <div class="container mx-auto p-4 text-center mt-6">
            <p>Loading Data ...</p>
          </div>
        </div>
        <!-- When Loaded -->
        <div v-else>
          <div v-if="activeMenu.id == 1">
          <!-- Unassigned Card  -->
           <UCard variant="soft" class="bg-red-100">
              <template #header>
                <span class="font-bold text-xl"> Unassigned Users </span>
              </template>
              <DashboardTableModel :data0="unassignedUsers" :columns0="columns" :creatorsLst="creatorsLst" />
            </UCard>
            <!-- Not Treated Card  -->
           <UCard variant="soft" class="bg-secondary-100 mt-10">
              <template #header>
                <span class="font-bold"> Not Treated Users </span>
              </template>
              <DashboardTableModel :data0="untreatedUsers" :columns0="columns" :creatorsLst="creatorsLst"/>
            </UCard>
            <!-- All Users Card With Creator Filter  -->
           <UCard variant="soft" class="bg-primary-100 mt-10">
              <template #header>
                <span class="font-bold"> All Users </span>
              </template>
              <DashboardTableModel :data0="allUsers" :columns0="columns" :creatorsLst="creatorsLst"/>
            </UCard>
          </div>
          <div v-else-if="activeMenu.id == 2">
            <span>menu 2 perso</span>
          </div>
          <div v-else>
            <span>menu ... {{ activeMenu }}</span>
          </div>
        </div>
      </main>
    </div>
    <!-- Mobile Drawer Sidebar -->
    <UDrawer direction="left" v-model:open="isMobileSidebarOpen" class="w-10/12 sm:w-6/12">
      <template #title>
      </template>
      <template #description>
      </template>
      <template #body>
        <DashboardSidebar :menuLst="menuLst" :activeMenu="activeMenu" @menu-item-clicked="handleMenuItemClick"
          @close-sidebar="isMobileSidebarOpen = false" />
      </template>
    </UDrawer>
  </div>
</template>
