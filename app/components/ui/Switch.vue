<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
    <label class="flex items-center justify-between p-3 bg-slate-800/50 rounded-md border border-white/5 cursor-pointer hover:bg-slate-800 transition-colors group select-none">
        <span v-if="label" class="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">{{ label }}</span>
        <div class="relative flex items-center">
            <input 
                type="checkbox" 
                :checked="modelValue"
                @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
                class="peer sr-only"
            >
            <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
        </div>
    </label>
</template>