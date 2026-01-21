<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="relative group flex flex-col items-center">
    <!-- L'élément déclencheur (slot) -->
    <slot />
    
    <!-- Le Tooltip -->
    <div class="absolute bottom-full mb-2 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-md text-xs text-white font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl translate-y-2 group-hover:translate-y-0">
      {{ text }}
      <!-- Petite flèche vers le bas -->
      <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
    </div>
  </div>
</template>