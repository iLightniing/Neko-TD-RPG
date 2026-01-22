<script setup lang="ts">
import { CHAPTERS } from '~/data/chapters'

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

const game = useGameStore()
const showChapterModal = ref(false)

// Chargement dynamique des images de chapitres
const chapterImages = import.meta.glob('~/assets/images/chapitres/*.png', { eager: true, import: 'default' })

const getChapterBg = (id: number) => {
    const key = Object.keys(chapterImages).find(k => k.endsWith(`/${id}.png`) || k.endsWith(`/chapitre${id}.png`))
    return key ? (chapterImages[key] as string) : (Object.values(chapterImages)[0] as string)
}

// Initialisation du chapitre sélectionné (basé sur le niveau actuel du joueur)
const initialChapter = CHAPTERS.find(c => game.level >= c.min && game.level <= c.max) || CHAPTERS[0]
const selectedChapter = ref(initialChapter!)

const getChapterStatus = (chapter: any) => {
    if (game.maxLevel > chapter.max) return 'clear'
    if (game.maxLevel >= chapter.min) return 'unlocked'
    return 'locked'
}

const selectChapter = (chapter: any) => {
    if (getChapterStatus(chapter) === 'locked') return
    
    // On met à jour la sélection locale sans voyager tout de suite
    selectedChapter.value = chapter
    showChapterModal.value = false
}

const startAdventure = () => {
    // Si on est déjà dans le bon chapitre (niveau actuel compris dans les bornes du chapitre sélectionné)
    if (game.level >= selectedChapter.value.min && game.level <= selectedChapter.value.max) {
        // On continue l'aventure là où on en était
        emit('navigate', 'dungeon')
    } else {
        // Sinon, on voyage vers le début du chapitre sélectionné
        game.travelToLevel(selectedChapter.value.min)
        emit('navigate', 'dungeon')
    }
}
</script>

