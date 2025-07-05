<script setup lang="ts">
import { upperFirst } from 'scule'

const props = defineProps({
  data0: {
    type: Object,
  },
  columns0: {
    type: Object,
  },
  creatorsLst: {
    type: Array<any>,
  },
});
const data1 : Array<any> = props.data0 ? props.data0 as any : [];
  const data = computed(() => 
  data1.filter(d=>{
  return selectedCreatorsLst.value.length !=0 ? selectedCreatorsLst.value.some(o => o.toLowerCase().includes(d.assigned.toLowerCase())) : true
}))
const columns : any = props.columns0 ? props.columns0 : [];
const table = useTemplateRef('table')
const selectedCreatorsLst = ref<any[]>([])
</script>
<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
      <!-- Creators -->
       <UFormField>
          <USelect v-model="selectedCreatorsLst"  class="text-black" :items="creatorsLst" multiple
            clearable :placeholder="creatorsLst?.length ? 'Creators' : 'No Available Creators'">
          </USelect>
        </UFormField>
       <!-- Columns -->
      <UDropdownMenu
        :items="table?.tableApi?.getAllColumns().filter(column => column.getCanHide()).map(column => ({
          label: upperFirst(column.id),
          type: 'checkbox' as const,
          checked: column.getIsVisible(),
          onUpdateChecked(checked: boolean) {
            table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
          },
          onSelect(e?: Event) {
            e?.preventDefault()
          }
        }))"
        :content="{ align: 'end' }"
      >
        <UButton
          label="Columns to Show"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
          class=""
          aria-label="Columns select dropdown"
        />
      </UDropdownMenu>
    </div>
    <UTable
      ref="table"
      :data="data"
      :columns="columns"
      sticky
      class="h-96"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
    <div class="text-end mt-3 text-semibold">
      Total of {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
    </div>
    <!-- <div class="px-4 py-3.5 text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
    </div> -->
  </div>
</template>