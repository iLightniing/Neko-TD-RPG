<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="flex items-center gap-2 cursor-pointer group select-none">
    <div class="relative flex items-center justify-center">
      <input 
        type="checkbox" 
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        class="peer appearance-none w-4 h-4 border border-white/10 rounded bg-slate-950/50 checked:bg-indigo-600 checked:border-indigo-500 transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <Icon name="lucide:check" class="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
    </div>
    <span v-if="label" class="text-xs text-slate-400 group-hover:text-slate-300 transition-colors font-bold">{{ label }}</span>
  </label>
</template>