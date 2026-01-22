<!-- app/components/game/modules/Dungeon.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const game = useGameStore()
const showDefeatModal = ref(false)
const logContainer = ref<HTMLElement | null>(null)

// Auto-scroll vers le bas quand le log change
watch(() => game.combatLog.length, async () => {
    await nextTick()
    if (logContainer.value) {
        logContainer.value.scrollTop = 0 // Car on utilise flex-col-reverse pour afficher le dernier en haut
    }
})

// Surveiller la mort
watch(() => game.isDead, (dead) => {
    if (dead) showDefeatModal.value = true
})

const handleDefeatClose = () => {
    showDefeatModal.value = false
    game.reviveAndReset()
    emit('navigate', 'home')
}
</script>

<template>
    <div class="h-full flex flex-col gap-4 max-w-4xl mx-auto">
        
        <!-- En-tête de zone -->
        <div class="flex items-center justify-between bg-slate-900/80 border border-white/10 p-4 rounded-lg">
            <div>
                <h2 class="text-xl font-bold text-amber-500 font-serif">Forêt Sombre</h2>
                <p class="text-xs text-slate-400">Zone de niveau {{ game.level }}</p>
            </div>
            <div class="text-right">
                <div class="text-xs uppercase tracking-widest text-slate-500">État</div>
                <div class="font-bold" :class="game.gameState === 'COMBAT' ? 'text-red-400 animate-pulse' : 'text-emerald-400'">
                    {{ game.gameState === 'COMBAT' ? 'EN COMBAT' : 'EXPLORATION' }}
                </div>
            </div>
        </div>

        <!-- Zone de texte principale (Le "Jeu") -->
        <div class="flex-1 bg-black/40 border border-white/10 rounded-lg p-6 overflow-hidden relative font-mono text-sm shadow-inner">
            <!-- Overlay de scanlines pour l'effet rétro (optionnel) -->
            <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>

            <div ref="logContainer" class="h-full overflow-y-auto flex flex-col pr-2 space-y-2">
                <!-- On affiche le log complet -->
                <div v-for="(log, i) in game.combatLog" :key="i" class="border-l-2 pl-3 py-1 animate-fade-in"
                    :class="[
                        log.includes('attaque') ? 'border-blue-500/50 text-blue-200' : 
                        log.includes('riposte') ? 'border-red-500/50 text-red-200' : 
                        log.includes('Victoire') ? 'border-amber-500 text-amber-400 font-bold bg-amber-500/5' :
                        log.includes('surgit') ? 'border-purple-500 text-purple-300 mt-4' :
                        'border-slate-700 text-slate-300'
                    ]">
                    <span class="text-xs opacity-40 mr-2 select-none">{{ log.split(']')[0] + ']' }}</span>
                    <span>{{ log.split(']')[1] }}</span>
                </div>
                
                <div v-if="game.combatLog.length === 0" class="text-center text-slate-500 italic mt-10">
                    Le journal est vide. Commencez à explorer...
                </div>
            </div>
        </div>

        <!-- Barre d'actions (Commandes) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-24 shrink-0">
            
            <!-- Actions de Combat -->
            <div v-if="game.gameState === 'COMBAT'" class="contents">
                <button @click="game.attack()" class="bg-red-900/20 border border-red-500/50 hover:bg-red-500/20 text-red-400 rounded-lg flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group">
                    <Icon name="lucide:sword" class="w-6 h-6 group-hover:scale-110 transition-transform"/>
                    <span class="font-bold uppercase tracking-wider">Attaquer</span>
                    <span class="text-xs opacity-60">{{ game.currentGoldPerClick }} Dégâts</span>
                </button>
                
                <button class="bg-slate-800/40 border border-white/10 hover:bg-slate-700/40 text-slate-400 rounded-lg flex flex-col items-center justify-center gap-1 transition-all active:scale-95">
                    <Icon name="lucide:shield" class="w-5 h-5"/>
                    <span class="font-bold uppercase tracking-wider">Défendre</span>
                </button>
            </div>

            <!-- Actions d'Exploration -->
            <div v-else class="contents">
                <button @click="game.explore()" class="col-span-2 bg-emerald-900/20 border border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-400 rounded-lg flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group">
                    <Icon name="lucide:footprints" class="w-6 h-6 group-hover:scale-110 transition-transform"/>
                    <span class="font-bold uppercase tracking-wider">Explorer</span>
                    <span class="text-xs opacity-60">Trouver un ennemi</span>
                </button>
            </div>
        </div>

        <!-- Modale de Défaite -->
        <UiModal :show="showDefeatModal" title="DÉFAITE" @close="handleDefeatClose">
            <div class="text-center space-y-6 py-4">
                <div class="text-6xl animate-bounce">💀</div>
                <div>
                    <h3 class="text-2xl font-black text-red-500 uppercase mb-2">Vous avez succombé !</h3>
                    <p class="text-slate-300">Vos blessures sont trop graves pour continuer.<br>Retournez à la taverne pour vous reposer.</p>
                </div>
                <div class="pt-4">
                    <UiButton @click="handleDefeatClose" variant="danger" class="w-full py-3 font-bold uppercase tracking-widest">Retourner à la Taverne</UiButton>
                </div>
            </div>
        </UiModal>
    </div>
</template>

<style scoped>
/* Petite animation pour l'apparition des lignes de texte */
@keyframes fade-in {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
}
.animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
}
</style>