<!-- app/pages/index.vue -->
<script setup lang="ts">
import { UPGRADES } from '~/data/upgrades'

definePageMeta({
    middleware: 'auth'
})

const game = useGameStore()
const { logout } = useAuth()
const { character } = useCharacter()

// Gestion de la navigation
const currentTab = ref('home') // 'home' | 'inventory' | 'skills' | 'dungeon' | 'shop' | 'profile' | 'settings'

// Feedback visuel
const particles = ref<{id: number, x: number, y: number, val: number}[]>([])
const isShaking = ref(false)
const isReady = ref(false)

let particleIdCounter = 0
const triggerClick = (event: MouseEvent) => {
  if (currentTab.value !== 'dungeon') return // On ne clique que dans le donjon
  game.handleMainClick()
  isShaking.value = true
  setTimeout(() => isShaking.value = false, 150)

  const id = particleIdCounter++
  particles.value.push({ id, x: event.clientX, y: event.clientY, val: game.currentGoldPerClick })
  setTimeout(() => { particles.value = particles.value.filter(p => p.id !== id) }, 800)
}

onMounted(async () => {
  const api = (window as any).electronAPI
  if (api && typeof api.resize === 'function') {
      // Taille de jeu standard (plus large)
      await api.resize(1280, 800)
      api.center?.()
  }

  // Charger la sauvegarde
  game.loadGame()
  
  const interval = setInterval(() => { game.generatePassiveIncome() }, 100)
  
  // Sauvegarde auto toutes les 30 secondes
  const saveInterval = setInterval(() => { game.saveGame() }, 30000)

  onUnmounted(() => {
    clearInterval(interval)
    clearInterval(saveInterval)
  })

  // Délai pour transition fluide après redimensionnement
  setTimeout(() => { isReady.value = true }, 300)
})

const tabs = [
  { id: 'home', label: 'Accueil', icon: 'lucide:home' },
  { id: 'dungeon', label: 'Donjon', icon: 'lucide:swords' },
  { id: 'inventory', label: 'Inventaire', icon: 'lucide:backpack' },
  { id: 'skills', label: 'Talents', icon: 'lucide:zap' },
  { id: 'shop', label: 'Boutique', icon: 'lucide:store' },
  { id: 'profile', label: 'Profil', icon: 'lucide:user' },
  { id: 'settings', label: 'Menu', icon: 'lucide:settings' },
]

const currentTabLabel = computed(() => tabs.find(t => t.id === currentTab.value)?.label)

const formatMoney = (amount: number) => {
    const val = Math.floor(amount)
    const g = Math.floor(val / 10000)
    const s = Math.floor((val % 10000) / 100)
    const c = Math.floor(val % 100)
    return { g, s, c }
}

// Changer de personnage (Retour à la sélection)
const changeCharacter = async () => {
    game.saveGame()
    character.value = null // On désélectionne le perso actuel
    navigateTo('/character/selection')
}

// Fonction pour quitter via le menu (déclenche aussi le logout si besoin, ou juste save)
const quitGame = () => {
    game.saveGame()
    character.value = null
    logout()
    navigateTo('/auth/login')
}
</script>

