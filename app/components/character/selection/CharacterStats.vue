<script setup lang="ts">
import UiStatBar from '~/components/ui/UiStatBar.vue'

const props = defineProps<{
    character: any
}>()

const emit = defineEmits(['delete'])
const { getClassBg } = useGameClasses()
</script>

<template>
    <div class="w-full md:w-72 lg:w-96 hidden md:flex flex-col justify-center gap-8 shrink-0 animate-slide-left" v-if="character">
        
        <!-- Stats Card -->
        <div class="bg-slate-900/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-1 h-full transition-colors duration-500" :class="getClassBg(character)"></div>
            
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Attributs</h3>
            
            <div class="space-y-4">
                <UiStatBar label="Force" :value="character.data?.stats?.strength || 0" :max="20" color="bg-red-500" show-value />
                <UiStatBar label="Agilité" :value="character.data?.stats?.agility || 0" :max="20" color="bg-emerald-500" show-value />
                <UiStatBar label="Intel" :value="character.data?.stats?.intelligence || 0" :max="20" color="bg-blue-500" show-value />
                <UiStatBar label="Défense" :value="character.data?.stats?.defense || 0" :max="20" color="bg-yellow-500" show-value />
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
</style>