<template>
  <USelect
    :items="items"
    :v-model="modelValue"
    :name="name"
    :placeholder="placeholder"
    class="text-black-300"
  />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  items: {
    type: Array as PropType<any[]>,
    required: true,
  },
  modelValue: {
    type: [String, Number, Object],
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:modelValue'])
</script>
