<script setup lang="ts">
defineProps<{
    isElectron: boolean
}>()

const serverStatus = ref('En ligne')
const onlinePlayers = ref(1243)
</script>

<template>
    <!-- Electron: Top Bar -->
    <div v-if="isElectron" class="relative z-10 px-6 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 bg-black/40 backdrop-blur-md shrink-0">
        <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-emerald-400">{{ serverStatus }}</span>
        </div>
        <div class="flex items-center gap-1">
            <Icon name="lucide:users" class="w-3 h-3" />
            <span>{{ onlinePlayers.toLocaleString() }}</span>
        </div>
    </div>

    <!-- Web: Floating Badges (affichés via le layout parent pour le positionnement) -->
    <div v-else>
        <!-- Le contenu Web est géré directement dans le layout pour le positionnement absolu sur la sidebar -->
    </div>
</template>