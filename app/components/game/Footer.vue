<script setup lang="ts">
const game = useGameStore()
const { character } = useCharacter()
const { getClassImage } = useGameClasses()
</script>

<template>
    <footer class="h-20 bg-slate-800/60 border border-white/10 px-8 py-2 flex items-center gap-8 shrink-0 z-20 rounded-md backdrop-blur-2xl shadow-lg">
        <!-- Avatar / Level -->
        <div class="flex items-center gap-4 shrink-0">
            <div class="size-12 bg-slate-800 rounded-full border-2 border-amber-500/50 flex items-center justify-center shadow-lg overflow-hidden">
                <img v-if="getClassImage(character)" :src="getClassImage(character)" class="w-full h-full object-cover" alt="Avatar"/>
                <Icon v-else name="lucide:user" class="w-6 h-6 text-amber-100"/>
            </div>
            <div>
                <div class="text-sm font-bold text-white">{{ character?.pseudo || 'Héros Solitaire' }}</div>
                <div class="text-xs text-amber-400 font-mono">Niveau {{ game.playerLevel }}</div>
            </div>
        </div>

        <!-- Stats Bars -->
        <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- HP -->
            <div class="flex flex-col justify-center">
                <div class="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider">
                    <span class="text-red-400">Santé</span>
                    <span class="text-white">{{ Math.ceil(game.playerHealth) }} / {{ game.playerMaxHealth }}</span>
                </div>
                <div class="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div class="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-200"
                            :style="{ width: Math.max(0, (game.playerHealth / game.playerMaxHealth) * 100) + '%' }"></div>
                </div>
            </div>

            <!-- Mana -->
            <div class="flex flex-col justify-center">
                <div class="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider">
                    <span class="text-blue-400">Mana</span>
                    <span class="text-white">{{ Math.floor(game.playerMana) }} / {{ game.playerMaxMana }}</span>
                </div>
                <div class="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div class="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-200"
                            :style="{ width: Math.max(0, (game.playerMana / game.playerMaxMana) * 100) + '%' }"></div>
                </div>
            </div>

            <!-- XP -->
            <div class="flex flex-col justify-center">
                <div class="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider">
                    <span class="text-yellow-400">Expérience</span>
                    <span class="text-white">{{ Math.floor(game.playerXp) }} / {{ game.playerMaxXp }}</span>
                </div>
                <div class="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div class="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-200"
                            :style="{ width: Math.max(0, (game.playerXp / game.playerMaxXp) * 100) + '%' }"></div>
                </div>
            </div>
        </div>
    </footer>
</template>