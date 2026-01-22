<script setup lang="ts">
defineProps<{
  title: string
}>()

const game = useGameStore()
const { formatMoney } = useFormat()
</script>

<template>
    <header class="h-12 shrink-0 flex items-center justify-between px-4 bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-20">
        <!-- Title (Left) -->
        <div class="flex items-center gap-3">
            <h1 class="text-xs font-bold text-slate-200 uppercase tracking-widest">{{ title }}</h1>
        </div>

        <!-- Stats (Right) -->
        <div class="flex items-center gap-4">
            <!-- Gold Pouch -->
            <div class="flex items-center gap-3 bg-slate-950/30 px-3 py-1 rounded-full border border-white/5 transition-colors hover:bg-slate-950/50">
                <div v-if="formatMoney(game.gold).g > 0" class="flex items-center gap-1.5 text-amber-400">
                    <span class="font-mono font-bold text-xs">{{ formatMoney(game.gold).g }}</span>
                    <img src="~/assets/images/icones/gold.png" class="w-3 h-3 object-contain" alt="Or"/>
                </div>
                <div v-if="formatMoney(game.gold).s > 0 || formatMoney(game.gold).g > 0" class="flex items-center gap-1.5 text-slate-300">
                    <span class="font-mono font-bold text-xs">{{ formatMoney(game.gold).s }}</span>
                    <img src="~/assets/images/icones/argent.png" class="w-3 h-3 object-contain" alt="Argent"/>
                </div>
                <div class="flex items-center gap-1.5 text-orange-400">
                    <span class="font-mono font-bold text-xs">{{ formatMoney(game.gold).c }}</span>
                    <img src="~/assets/images/icones/cuivre.png" class="w-3 h-3 object-contain" alt="Cuivre"/>
                </div>
            </div>

            <!-- Click Damage -->
            <div class="flex items-center gap-2 text-slate-500" title="Puissance de combat">
                <span class="font-mono font-bold text-slate-300 text-xs">{{ Math.floor(game.currentGoldPerClick * 10 + game.currentGoldPerSecond * 5).toLocaleString() }}</span>
                <Icon name="lucide:sword" class="w-4 h-4"/>
            </div>
        </div>
    </header>
</template>