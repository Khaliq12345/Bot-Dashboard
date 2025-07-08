<template>
  <USelect
    :items="orders"
    v-model="order"
    name="Sort"
    placeholder="Sort"
    class="text-red-300"
    @update:model-value="$emit('updateOrder', order)"
  />

  <USelect
    :items="creators"
    v-model="creator"
    name="Creators"
    placeholder="Creators"
    class="text-red-300"
    @update:model-value="$emit('updateCreator', creator)"
  />

      <UInputNumber
        v-model="limit"
        orientation="vertical"
        placeholder="Limit"
        class="text-black-300"
        @update:model-value="$emit('updateLimit', limit)"
      />
      <!-- Export -->
      <UButton
        @click="$emit('exportCSV')"
        :label="'Export CSV'"
        color="neutral"
        icon="i-heroicons-arrow-down"
      />
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  orders: {
    type: Array as PropType<any[]>,
    required: true,
  },
  creators: {
    type: Array as PropType<any[]>,
    required: true,
  },
});

const emits = defineEmits(["updateOrder", "updateCreator", "updateLimit", "exportCSV"]);
const order: Ref<any> = ref(null);
const creator: Ref<any> = ref(null);
const limit: Ref<any> = ref(null);
</script>
