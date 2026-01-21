<script setup lang="ts">
defineProps<{
    selectedClass: any
}>()
</script>

<template>
    <div class="w-72 lg:w-80 flex flex-col justify-center gap-8 shrink-0 animate-slide-left">
        
        <!-- Description Card -->
        <div class="bg-slate-900/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-1 h-full transition-colors duration-500" :class="selectedClass?.bg"></div>
            <h3 class="text-xs font-black uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                <Icon name="lucide:info" class="size-3" :class="selectedClass?.color" /> Description
            </h3>
            <p class="text-sm text-slate-400 leading-relaxed font-medium">
                {{ selectedClass?.desc }}
            </p>
        </div>

        <!-- Stats Radar/Bars -->
        <div class="space-y-5">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Statistiques</h3>
            
            <div v-for="(val, stat) in selectedClass?.stats" :key="stat" class="group">
                <div class="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">
                    <span>{{ stat }}</span>
                    <span class="text-white">{{ val }}/10</span>
                </div>
                <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000 ease-out relative"
                         :class="selectedClass?.bg"
                         :style="{ width: (val / 10 * 100) + '%' }">
                         <div class="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Evolution Path -->
        <div>
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Évolutions</h3>
            <div class="grid grid-cols-1 gap-2">
                <div v-for="evo in selectedClass?.evolution" :key="evo" 
                     class="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <div class="size-1.5 rounded-full" :class="selectedClass?.bg"></div>
                    {{ evo }}
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-slide-left { animation: slideLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideLeft { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
</style>