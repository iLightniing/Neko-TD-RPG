<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const game = useGameStore()
const { logout } = useAuth()
const { character } = useCharacter()
const showLogoutModal = ref(false)

const confirmLogout = async () => {
    game.saveGame()
    character.value = null
    await logout()
    await navigateTo('/auth/login')
}

const tabs = [
  { id: 'home', label: 'Taverne', icon: 'lucide:home' },
  { id: 'dungeon', label: 'Donjon', icon: 'lucide:swords' },
  { id: 'inventory', label: 'Inventaire', icon: 'lucide:backpack' },
  { id: 'skills', label: 'Talents', icon: 'lucide:zap' },
  { id: 'shop', label: 'Boutique', icon: 'lucide:store' },
  { id: 'profile', label: 'Profil', icon: 'lucide:user' },
  { id: 'settings', label: 'Menu', icon: 'lucide:settings' },
]
</script>

<template>
    <aside class="w-20 shrink-0 bg-slate-800/50 backdrop-blur-xl border border-white/10 flex flex-col items-center py-6 gap-4 z-30 rounded-md shadow-xl">
      <button v-for="tab in tabs" :key="tab.id" @click="emit('update:modelValue', tab.id)"
        class="relative group flex items-center justify-center p-3 rounded-md transition-all duration-300 hover:bg-white/10 w-12 h-12"
        :class="modelValue === tab.id ? 'text-amber-400 bg-white/10 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 'text-slate-500 hover:text-slate-200'">
        
        <Icon :name="tab.icon" class="w-6 h-6 transition-transform duration-300 group-hover:scale-110" 
              :class="{'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]': modelValue === tab.id}"/>
        
        <!-- Tooltip -->
        <span class="absolute left-full ml-4 bg-black/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-50 shadow-xl translate-x-2 group-hover:translate-x-0 duration-200">
            {{ tab.label }}
        </span>
      </button>

      <div class="flex-1"></div>

      <button @click="showLogoutModal = true"
        class="relative group flex items-center justify-center p-3 rounded-md transition-all duration-300 hover:bg-red-500/10 w-12 h-12 text-red-400 hover:text-red-300">
        
        <Icon name="lucide:log-out" class="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        
        <!-- Tooltip -->
        <span class="absolute left-full ml-4 bg-black/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-50 shadow-xl translate-x-2 group-hover:translate-x-0 duration-200">
            Déconnexion
        </span>
      </button>

      <UiModal :show="showLogoutModal" title="Déconnexion" @close="showLogoutModal = false">
        <div class="text-center space-y-4">
            <p class="text-slate-300">Voulez-vous vraiment vous déconnecter ?</p>
            <div class="flex gap-3 justify-center">
                <UiButton @click="showLogoutModal = false">Annuler</UiButton>
                <UiButton @click="confirmLogout" variant="danger">Se déconnecter</UiButton>
            </div>
        </div>
      </UiModal>
    </aside>
</template>