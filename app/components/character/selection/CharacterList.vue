<script setup lang="ts">
const props = defineProps<{
    characters: any[]
    selectedId: string | null
}>()

const emit = defineEmits(['select', 'create', 'delete', 'play', 'logout'])
const { getClassImage, getClassBg } = useGameClasses()
</script>

<template>
    <div class="w-full md:w-64 lg:w-72 flex flex-col gap-6 shrink-0 animate-slide-right h-full">
        <div class="flex items-center justify-between mb-2">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Vos Héros</h3>
            <span class="text-[10px] font-mono text-slate-500">{{ characters.length }}/5</span>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            <div v-for="char in characters" :key="char.id"
                @click="emit('select', char.id)"
                class="w-full group relative flex flex-col p-3 rounded-xl transition-all duration-300 border border-transparent hover:bg-white/5 cursor-pointer"
                :class="selectedId === char.id ? 'bg-white/10 border-white/10' : 'opacity-60 hover:opacity-100'">
                
                <div class="flex items-center gap-4 w-full">
                    <!-- Avatar Box -->
                    <div class="size-12 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                        <img v-if="getClassImage(char)" :src="getClassImage(char)" class="w-full h-full object-cover" />
                        <Icon v-else name="lucide:user" class="size-6 text-slate-400" />
                    </div>

                    <!-- Info -->
                    <div class="flex-1 text-left min-w-0">
                        <div class="font-bold text-sm text-white truncate">{{ char.pseudo }}</div>
                        <div class="text-[10px] uppercase tracking-wider text-slate-400">Niveau {{ char.level }}</div>
                    </div>
                </div>

                <!-- Mobile Actions -->
                <div v-if="selectedId === char.id" class="flex gap-2 mt-3 md:hidden animate-slide-up">
                    <button @click.stop="emit('play')" class="flex-1 py-2 bg-white text-black rounded-lg font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-colors">
                        Jouer
                    </button>
                    <button @click.stop="emit('delete')" class="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/10">
                        <Icon name="lucide:trash-2" class="size-4" />
                    </button>
                </div>

                <!-- Active Indicator -->
                <div v-if="selectedId === char.id" 
                        class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300"
                        :class="getClassBg(char)"></div>
            </div>

            <!-- Create New Button -->
            <button v-if="characters.length < 5" @click="emit('create')" 
                    class="w-full p-3 rounded-xl border border-dashed border-white/10 flex items-center justify-center gap-3 text-slate-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all group">
                <Icon name="lucide:plus" class="size-5 group-hover:scale-110 transition-transform" />
                <span class="text-xs font-bold uppercase tracking-wider">Nouveau</span>
            </button>
        </div>

        <!-- Logout (Bottom Left) -->
        <div class="flex justify-center pt-2">
            <button @click="emit('logout')" class="text-slate-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors hover:bg-red-500/10 px-4 py-2 rounded-lg">
                <Icon name="lucide:log-out" class="size-4" /> Se déconnecter
            </button>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }

.animate-slide-right { animation: slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }

@keyframes slideRight { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>