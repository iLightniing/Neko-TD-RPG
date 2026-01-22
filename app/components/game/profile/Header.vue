<script setup lang="ts">
const game = useGameStore()
const { character } = useCharacter()
const { getClassImage, getClassInfo } = useGameClasses()

const formatNumber = (num: number) => Math.floor(num).toLocaleString()

const formatMoney = (amount: number) => {
    const val = Math.floor(amount)
    const g = Math.floor(val / 10000)
    const s = Math.floor((val % 10000) / 100)
    const c = Math.floor(val % 100)
    return { g, s, c }
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'Inconnue'
    return new Date(dateString).toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })
}

const classDescription = computed(() => character.value ? getClassInfo(character.value.class)?.desc : '')
</script>

<template>
    <UiCard class="bg-slate-800/60 border-white/10 p-6 flex items-center gap-6 shrink-0 shadow-lg">
        <div class="relative shrink-0">
            <div class="size-24 bg-slate-900 rounded-full border-4 border-amber-500/30 flex items-center justify-center shadow-xl overflow-hidden group">
                <img v-if="getClassImage(character)" :src="getClassImage(character)" class="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Avatar"/>
                <Icon v-else name="lucide:user" class="w-12 h-12 text-amber-200 group-hover:scale-110 transition-transform"/>
            </div>
            <div class="absolute -bottom-1 -right-1 bg-slate-900 border border-amber-500/50 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                LVL {{ game.playerLevel }}
            </div>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h2 class="text-3xl font-black text-white uppercase tracking-widest truncate">{{ character?.pseudo || 'Héros Inconnu' }}</h2>
                    <p class="text-amber-400 font-mono text-sm flex items-center gap-2">
                        <Icon name="lucide:sword" class="w-3 h-3"/>
                        {{ character?.class || 'Aventurier' }}
                        <span class="text-slate-600 text-xs ml-2">• Né le {{ formatDate(character?.created) }}</span>
                    </p>
                    <p v-if="classDescription" class="text-slate-500 text-xs mt-2 italic max-w-md leading-relaxed border-l-2 border-white/10 pl-3">
                        "{{ classDescription }}"
                    </p>
                </div>
                <div class="text-right flex flex-col items-end gap-2">
                    <!-- Bourse (Argent) -->
                    <div class="flex items-center gap-3 bg-slate-950/50 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
                        <div v-if="formatMoney(game.gold).g > 0" class="flex items-center gap-1 text-amber-400 drop-shadow-sm">
                            <span class="font-mono font-black text-sm">{{ formatMoney(game.gold).g }}</span>
                            <img src="~/assets/images/icones/gold.png" class="w-3 h-3 object-contain" alt="Or"/>
                        </div>
                        <div v-if="formatMoney(game.gold).s > 0 || formatMoney(game.gold).g > 0" class="flex items-center gap-1 text-slate-300 drop-shadow-sm">
                            <span class="font-mono font-bold text-xs">{{ formatMoney(game.gold).s }}</span>
                            <img src="~/assets/images/icones/argent.png" class="w-3 h-3 object-contain" alt="Argent"/>
                        </div>
                        <div class="flex items-center gap-1 text-orange-400 drop-shadow-sm">
                            <span class="font-mono font-bold text-xs">{{ formatMoney(game.gold).c }}</span>
                            <img src="~/assets/images/icones/cuivre.png" class="w-3 h-3 object-contain" alt="Cuivre"/>
                        </div>
                    </div>
                    
                    <div class="hidden sm:block">
                        <div class="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Progression</div>
                        <div class="text-sm font-mono text-white">XP: {{ formatNumber(game.playerXp) }} / {{ formatNumber(game.playerMaxXp) }}</div>
                    </div>
                </div>
            </div>
            <!-- XP Bar -->
            <div class="relative h-4 bg-slate-950 rounded-full overflow-hidden border border-white/10 shadow-inner">
                <div class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/50 z-10 mix-blend-difference">
                    {{ Math.floor(game.playerXp / game.playerMaxXp * 100) }}%
                </div>
                <div class="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-500 ease-out" 
                        :style="{ width: (game.playerXp / game.playerMaxXp * 100) + '%' }"></div>
            </div>
        </div>
    </UiCard>
</template>