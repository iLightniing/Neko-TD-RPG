<script setup lang="ts">
const game = useGameStore()
</script>

<template>
    <UiCard class="bg-slate-800/40 border-white/5 p-0 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
            <h3 class="font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider text-xs">
                <Icon name="lucide:activity" class="w-4 h-4 text-blue-400"/> Attributs
            </h3>
        </div>
        <UiScrollArea class="flex-1 p-4">
            <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-slate-900/40 rounded border border-white/5 hover:border-white/10 transition-colors">
                    <span class="text-slate-400 flex items-center gap-3 text-sm"><Icon name="lucide:biceps-flexed" class="w-4 h-4 text-red-400"/> Force</span>
                    <span class="font-mono font-bold text-white text-lg">{{ game.playerStrength }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-slate-900/40 rounded border border-white/5 hover:border-white/10 transition-colors">
                    <span class="text-slate-400 flex items-center gap-3 text-sm"><Icon name="lucide:heart" class="w-4 h-4 text-pink-400"/> Vitalité</span>
                    <span class="font-mono font-bold text-white text-lg">{{ game.playerVitality }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-slate-900/40 rounded border border-white/5 hover:border-white/10 transition-colors">
                    <span class="text-slate-400 flex items-center gap-3 text-sm"><Icon name="lucide:brain" class="w-4 h-4 text-blue-400"/> Intelligence</span>
                    <span class="font-mono font-bold text-white text-lg">{{ game.playerIntelligence }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-slate-900/40 rounded border border-white/5 hover:border-white/10 transition-colors">
                    <span class="text-slate-400 flex items-center gap-3 text-sm"><Icon name="lucide:wind" class="w-4 h-4 text-green-400"/> Agilité</span>
                    <span class="font-mono font-bold text-white text-lg">{{ game.playerAgility }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-slate-900/40 rounded border border-white/5 hover:border-white/10 transition-colors">
                    <span class="text-slate-400 flex items-center gap-3 text-sm"><Icon name="lucide:clover" class="w-4 h-4 text-yellow-400"/> Chance</span>
                    <span class="font-mono font-bold text-white text-lg">{{ game.playerLuck }}</span>
                </div>
            </div>
        </UiScrollArea>
    </UiCard>
</template>