<template>
    <div class="h-full relative overflow-hidden rounded-xl border border-white/10 shadow-2xl group select-none">
        <!-- Tavern Image (Full Size) -->
        <img src="~/assets/images/chapitres/taverne.png" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110" alt="Taverne" />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none"></div>

        <!-- Content Overlay -->
        <div class="absolute inset-0 flex flex-col justify-between p-4 md:p-10 z-10">
            
            <!-- Top Bar Actions -->
            <div class="flex justify-between items-start w-full">
                <!-- Left Actions -->
                <div class="flex flex-col gap-3">
                    <button class="flex items-center gap-2 md:gap-3 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 px-3 py-2 md:px-4 rounded-lg transition-all hover:scale-105 group/btn shadow-lg">
                        <div class="p-1.5 bg-amber-500/20 rounded-md border border-amber-500/30 group-hover/btn:bg-amber-500 group-hover/btn:text-white transition-colors text-amber-400">
                            <Icon name="lucide:scroll" class="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div class="text-left hidden sm:block">
                            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider group-hover/btn:text-amber-400 transition-colors">Quêtes</div>
                            <div class="text-xs font-bold text-white">3 Disponibles</div>
                        </div>
                    </button>
                    <button class="flex items-center gap-2 md:gap-3 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 px-3 py-2 md:px-4 rounded-lg transition-all hover:scale-105 group/btn shadow-lg">
                        <div class="p-1.5 bg-purple-500/20 rounded-md border border-purple-500/30 group-hover/btn:bg-purple-500 group-hover/btn:text-white transition-colors text-purple-400">
                            <Icon name="lucide:calendar" class="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div class="text-left hidden sm:block">
                            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider group-hover/btn:text-purple-400 transition-colors">Événements</div>
                            <div class="text-xs font-bold text-white">Hiver Glacial</div>
                        </div>
                    </button>
                </div>

                <!-- Center: Current Chapter Display -->
                <div class="flex flex-col items-center gap-4 md:gap-6 -mt-2 flex-1 justify-center min-h-0">
                    <div class="text-center">
                        <h3 class="text-xl md:text-3xl font-black text-white uppercase tracking-widest drop-shadow-xl font-serif">Taverne du Chat Noir</h3>
                        <div class="h-1 w-16 md:w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
                    </div>
                <img 
                    :src="getChapterBg(selectedChapter.id)" 
                    class="w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 2xl:w-[28rem] h-auto max-h-[40vh] object-contain rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-amber-500/20" 
                    :alt="selectedChapter.name" 
                    @click="showChapterModal = true" 
                />
                </div>

                <!-- Right Actions -->
                <div class="flex flex-col gap-3 items-end">
                    <button class="flex flex-row-reverse items-center gap-2 md:gap-3 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 px-3 py-2 md:px-4 rounded-lg transition-all hover:scale-105 group/btn shadow-lg">
                        <div class="p-1.5 bg-red-500/20 rounded-md border border-red-500/30 group-hover/btn:bg-red-500 group-hover/btn:text-white transition-colors text-red-400">
                            <Icon name="lucide:trophy" class="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div class="text-right hidden sm:block">
                            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider group-hover/btn:text-red-400 transition-colors">Tournois</div>
                            <div class="text-xs font-bold text-white">Rang #42</div>
                        </div>
                    </button>
                    <button class="flex flex-row-reverse items-center gap-2 md:gap-3 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 px-3 py-2 md:px-4 rounded-lg transition-all hover:scale-105 group/btn shadow-lg">
                        <div class="p-1.5 bg-blue-500/20 rounded-md border border-blue-500/30 group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-colors text-blue-400">
                            <Icon name="lucide:users" class="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div class="text-right hidden sm:block">
                            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider group-hover/btn:text-blue-400 transition-colors">Guilde</div>
                            <div class="text-xs font-bold text-white">Rejoindre</div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Bottom Center Action -->
            <div class="flex flex-col items-center gap-6 shrink-0 translate-y-4">
                <button @click="startAdventure" class="group relative px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black uppercase tracking-widest rounded-xl border-2 border-red-400/50 shadow-lg shadow-red-900/50 transition-all hover:scale-105 hover:shadow-red-500/30 active:scale-95 flex items-center gap-3 overflow-hidden text-sm md:text-base">
                    <Icon name="lucide:swords" class="w-5 h-5 md:w-6 md:h-6" />
                    <span>Partir à l'aventure</span>
                    <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12 pointer-events-none"></div>
                </button>
            </div>
        </div>

        <!-- Modale de Sélection de Chapitre -->
        <UiModal :show="showChapterModal" title="Carte du Monde" @close="showChapterModal = false">
            <UiScrollArea class="h-[60vh] pr-4">
                <div class="grid gap-4">
                    <div v-for="chap in CHAPTERS" :key="chap.id" @click="selectChapter(chap)" class="relative h-32 rounded-xl border overflow-hidden transition-all duration-300 group shadow-lg" :class="[getChapterStatus(chap) === 'locked' ? 'border-white/5 grayscale opacity-60 cursor-not-allowed' : 'border-white/20 cursor-pointer hover:border-amber-500/50 hover:shadow-amber-500/20']">
                        <img :src="getChapterBg(chap.id)" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent z-10"></div>
                        <div class="absolute inset-0 z-20 flex items-center justify-between px-6">
                            <div>
                                <div class="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Chapitre {{ chap.id }}</div>
                                <h3 class="text-lg font-black text-white">{{ chap.name }}</h3>
                                <p class="text-[10px] text-slate-400 font-mono mt-1">Niveaux {{ chap.min }} - {{ chap.max }}</p>
                            </div>
                            <div v-if="getChapterStatus(chap) === 'clear'" class="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold rounded uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.3)]">Clear</div>
                            <div v-else-if="getChapterStatus(chap) === 'locked'" class="flex flex-col items-center gap-1 opacity-80">
                                <div class="size-10 rounded-full bg-slate-950/50 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-sm">
                                    <Icon name="lucide:lock" class="w-5 h-5 text-slate-400" />
                                </div>
                                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verrouillé</span>
                            </div>
                        </div>
                    </div>
                </div>
            </UiScrollArea>
        </UiModal>
    </div>
</template>