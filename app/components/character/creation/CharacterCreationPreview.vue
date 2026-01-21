<script setup lang="ts">
const props = defineProps<{
    selectedClass: any
    pseudo: string
    isLoading: boolean
}>()

const emit = defineEmits(['update:pseudo', 'create'])
const { getClassImage } = useGameClasses()
</script>

<template>
    <div class="flex-1 flex flex-col items-center justify-center relative min-w-0">
        
        <!-- Character Title -->
        <div class="absolute top-0 inset-x-0 text-center animate-fade-in-down">
            <h2 class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-2">Nouvelle Recrue</h2>
            <h1 class="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl"
                :class="`text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400`">
                {{ selectedClass?.name }}
            </h1>
        </div>

        <!-- Character Model -->
        <div class="relative w-full h-[60vh] flex items-center justify-center my-8 group perspective-1000">
            <!-- Glow Effect behind character -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] transition-colors duration-700 opacity-40"
                 :class="selectedClass?.bg"></div>
            
            <Transition name="scale-up">
                <div :key="selectedClass?.id" class="absolute inset-0 flex items-center justify-center z-10">
                    <div class="h-full w-full flex items-center justify-center animate-float">
                        <img :src="getClassImage(selectedClass)" 
                             class="h-full w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                    </div>
                </div>
            </Transition>
        </div>

        <!-- Pseudo Input Form -->
        <div class="w-full max-w-md relative z-20 animate-slide-up">
            <form @submit.prevent="emit('create')" class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                <input :value="pseudo" @input="emit('update:pseudo', ($event.target as HTMLInputElement).value)" type="text" placeholder="Entrez votre pseudo..." required maxlength="20"
                       class="w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl py-5 px-8 text-center text-2xl font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all shadow-2xl uppercase tracking-widest" />
                
                <button type="submit" :disabled="isLoading || !pseudo"
                        class="absolute right-2 top-2 bottom-2 aspect-square bg-white text-black rounded-lg flex items-center justify-center hover:bg-indigo-50 disabled:opacity-0 disabled:scale-75 transition-all duration-300 shadow-lg">
                    <Icon v-if="isLoading" name="lucide:loader-2" class="animate-spin size-6" />
                    <Icon v-else name="lucide:arrow-right" class="size-6" />
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
.animate-float { animation: float 6s ease-in-out infinite; }
.scale-up-enter-active, .scale-up-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-up-enter-from, .scale-up-leave-to { opacity: 0; transform: scale(0.8) translateY(20px); }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
.animate-fade-in-down { animation: fadeInDown 1s ease-out forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
.perspective-1000 { perspective: 1000px; }
</style>