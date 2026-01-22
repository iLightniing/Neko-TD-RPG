<script setup lang="ts">
const props = defineProps<{
    character: any
}>()

const emit = defineEmits(['delete'])
const { getClassBg } = useGameClasses()

const statConfig = [
    { key: 'strength', label: 'Force', color: 'bg-red-500' },
    { key: 'agility', label: 'Agilité', color: 'bg-emerald-500' },
    { key: 'intelligence', label: 'Intel', color: 'bg-blue-500' },
    { key: 'vitality', label: 'Vitalité', color: 'bg-pink-500' },
    { key: 'luck', label: 'Chance', color: 'bg-purple-500' },
    { key: 'defense', label: 'Défense', color: 'bg-yellow-500' },
]
</script>

<template>
    <div class="w-full md:w-72 lg:w-96 hidden md:flex flex-col justify-center gap-8 shrink-0 animate-slide-left" v-if="character">
        
        <!-- Stats Card -->
        <div class="bg-slate-900/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-1 h-full transition-colors duration-500" :class="getClassBg(character)"></div>
            
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Attributs</h3>
            
            <div class="space-y-4">
                <div v-for="stat in statConfig" :key="stat.key" class="space-y-1">
                    <div class="flex justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        <span>{{ stat.label }}</span>
                        <span class="text-white">{{ character.stats?.[stat.key] || 0 }}</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-1000 ease-out relative"
                             :class="stat.color"
                             :style="{ width: Math.min(100, ((character.stats?.[stat.key] || 0) / 20 * 100)) + '%' }">
                             <div class="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Action -->
        <div class="flex justify-end">
            <button @click="emit('delete')" class="text-red-400/60 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors hover:bg-red-500/10 px-4 py-2 rounded-lg">
                <Icon name="lucide:trash-2" class="size-4" /> Supprimer ce personnage
            </button>
        </div>

    </div>
    <div v-else class="w-full md:w-72 lg:w-96 hidden md:block"></div> <!-- Spacer -->
</template>

<style scoped>
.animate-slide-left { animation: slideLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideLeft { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
.animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
</style>