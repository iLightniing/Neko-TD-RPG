<script setup lang="ts">
defineProps<{
  label?: string
  value: number
  max?: number
  color?: string
  height?: string
  showValue?: boolean
}>()
</script>

<template>
  <div class="w-full group">
    <div v-if="label || showValue" class="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">
      <span v-if="label">{{ label }}</span>
      <span v-if="showValue" class="text-white">{{ value }}{{ max ? '/' + max : '' }}</span>
    </div>
    <div class="w-full bg-slate-800 rounded-full overflow-hidden" :class="height || 'h-1.5'">
      <div class="h-full rounded-full transition-all duration-1000 ease-out relative"
           :class="color || 'bg-indigo-500'"
           :style="{ width: max ? (value / max * 100) + '%' : value + '%' }">
        <div class="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
</style>