<template>
    <div v-if="isReady" class="flex-1 flex overflow-hidden relative p-4 gap-4 h-full animate-fade-in">
    
    <!-- Background Image / Gradient -->
    <div class="absolute inset-0 bg-slate-900 -z-20"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-amber-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

    <!-- Left Sidebar (Navigation) -->
    <aside class="w-20 shrink-0 bg-slate-800/50 backdrop-blur-xl border border-white/10 flex flex-col items-center py-6 gap-4 z-30 rounded-md shadow-xl">
      <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id"
        class="relative group flex items-center justify-center p-3 rounded-md transition-all duration-300 hover:bg-white/10 w-12 h-12"
        :class="currentTab === tab.id ? 'text-amber-400 bg-white/10 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 'text-slate-500 hover:text-slate-200'">
        
        <Icon :name="tab.icon" class="w-6 h-6 transition-transform duration-300 group-hover:scale-110" 
              :class="{'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]': currentTab === tab.id}"/>
        
        <!-- Tooltip -->
        <span class="absolute left-full ml-4 bg-black/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-50 shadow-xl translate-x-2 group-hover:translate-x-0 duration-200">
            {{ tab.label }}
        </span>
      </button>
    </aside>

    <!-- Main Layout Column -->
    <div class="flex-1 flex flex-col min-w-0 relative z-10 gap-4">
        
        <!-- Header (Resources HUD) -->
        <header class="h-20 shrink-0 px-8 py-4 flex items-center justify-between bg-slate-800/50 border border-white/10 backdrop-blur-xl rounded-md shadow-lg">
            <!-- Title (Left) -->
            <div class="flex items-center">
                 <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-widest drop-shadow-sm">{{ currentTabLabel }}</h1>
            </div>

            <!-- Stats (Right) -->
            <div class="flex items-center gap-8">
                <!-- Gold -->
                <div class="flex flex-col items-end animate-slide-up" style="animation-delay: 100ms">
                    <span class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Monnaie</span>
                    <div class="flex items-center gap-3">
                        <div v-if="formatMoney(game.gold).g > 0" class="flex items-center gap-1 text-amber-400 drop-shadow-sm">
                            <span class="font-mono font-black text-xl">{{ formatMoney(game.gold).g }}</span>
                            <Icon name="lucide:circle" class="w-3 h-3 fill-current"/>
                        </div>
                        <div v-if="formatMoney(game.gold).s > 0 || formatMoney(game.gold).g > 0" class="flex items-center gap-1 text-slate-300 drop-shadow-sm">
                            <span class="font-mono font-bold text-lg">{{ formatMoney(game.gold).s }}</span>
                            <Icon name="lucide:circle" class="w-3 h-3 fill-current"/>
                        </div>
                        <div class="flex items-center gap-1 text-orange-400 drop-shadow-sm">
                            <span class="font-mono font-bold text-lg">{{ formatMoney(game.gold).c }}</span>
                            <Icon name="lucide:circle" class="w-3 h-3 fill-current"/>
                        </div>
                    </div>
                </div>

                <!-- Click Damage -->
                <div class="flex flex-col items-end animate-slide-up" style="animation-delay: 200ms">
                    <span class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Puissance</span>
                    <div class="flex items-center gap-2 text-red-400">
                        <span class="font-mono font-bold text-xl">{{ Math.floor(game.currentGoldPerClick * 10 + game.currentGoldPerSecond * 5).toLocaleString() }}</span>
                        <Icon name="lucide:sword" class="w-5 h-5"/>
                    </div>
                </div>
            </div>
        </header>

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden relative bg-slate-800/20 border border-white/5 backdrop-blur-sm rounded-md shadow-inner p-6">
            
            <!-- Home (Dashboard) -->
            <div v-if="currentTab === 'home'" class="h-full flex flex-col gap-6 animate-fade-in">
                <!-- Hero Banner / Status -->
                <UiCard class="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border-white/10 p-8 flex items-center justify-between relative overflow-hidden group shrink-0 shadow-xl animate-slide-up">
                    <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-transparent to-transparent opacity-50"></div>
                    
                    <div class="relative z-10 flex items-center gap-6">
                        <div class="size-24 bg-slate-800 rounded-full border-4 border-indigo-500/30 flex items-center justify-center shadow-xl">
                            <Icon name="lucide:user" class="w-12 h-12 text-indigo-200"/>
                        </div>
                        <div>
                            <h2 class="text-3xl font-black text-white uppercase tracking-widest">Loopbreaker</h2>
                            <div class="flex items-center gap-2 text-indigo-300 font-mono mt-1">
                                <Icon name="lucide:crown" class="w-4 h-4"/>
                                <span>Niveau {{ game.playerLevel }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="relative z-10 text-right">
                        <div class="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">Puissance de Combat</div>
                        <div class="text-4xl font-black text-white drop-shadow-lg flex items-center justify-end gap-2">
                            {{ Math.floor(game.currentGoldPerClick * 10 + game.currentGoldPerSecond * 5).toLocaleString() }}
                            <Icon name="lucide:swords" class="w-8 h-8 text-indigo-500"/>
                        </div>
                    </div>
                </UiCard>

                <!-- Dashboard Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    
                    <!-- Progression Card -->
                    <UiCard class="flex flex-col relative overflow-hidden hover:border-white/20 hover:bg-slate-700/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group animate-slide-up" style="animation-delay: 100ms">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold text-slate-200 flex items-center gap-2">
                                <Icon name="lucide:map" class="w-5 h-5 text-emerald-400"/> Progression
                            </h3>
                            <span class="text-xs font-mono text-slate-500">Zone {{ Math.ceil(game.level / 10) }}</span>
                        </div>
                        
                        <div class="flex-1 flex flex-col items-center justify-center text-center gap-2">
                            <div class="text-5xl font-black text-white">Étage {{ game.level }}</div>
                            <p class="text-sm text-slate-400">Monstre actuel : {{ Math.ceil(game.monsterHealth) }} PV</p>
                        </div>

                        <button @click="currentTab = 'dungeon'" class="mt-4 w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-md border border-emerald-500/20 transition-all flex items-center justify-center gap-2 group-hover:border-emerald-500/40">
                            Rejoindre le combat <Icon name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"/>
                        </button>
                    </UiCard>

                    <!-- Quick Stats -->
                    <UiCard class="flex flex-col hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up" style="animation-delay: 200ms">
                        <h3 class="font-bold text-slate-200 flex items-center gap-2 mb-6">
                            <Icon name="lucide:activity" class="w-5 h-5 text-blue-400"/> Statistiques
                        </h3>
                        
                        <div class="space-y-4 flex-1">
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400 text-sm">Dégâts / Clic</span>
                                <span class="font-mono font-bold text-red-400">{{ game.currentGoldPerClick }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400 text-sm">Dégâts / Sec</span>
                                <span class="font-mono font-bold text-green-400">{{ game.currentGoldPerSecond.toFixed(1) }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-slate-400 text-sm">Critique</span>
                                <span class="font-mono font-bold text-yellow-400">{{ game.playerLuck }}%</span>
                            </div>
                        </div>
                    </UiCard>

                    <!-- Active Skills / Buffs (Placeholder for now) -->
                    <UiCard class="flex flex-col hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up" style="animation-delay: 300ms">
                        <h3 class="font-bold text-slate-200 flex items-center gap-2 mb-6">
                            <Icon name="lucide:zap" class="w-5 h-5 text-amber-400"/> Compétences Actives
                        </h3>
                        
                        <div class="flex-1 flex items-center justify-center text-slate-600 text-sm italic">
                            Aucune compétence active
                        </div>
                         <button @click="currentTab = 'skills'" class="mt-4 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-md border border-white/5 transition-all">
                            Gérer les compétences
                        </button>
                    </UiCard>

                </div>
            </div>

            <!-- Dungeon (Combat) -->
            <div v-else-if="currentTab === 'dungeon'" class="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                
                <!-- Combat Scene (Left/Center) -->
                <div class="lg:col-span-2 flex flex-col gap-6">
                    <UiCard class="flex-1 bg-slate-950/30 border-white/10 flex flex-col items-center justify-center relative overflow-hidden group min-h-[400px] shadow-inner">
                        <!-- Monster Info -->
                        <div class="absolute top-6 left-0 right-0 text-center z-20">
                            <h2 class="text-3xl font-black text-white/90 uppercase tracking-widest drop-shadow-lg">Monstre Étage {{ game.level }}</h2>
                            <div class="flex justify-center items-center gap-2 mt-2">
                                <Icon name="lucide:sword" class="w-5 h-5 text-red-400"/>
                                <span class="text-sm font-bold text-red-400">ATK: {{ game.monsterAttackDamage }}</span>
                            </div>
                        </div>

                        <!-- Monster Avatar -->
                        <div :class="{'animate-shake': isShaking}"
                            class="relative size-80 flex items-center justify-center transition-transform z-10">
                            <div class="absolute inset-0 bg-red-500/20 rounded-full blur-[80px] animate-pulse"></div>
                            <Icon name="lucide:ghost" class="w-64 h-64 text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]" />
                        </div>

                        <!-- Monster HP Bar -->
                        <div class="absolute bottom-8 left-12 right-12 z-20">
                            <div class="flex justify-between text-xs font-bold mb-1 text-slate-300">
                                <span>PV Monstre</span>
                                <span>{{ Math.ceil(game.monsterHealth) }} / {{ game.monsterMaxHealth }}</span>
                            </div>
                            <div class="h-4 bg-slate-950 rounded-full overflow-hidden border border-white/10 shadow-inner">
                                <div class="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-200"
                                     :style="{ width: Math.max(0, (game.monsterHealth / game.monsterMaxHealth) * 100) + '%' }"></div>
                            </div>
                        </div>
                    </UiCard>

                    <!-- Action Bar -->
                    <div class="grid grid-cols-4 gap-4 h-24">
                        <button @click="triggerClick" class="bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white p-4 rounded-md font-bold flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-red-900/30 border border-red-400/20 cursor-pointer group relative overflow-hidden">
                            <Icon name="lucide:sword" class="w-8 h-8 group-hover:scale-110 transition-transform"/>
                            <span class="text-xs uppercase tracking-wide">Attaquer</span>
                        </button>
                        <!-- Skills placeholders -->
                        <button v-for="i in 3" :key="i" disabled class="bg-slate-800/50 border border-white/5 p-4 rounded-md flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                             <Icon name="lucide:lock" class="w-6 h-6 text-slate-600"/>
                             <span class="text-[10px] text-slate-600 uppercase tracking-wide">Vide</span>
                        </button>
                    </div>
                </div>

                <!-- Right Column: Combat Log -->
                <UiCard class="lg:col-span-1 bg-slate-950/30 border-white/10 p-4 overflow-hidden flex flex-col h-full max-h-[calc(100vh-12rem)]">
                    <h3 class="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2 pb-2 border-b border-white/5">
                        <Icon name="lucide:scroll-text" class="w-4 h-4"/> Journal de combat
                    </h3>
                    <UiScrollArea class="flex-1 space-y-2 pr-2 text-xs font-mono">
                        <div v-for="(log, i) in game.combatLog" :key="i" class="text-slate-300 border-b border-white/5 pb-1 last:border-0 break-words">
                            {{ log }}
                        </div>
                        <div v-if="game.combatLog.length === 0" class="text-slate-600 italic text-center mt-10">
                            Le combat commence...
                        </div>
                    </UiScrollArea>
                </UiCard>
            </div>

            <!-- Other Tabs (Grid Layout) -->
            <div v-else class="h-full w-full">
                    <!-- Shop -->
                    <div v-if="currentTab === 'shop'" class="space-y-6">
                      <UiScrollArea class="h-full pr-4">
                        <div class="max-w-6xl mx-auto pb-6">
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button v-for="up in UPGRADES" :key="up.id" @click="game.buyUpgrade(up.id)"
                                :disabled="game.gold < game.getUpgradeCost(up.id)"
                                class="bg-slate-800/60 border border-white/10 p-4 rounded-md flex items-center gap-4 hover:bg-slate-700/80 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] group text-left relative overflow-hidden shadow-sm">
                                
                                <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div class="size-14 bg-slate-950/50 rounded-md flex items-center justify-center shrink-0 border border-white/5 group-hover:border-amber-500/50 transition-colors">
                                    <Icon :name="up.type === 'click' ? 'lucide:sword' : 'lucide:hammer'" 
                                          class="w-7 h-7 text-slate-400 group-hover:text-amber-400 transition-colors"/>
                                </div>
                                
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold text-slate-200 truncate">{{ up.name }}</h4>
                                    <p class="text-xs text-slate-500">Niveau {{ game.inventory[up.id] || 0 }}</p>
                                    <div class="flex items-center gap-1 mt-1 text-xs font-medium text-green-400">
                                        <Icon :name="up.type === 'click' ? 'lucide:zap' : 'lucide:hourglass'" class="w-3 h-3"/>
                                        +{{ up.power }} {{ up.type === 'click' ? 'Dégâts' : 'Or/s' }}
                                    </div>
                                </div>
                                
                                <div class="flex flex-col items-end shrink-0">
                                    <div class="flex flex-col items-end text-xs font-bold font-mono">
                                        <div v-if="formatMoney(game.getUpgradeCost(up.id)).g > 0" class="text-amber-400 flex items-center gap-1">
                                            {{ formatMoney(game.getUpgradeCost(up.id)).g }} <Icon name="lucide:circle" class="w-2 h-2 fill-current"/>
                                        </div>
                                        <div v-if="formatMoney(game.getUpgradeCost(up.id)).s > 0" class="text-slate-300 flex items-center gap-1">
                                            {{ formatMoney(game.getUpgradeCost(up.id)).s }} <Icon name="lucide:circle" class="w-2 h-2 fill-current"/>
                                        </div>
                                        <div class="text-orange-400 flex items-center gap-1">
                                            {{ formatMoney(game.getUpgradeCost(up.id)).c }} <Icon name="lucide:circle" class="w-2 h-2 fill-current"/>
                                        </div>
                                    </div>
                                    <span class="text-[10px] text-slate-500 uppercase font-bold mt-1">Acheter</span>
                                </div>
                            </button>
                        </div>
                        </div>
                      </UiScrollArea>
                    </div>

                    <!-- Inventory -->
                    <div v-if="currentTab === 'inventory'" class="h-full flex flex-col lg:flex-row gap-6">
                        <!-- Equipment & Character -->
                        <UiCard class="flex flex-col items-center gap-6 shrink-0 max-h-full !p-0 overflow-hidden">
                        <UiScrollArea class="p-6 h-full w-full flex flex-col items-center gap-6">
                            <div class="flex gap-8 items-center justify-center w-full">
                                <!-- Left Slots (Armor) -->
                                <div class="flex flex-col gap-3">
                                    <UiTooltip text="Tête">
                                        <div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group">
                                            <Icon name="lucide:crown" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/>
                                        </div>
                                    </UiTooltip>
                                    <UiTooltip text="Torse">
                                        <div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group">
                                            <Icon name="lucide:shirt" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/>
                                        </div>
                                    </UiTooltip>
                                    <UiTooltip text="Jambes">
                                        <div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group">
                                            <Icon name="lucide:columns-2" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/>
                                        </div>
                                    </UiTooltip>
                                    <UiTooltip text="Pieds">
                                        <div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group">
                                            <Icon name="lucide:footprints" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/>
                                        </div>
                                    </UiTooltip>
                                </div>
                                
                                <!-- Character Avatar -->
                                <div class="w-48 h-72 bg-slate-950/60 border border-white/10 rounded-md flex items-center justify-center relative overflow-hidden shadow-inner">
                                    <div class="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
                                    <Icon name="lucide:user" class="w-32 h-32 text-slate-800"/>
                                </div>

                                <!-- Right Slots (Weapons/Jewelry) -->
                                <div class="flex flex-col gap-3">
                                    <UiTooltip text="Arme">
                                        <div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group">
                                            <Icon name="lucide:sword" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/>
                                        </div>
                                    </UiTooltip>
                                    <UiTooltip text="Bouclier">
                                        <div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group">
                                            <Icon name="lucide:shield" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/>
                                        </div>
                                    </UiTooltip>
                                    <UiTooltip text="Amulette">
                                        <div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group">
                                            <Icon name="lucide:gem" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/>
                                        </div>
                                    </UiTooltip>
                                    <UiTooltip text="Anneau">
                                        <div class="size-14 bg-slate-950/40 border border-white/10 rounded-md flex items-center justify-center hover:border-white/30 transition-colors cursor-pointer group">
                                            <Icon name="lucide:circle" class="w-6 h-6 text-slate-700 group-hover:text-slate-500"/>
                                        </div>
                                    </UiTooltip>
                                </div>
                            </div>

                            <!-- Full Stats Card -->
                            <div class="w-full bg-slate-950/20 rounded-md p-4 border border-white/5">
                                <h4 class="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <Icon name="lucide:bar-chart-2" class="w-3 h-3"/> Statistiques
                                </h4>
                                <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Niveau</span>
                                        <span class="font-mono text-white font-bold">{{ game.playerLevel }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">XP Actuel</span>
                                        <span class="font-mono text-purple-400 font-bold">{{ Math.floor(game.playerXp) }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Force</span>
                                        <span class="font-mono text-red-400 font-bold">{{ game.playerStrength }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Attaque</span>
                                        <span class="font-mono text-red-400 font-bold">{{ game.currentGoldPerClick }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Vitalité</span>
                                        <span class="font-mono text-pink-400 font-bold">{{ game.playerVitality }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Santé Max</span>
                                        <span class="font-mono text-green-400 font-bold">{{ game.playerMaxHealth }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Intelligence</span>
                                        <span class="font-mono text-blue-400 font-bold">{{ game.playerIntelligence }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Mana Max</span>
                                        <span class="font-mono text-blue-400 font-bold">{{ game.playerMaxMana }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Agilité</span>
                                        <span class="font-mono text-green-400 font-bold">{{ game.playerAgility }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Défense</span>
                                        <span class="font-mono text-slate-300 font-bold">{{ game.playerDefense }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Chance</span>
                                        <span class="font-mono text-amber-300 font-bold">{{ game.playerLuck }}</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span class="text-slate-400">Or / Sec</span>
                                        <span class="font-mono text-amber-400 font-bold">{{ game.currentGoldPerSecond.toFixed(1) }}</span>
                                    </div>
                                </div>
                            </div>
                        </UiScrollArea>
                        </UiCard>

                        <!-- Inventory Grid -->
                        <div class="flex-1 min-h-0 flex flex-col">
                            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Icon name="lucide:backpack" class="w-4 h-4"/> Sac à dos
                            </h3>
                        <UiScrollArea class="flex-1 -mr-2 pr-2">
                            <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
                                <div v-for="i in 30" :key="i" class="aspect-square bg-slate-800/60 rounded-md border border-white/5 flex items-center justify-center hover:border-white/20 hover:bg-slate-700 transition-colors cursor-pointer group relative">
                                    <Icon name="lucide:lock" class="text-slate-700 w-6 h-6 group-hover:text-slate-500 transition-colors"/>
                                </div>
                            </div>
                        </UiScrollArea>
                        </div>
                    </div>

                    <!-- Skills -->
                    <div v-if="currentTab === 'skills'" class="space-y-6">
                      <UiScrollArea class="h-full pr-4">
                        <div class="max-w-6xl mx-auto">
                        <div class="grid gap-4">
                            <UiCard class="bg-slate-800/50 p-4 flex gap-4 items-center opacity-50">
                                <div class="size-16 bg-slate-950/40 rounded-md flex items-center justify-center">
                                    <Icon name="lucide:swords" class="w-8 h-8 text-slate-600"/>
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg">Frappe Héroïque</h3>
                                    <p class="text-sm text-slate-500">Inflige 500% de dégâts en un coup. (Bientôt)</p>
                                </div>
                            </UiCard>
                        </div>
                        </div>
                      </UiScrollArea>
                    </div>

                    <!-- Profile -->
                    <div v-if="currentTab === 'profile'" class="space-y-6">
                      <UiScrollArea class="h-full pr-4">
                        <div class="max-w-6xl mx-auto">
                        <UiCard class="bg-slate-800/60 border-white/10 p-8 text-center shadow-lg">
                            <div class="size-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-slate-700">
                                <Icon name="lucide:user" class="w-12 h-12 text-slate-400"/>
                            </div>
                            <h2 class="text-2xl font-black text-white">Héros Solitaire</h2>
                            <p class="text-slate-500">Niveau {{ game.level }}</p>
                        </UiCard>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <UiCard class="bg-slate-800/50 p-4">
                                <p class="text-xs text-slate-500 uppercase font-bold">Dégâts Totaux</p>
                                <p class="text-xl font-mono font-bold text-white">{{ game.currentGoldPerClick }}</p>
                            </UiCard>
                            <UiCard class="bg-slate-800/50 p-4">
                                <p class="text-xs text-slate-500 uppercase font-bold">Monstres Tués</p>
                                <p class="text-xl font-mono font-bold text-white">{{ game.level - 1 }}</p>
                            </UiCard>
                        </div>
                        </div>
                      </UiScrollArea>
                    </div>

                    <!-- Settings -->
                    <div v-if="currentTab === 'settings'" class="max-w-md mx-auto space-y-6">
                      <UiScrollArea class="h-full pr-4">
                        <div class="space-y-3">
                            <UiButton @click="game.saveGame()" block class="justify-between group">
                                <span class="flex items-center gap-3"><Icon name="lucide:save" class="w-5 h-5"/> Sauvegarder</span>
                                <Icon name="lucide:chevron-right" class="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform"/>
                            </UiButton>
                            <UiButton @click="changeCharacter" block class="justify-between group">
                                <span class="flex items-center gap-3"><Icon name="lucide:users" class="w-5 h-5"/> Changer de personnage</span>
                                <Icon name="lucide:chevron-right" class="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform"/>
                            </UiButton>
                            <UiButton @click="quitGame" variant="danger" block>
                                <Icon name="lucide:log-out" class="w-5 h-5"/> Déconnexion
                            </UiButton>
                        </div>
                      </UiScrollArea>
                    </div>
            </div>
        </div>

        <!-- Footer (Floating Bar) -->
        <footer class="h-20 bg-slate-800/60 border border-white/10 px-8 py-2 flex items-center gap-8 shrink-0 z-20 rounded-md backdrop-blur-2xl shadow-lg">
            <!-- Avatar / Level -->
            <div class="flex items-center gap-4 shrink-0">
                <div class="size-12 bg-slate-800 rounded-full border-2 border-amber-500/50 flex items-center justify-center shadow-lg">
                    <Icon name="lucide:user" class="w-6 h-6 text-amber-100"/>
                </div>
                <div>
                    <div class="text-sm font-bold text-white">Héros Solitaire</div>
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

    </div>
    </div>
    
    <div v-else class="flex-1 flex items-center justify-center h-full">
        <UiLoader />
    </div>

    <Teleport to="body">
      <div v-for="p in particles" :key="p.id" 
        class="pointer-events-none fixed font-black text-2xl text-amber-400 animate-float-up z-[9999] drop-shadow-md"
        :style="{ left: p.x + 'px', top: p.y + 'px' }">
        +{{ p.val }}
      </div>
    </Teleport>
</template>