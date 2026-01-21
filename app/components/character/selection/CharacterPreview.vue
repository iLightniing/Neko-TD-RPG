<script setup lang="ts">
const props = defineProps<{
    character: any
}>()

const emit = defineEmits(['play'])
const { getClassImage, getClassName, getClassBg } = useGameClasses()
</script>

<template>
    <div class="flex-1 hidden md:flex flex-col items-center justify-center relative min-w-0">
        <div v-if="character" class="w-full h-full flex flex-col items-center justify-center">
            
            <!-- Title -->
            <div class="absolute top-0 inset-x-0 text-center animate-fade-in-down">
                <h2 class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-2">Prêt au combat</h2>
                <h1 class="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl">
                    {{ character.pseudo }}
                </h1>
                <div class="flex items-center justify-center gap-3 mt-4">
                    <span class="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white">
                        {{ getClassName(character) }}
                    </span>
                    <span class="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-amber-400">
                        Niveau {{ character.level }}
                    </span>
                </div>
            </div>

            <!-- Model -->
            <div class="relative w-full h-[40vh] lg:h-[60vh] flex items-center justify-center my-8 group perspective-1000">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] transition-colors duration-700 opacity-40"
                        :class="getClassBg(character)"></div>
                
                <Transition name="scale-up">
                    <div :key="character.id || 'model'" class="absolute inset-0 flex items-center justify-center z-10">
                        <div class="h-full w-full flex items-center justify-center animate-float">
                            <img :src="getClassImage(character)" 
                                    class="h-full w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                        </div>
                    </div>
                </Transition>
            </div>

            <!-- Play Button (Floating Bottom) -->
            <div class="absolute bottom-10 z-20 animate-slide-up">
                <button @click="emit('play')" 
                        class="group relative px-12 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                    <span class="relative z-10 flex items-center gap-3">
                        Jouer <Icon name="lucide:swords" class="size-5" />
                    </span>
                </button>
            </div>

        </div>
        <div v-else class="flex flex-col items-center justify-center opacity-30">
            <Icon name="lucide:ghost" class="size-24 mb-4" />
            <p class="text-xl font-bold uppercase tracking-widest">Aucun personnage</p>
        </div>
    </div>
</template>

<style scoped>
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}
.animate-float {
    animation: float 4s ease-in-out infinite;
}

.perspective-1000 { perspective: 1000px; }

.scale-up-enter-active, .scale-up-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-up-enter-from, .scale-up-leave-to { opacity: 0; transform: scale(0.8) translateY(20px); }

.animate-fade-in-down { animation: fadeInDown 1s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }

@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
</style>