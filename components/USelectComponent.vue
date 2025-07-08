<template>
  <USelect
    :items="items"
    v-model="value"
    :name="name"
    :placeholder="placeholder"
    class="text-red-300"
    @update:model-value="$emit('updateOrder', value)"
  />
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  items: {
    type: Array as PropType<any[]>,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["updateOrder"]);
const value: Ref<any> = ref(null);
</script>
