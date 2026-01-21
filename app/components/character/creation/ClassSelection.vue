<script setup lang="ts">
import BackButton from '~/components/ui/BackButton.vue'

defineProps<{
    classes: any[]
    selectedClassId: string
}>()

const emit = defineEmits(['select'])
</script>

<template>
    <div class="w-24 lg:w-64 flex flex-col gap-8 shrink-0 animate-slide-right">
        <div class="mb-4">
            <BackButton to="/character/selection" />
        </div>

        <div class="flex-1 flex flex-col justify-center gap-4">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 hidden lg:block">Classe</h3>
            <button v-for="c in classes" :key="c.id"
                @click="emit('select', c.id)"
                class="group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300 border border-transparent hover:bg-white/5"
                :class="selectedClassId === c.id ? 'bg-white/10 border-white/10' : 'opacity-60 hover:opacity-100'">
                
                <!-- Icon Box -->
                <div class="size-12 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110"
                     :class="selectedClassId === c.id ? `bg-gradient-to-br from-slate-800 to-black border border-white/20 ${c.color}` : 'bg-slate-900 border border-white/5 text-slate-400'">
                    <Icon :name="c.icon" class="size-6" />
                </div>

                <!-- Label (Desktop only) -->
                <div class="hidden lg:block text-left">
                    <div class="font-bold uppercase tracking-wider text-sm transition-colors"
                         :class="selectedClassId === c.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'">
                        {{ c.name }}
                    </div>
                </div>

                <!-- Active Indicator -->
                <div v-if="selectedClassId === c.id" 
                     class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300"
                     :class="c.bg"></div>
            </button>
        </div>
    </div>
</template>

<style scoped>
.animate-slide-right { animation: slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideRight { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
</style>