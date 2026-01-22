<script setup lang="ts">
const game = useGameStore()
const formatNumber = (num: number) => Math.floor(num).toLocaleString()
</script>

<template>
    <UiCard class="bg-slate-800/40 border-white/5 p-0 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
            <h3 class="font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider text-xs">
                <Icon name="lucide:swords" class="w-4 h-4 text-red-400"/> Combat
            </h3>
        </div>
        <UiScrollArea class="flex-1 p-4">
            <div class="space-y-4">
                <div class="space-y-1">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-slate-400">Dégâts / Clic</span>
                        <span class="font-mono font-bold text-amber-400">{{ formatNumber(game.currentGoldPerClick) }}</span>
                    </div>
                    <div class="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-500 w-3/4"></div>
                    </div>
                </div>

                <div class="space-y-1">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-slate-400">Dégâts / Seconde</span>
                        <span class="font-mono font-bold text-orange-400">{{ formatNumber(game.currentGoldPerSecond) }}</span>
                    </div>
                    <div class="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div class="h-full bg-orange-500 w-1/2"></div>
                    </div>
                </div>

                <div class="w-full h-px bg-white/5 my-2"></div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-900/30 p-3 rounded border border-white/5 text-center">
                        <div class="text-xs text-slate-500 uppercase font-bold mb-1">Santé</div>
                        <div class="text-green-400 font-mono font-bold">{{ formatNumber(game.playerHealth) }} / {{ formatNumber(game.playerMaxHealth) }}</div>
                    </div>
                    <div class="bg-slate-900/30 p-3 rounded border border-white/5 text-center">
                        <div class="text-xs text-slate-500 uppercase font-bold mb-1">Mana</div>
                        <div class="text-blue-400 font-mono font-bold">{{ formatNumber(game.playerMana) }} / {{ formatNumber(game.playerMaxMana) }}</div>
                    </div>
                    <div class="bg-slate-900/30 p-3 rounded border border-white/5 text-center">
                        <div class="text-xs text-slate-500 uppercase font-bold mb-1">Défense</div>
                        <div class="text-slate-300 font-mono font-bold">{{ formatNumber(game.playerDefense) }}</div>
                    </div>
                    <div class="bg-slate-900/30 p-3 rounded border border-white/5 text-center">
                        <div class="text-xs text-slate-500 uppercase font-bold mb-1">Monstres Tués</div>
                        <div class="text-white font-mono font-bold">{{ game.level - 1 }}</div>
                    </div>
                    
                    <!-- Statistiques Dérivées (Calculées pour l'affichage "Pro") -->
                    <div class="bg-slate-900/30 p-3 rounded border border-white/5 text-center">
                        <div class="text-xs text-slate-500 uppercase font-bold mb-1">Critique</div>
                        <div class="text-yellow-400 font-mono font-bold">{{ game.playerLuck }}%</div>
                    </div>
                    <div class="bg-slate-900/30 p-3 rounded border border-white/5 text-center">
                        <div class="text-xs text-slate-500 uppercase font-bold mb-1">Esquive</div>
                        <div class="text-white font-mono font-bold">{{ (game.playerAgility * 0.1).toFixed(1) }}%</div>
                    </div>
                    <div class="bg-slate-900/30 p-3 rounded border border-white/5 text-center">
                        <div class="text-xs text-slate-500 uppercase font-bold mb-1">Régén. PV</div>
                        <div class="text-green-400 font-mono font-bold">{{ (game.playerVitality * 0.2).toFixed(1) }}/s</div>
                    </div>
                    <div class="bg-slate-900/30 p-3 rounded border border-white/5 text-center">
                        <div class="text-xs text-slate-500 uppercase font-bold mb-1">Régén. Mana</div>
                        <div class="text-blue-400 font-mono font-bold">{{ (game.playerIntelligence * 0.2).toFixed(1) }}/s</div>
                    </div>
                </div>
            </div>
        </UiScrollArea>
    </UiCard>
</template>