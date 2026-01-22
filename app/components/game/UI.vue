<script setup lang="ts">
const props = defineProps<{
  modelValue: string // currentTab
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// On garde la liste des tabs ici pour le titre, mais on pourrait aussi la déplacer dans un composable partagé si besoin
const tabs = [
  { id: 'home', label: 'Taverne', icon: 'lucide:home' },
  { id: 'dungeon', label: 'Donjon', icon: 'lucide:swords' },
  { id: 'inventory', label: 'Inventaire', icon: 'lucide:backpack' },
  { id: 'skills', label: 'Talents', icon: 'lucide:zap' },
  { id: 'shop', label: 'Boutique', icon: 'lucide:store' },
  { id: 'profile', label: 'Profil', icon: 'lucide:user' },
  { id: 'settings', label: 'Menu', icon: 'lucide:settings' },
]

const currentTabLabel = computed(() => tabs.find(t => t.id === props.modelValue)?.label || 'Jeu')

// Liste des onglets où on veut cacher le HUD (Header/Footer) pour une vue plus "Système"
const hideHudTabs = ['settings', 'profile'] 
const showHud = computed(() => !hideHudTabs.includes(props.modelValue))
</script>

<template>
    <div class="flex-1 flex overflow-hidden relative p-4 gap-4 h-full animate-fade-in">
    
    <!-- Background Image / Gradient -->
    <div class="absolute inset-0 bg-slate-900 -z-20"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-amber-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

    <!-- Left Sidebar (Navigation) -->
    <GameSidebar :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" />

    <!-- Main Layout Column -->
    <div class="flex-1 flex flex-col min-w-0 relative z-10 gap-4">
        
        <!-- Header (Resources HUD) -->
        <GameHeader v-if="showHud" :title="currentTabLabel" />

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden relative">
            <slot />
        </div>

        <!-- Footer (Floating Bar) -->
        <GameFooter v-if="showHud" />

    </div>
    </div>
</template>