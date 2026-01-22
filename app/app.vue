<script setup lang="ts">
const game = useGameStore()
const { logout } = useAuth()
const isElectron = ref(false)

const serverStatus = ref('En ligne')
const onlinePlayers = ref(1243)

// Fonction pour fermer l'app proprement (Electron)
const showQuitModal = ref(false)

const quitApp = () => {
  showQuitModal.value = true
}

// Contrôles de la fenêtre
const minimizeWindow = () => (window as any).electronAPI?.minimize()
const maximizeWindow = () => (window as any).electronAPI?.maximize()
const closeWindow = async () => {
    game.saveGame()
    await logout() // Déconnexion à la fermeture (attend le délai du loader)
    if ((window as any).electronAPI) {
        (window as any).electronAPI.close()
    } else {
        window.close() // Fallback navigateur
    }
}

const confirmQuit = () => {
  closeWindow()
}

onMounted(() => {
  if ((window as any).electronAPI) {
    isElectron.value = true
  }
})
</script>

<template>
  <div class="h-screen w-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden font-sans select-none relative selection:bg-amber-500/30">
    
    <!-- Custom Title Bar -->
    <header v-if="isElectron" class="h-8 bg-slate-800/50 border-b border-white/5 flex items-center justify-between pl-4 shrink-0 z-50 backdrop-blur-md" style="-webkit-app-region: drag">
        <div class="flex items-center gap-2 text-amber-400 font-black tracking-widest text-xs select-none">
            <Icon name="lucide:swords" class="w-4 h-4"/>
            <span>NEKO : IDLE RPG</span>
        </div>
        
        <div class="flex items-center h-full gap-4" style="-webkit-app-region: no-drag">
            <!-- Server Info -->
            <div class="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider mr-2">
                <div class="flex items-center gap-1 text-slate-400">
                    <Icon name="lucide:users" class="w-3 h-3" />
                    <span>{{ onlinePlayers.toLocaleString() }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span class="text-emerald-400">{{ serverStatus }}</span>
                </div>
            </div>

            <!-- Window Controls -->
            <div class="flex items-center h-full border-l border-white/5">
            <button @click="minimizeWindow" class="h-full w-12 flex items-center justify-center hover:bg-white/5 text-slate-400 hover:text-white transition-colors outline-none">
                <Icon name="lucide:minus" class="w-4 h-4"/>
            </button>
            <button @click="maximizeWindow" class="h-full w-12 flex items-center justify-center hover:bg-white/5 text-slate-400 hover:text-white transition-colors outline-none">
                <Icon name="lucide:square" class="w-3 h-3"/>
            </button>
            <button @click="showQuitModal = true" class="h-full w-12 flex items-center justify-center hover:bg-red-500/80 text-slate-400 hover:text-white transition-colors outline-none">
                <Icon name="lucide:x" class="w-4 h-4"/>
            </button>
            </div>
        </div>
    </header>

    <main class="flex-1 flex overflow-hidden relative">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </main>

    <!-- Quit Modal -->
    <UiModal :show="showQuitModal" title="Quitter le jeu ?" @close="showQuitModal = false">
      <p class="text-slate-300 mb-6">Votre progression sera sauvegardée automatiquement.</p>
      <div class="flex gap-3">
        <UiButton @click="showQuitModal = false" class="flex-1">Annuler</UiButton>
        <UiButton @click="confirmQuit" variant="danger" class="flex-1">Quitter</UiButton>
      </div>
    </UiModal>

    <!-- Le Loader Global qui s'affiche par-dessus tout -->
    <UiGlobalLoader />
  </div>
</template>

<style>
/* Transitions de page globales */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

@keyframes fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.2s ease-out forwards;
}

@keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
    animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0; /* Start hidden */
}
</style>