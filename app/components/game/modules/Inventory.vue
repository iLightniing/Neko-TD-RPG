<script setup lang="ts">
const game = useGameStore()
const { character } = useCharacter()
const { getClassImage } = useGameClasses()
</script>

<template>
    <div class="h-full flex flex-col lg:flex-row gap-6">
        <UiCard class="flex flex-col items-center gap-6 shrink-0 max-h-full !p-0 overflow-hidden">
            <UiScrollArea class="p-6 h-full w-full flex flex-col items-center gap-6">
                <div class="flex gap-8 items-center justify-center w-full">
                    <div class="flex flex-col gap-3">
                        <UiTooltip text="Tête"><div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group"><Icon name="lucide:crown" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/></div></UiTooltip>
                        <UiTooltip text="Torse"><div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group"><Icon name="lucide:shirt" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/></div></UiTooltip>
                        <UiTooltip text="Jambes"><div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group"><Icon name="lucide:columns-2" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/></div></UiTooltip>
                        <UiTooltip text="Pieds"><div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group"><Icon name="lucide:footprints" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/></div></UiTooltip>
                    </div>
                    <div class="w-48 h-72 bg-slate-950/60 border border-white/10 rounded-md flex items-center justify-center relative overflow-hidden shadow-inner group">
                        <div class="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
                        <img v-if="getClassImage(character)" :src="getClassImage(character)" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Avatar"/>
                        <Icon v-else name="lucide:user" class="w-32 h-32 text-slate-800"/>
                    </div>
                    <div class="flex flex-col gap-3">
                        <UiTooltip text="Arme"><div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group"><Icon name="lucide:sword" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/></div></UiTooltip>
                        <UiTooltip text="Bouclier"><div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group"><Icon name="lucide:shield" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/></div></UiTooltip>
                        <UiTooltip text="Amulette"><div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group"><Icon name="lucide:gem" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/></div></UiTooltip>
                        <UiTooltip text="Anneau"><div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group"><Icon name="lucide:circle" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/></div></UiTooltip>
                    </div>
                </div>
                <div class="w-full bg-slate-950/20 rounded-md p-4 border border-white/5">
                    <h4 class="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Icon name="lucide:bar-chart-2" class="w-3 h-3"/> Statistiques</h4>
                    <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Niveau</span><span class="font-mono text-white font-bold">{{ game.playerLevel }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">XP Actuel</span><span class="font-mono text-purple-400 font-bold">{{ Math.floor(game.playerXp) }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Force</span><span class="font-mono text-red-400 font-bold">{{ game.playerStrength }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Attaque</span><span class="font-mono text-red-400 font-bold">{{ game.currentGoldPerClick }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Vitalité</span><span class="font-mono text-pink-400 font-bold">{{ game.playerVitality }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Santé Max</span><span class="font-mono text-green-400 font-bold">{{ game.playerMaxHealth }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Intelligence</span><span class="font-mono text-blue-400 font-bold">{{ game.playerIntelligence }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Mana Max</span><span class="font-mono text-blue-400 font-bold">{{ game.playerMaxMana }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Agilité</span><span class="font-mono text-green-400 font-bold">{{ game.playerAgility }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Défense</span><span class="font-mono text-slate-300 font-bold">{{ game.playerDefense }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Chance</span><span class="font-mono text-amber-300 font-bold">{{ game.playerLuck }}</span></div>
                        <div class="flex justify-between items-center border-b border-white/5 pb-1"><span class="text-slate-400">Or / Sec</span><span class="font-mono text-amber-400 font-bold">{{ game.currentGoldPerSecond.toFixed(1) }}</span></div>
                    </div>
                </div>
            </UiScrollArea>
        </UiCard>
        <div class="flex-1 min-h-0 flex flex-col">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Icon name="lucide:backpack" class="w-4 h-4"/> Sac à dos</h3>
            <UiScrollArea class="flex-1 -mr-2 pr-2">
                <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    <div v-for="i in 30" :key="i" class="aspect-square bg-slate-800/60 rounded-md border border-white/5 flex items-center justify-center hover:border-white/20 hover:bg-slate-700 transition-colors cursor-pointer group relative">
                        <Icon name="lucide:lock" class="text-slate-700 w-6 h-6 group-hover:text-slate-500 transition-colors"/>
                    </div>
                </div>
            </UiScrollArea>
        </div>
    </div>
</template>