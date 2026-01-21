<script setup lang="ts">
defineProps<{
  to?: string
}>()
</script>

<template>
  <button @click="to ? navigateTo(to) : $router.back()" class="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group shadow-lg backdrop-blur-sm" type="button">
    <Icon name="lucide:arrow-left" class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
    <span class="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Retour</span>
  </button>
</template>