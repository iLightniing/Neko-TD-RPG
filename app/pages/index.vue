<!-- app/pages/index.vue -->
<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
})

const game = useGameStore()

// Gestion de la navigation
const currentTab = ref('home') // 'home' | 'inventory' | 'skills' | 'dungeon' | 'shop' | 'profile' | 'settings'
const isReady = ref(false)

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
</script>

<template>
    <GameUI v-if="isReady" v-model="currentTab">
        <Transition name="page" mode="out-in">
            
            <!-- Home (La Taverne) -->
            <GameModulesTavern v-if="currentTab === 'home'" key="home" @navigate="currentTab = $event" />

            <!-- Dungeon (Combat) -->
            <GameModulesDungeon v-else-if="currentTab === 'dungeon'" key="dungeon" @navigate="currentTab = $event" class="bg-slate-800/20 border border-white/5 backdrop-blur-sm rounded-md shadow-inner p-6" />

            <!-- Shop -->
            <GameModulesShop v-else-if="currentTab === 'shop'" key="shop" class="space-y-6 h-full bg-slate-800/20 border border-white/5 backdrop-blur-sm rounded-md shadow-inner p-6" />

            <!-- Inventory -->
            <GameModulesInventory v-else-if="currentTab === 'inventory'" key="inventory" class="bg-slate-800/20 border border-white/5 backdrop-blur-sm rounded-md shadow-inner p-6" />

            <!-- Skills -->
            <GameModulesSkills v-else-if="currentTab === 'skills'" key="skills" class="space-y-6 h-full bg-slate-800/20 border border-white/5 backdrop-blur-sm rounded-md shadow-inner p-6" />

            <!-- Profile -->
            <GameModulesProfile v-else-if="currentTab === 'profile'" key="profile" class="bg-slate-800/20 border border-white/5 backdrop-blur-sm rounded-md shadow-inner p-6" />

            <!-- Settings -->
            <GameModulesSettings v-else-if="currentTab === 'settings'" key="settings" class="bg-slate-800/20 border border-white/5 backdrop-blur-sm rounded-md shadow-inner p-6" />
        </Transition>
    </GameUI>
    
    <div v-else class="flex-1 flex items-center justify-center h-full">
        <UiLoader />
    </div>
</template>