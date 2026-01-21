<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  block?: boolean
}>(), {
  variant: 'secondary',
  block: false
})
</script>

<template>
  <button 
    class="px-4 py-3 rounded-md font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
    :class="[
      variant === 'primary' ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20' :
      variant === 'danger' ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20' :
      variant === 'ghost' ? 'bg-transparent hover:bg-white/10 text-slate-400 hover:text-white' :
      'bg-slate-800 hover:bg-slate-700 text-white border border-white/5', // secondary (défaut)
      block ? 'w-full' : ''
    ]"
  >
    <slot />
  </button>
</template>