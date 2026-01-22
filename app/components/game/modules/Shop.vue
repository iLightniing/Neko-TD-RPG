<script setup lang="ts">
import { UPGRADES } from '~/data/upgrades'
const game = useGameStore()
const { formatMoney } = useFormat()
</script>

<template>
    <UiScrollArea class="h-full pr-4">
        <div class="max-w-6xl mx-auto pb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button v-for="up in UPGRADES" :key="up.id" @click="game.buyUpgrade(up.id)" :disabled="game.gold < game.getUpgradeCost(up.id)" class="bg-slate-800/60 border border-white/10 p-4 rounded-md flex items-center gap-4 hover:bg-slate-700/80 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] group text-left relative overflow-hidden shadow-sm">
                    <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="size-14 bg-slate-950/50 rounded-md flex items-center justify-center shrink-0 border border-white/5 group-hover:border-amber-500/50 transition-colors">
                        <Icon :name="up.type === 'click' ? 'lucide:sword' : 'lucide:hammer'" class="w-7 h-7 text-slate-400 group-hover:text-amber-400 transition-colors"/>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-slate-200 truncate">{{ up.name }}</h4>
                        <p class="text-xs text-slate-500">Niveau {{ game.inventory[up.id] || 0 }}</p>
                        <div class="flex items-center gap-1 mt-1 text-xs font-medium text-green-400"><Icon :name="up.type === 'click' ? 'lucide:zap' : 'lucide:hourglass'" class="w-3 h-3"/>+{{ up.power }} {{ up.type === 'click' ? 'Dégâts' : 'Or/s' }}</div>
                    </div>
                    <div class="flex flex-col items-end shrink-0">
                        <div class="flex flex-col items-end text-xs font-bold font-mono">
                            <div v-if="formatMoney(game.getUpgradeCost(up.id)).g > 0" class="text-amber-400 flex items-center gap-1">{{ formatMoney(game.getUpgradeCost(up.id)).g }} <img src="~/assets/images/icones/gold.png" class="w-3 h-3 object-contain" alt="Or"/></div>
                            <div v-if="formatMoney(game.getUpgradeCost(up.id)).s > 0" class="text-slate-300 flex items-center gap-1">{{ formatMoney(game.getUpgradeCost(up.id)).s }} <img src="~/assets/images/icones/argent.png" class="w-3 h-3 object-contain" alt="Argent"/></div>
                            <div class="text-orange-400 flex items-center gap-1">{{ formatMoney(game.getUpgradeCost(up.id)).c }} <img src="~/assets/images/icones/cuivre.png" class="w-3 h-3 object-contain" alt="Cuivre"/></div>
                        </div>
                        <span class="text-[10px] text-slate-500 uppercase font-bold mt-1">Acheter</span>
                    </div>
                </button>
            </div>
        </div>
    </UiScrollArea>
</template>