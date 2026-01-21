<script setup lang="ts">
import ClassSelection from '~/components/character/creation/ClassSelection.vue'
import CharacterCreationPreview from '~/components/character/creation/CharacterCreationPreview.vue'
import ClassDetails from '~/components/character/creation/ClassDetails.vue'

definePageMeta({
    layout: 'auth',
    middleware: 'auth'
})

const { createCharacter } = useCharacter()
const { classes, fetchClasses, getClassImage } = useGameClasses()
const pseudo = ref('')
const selectedClassId = ref<string | null>(null)
const isLoading = ref(false)
const isFetchingClasses = ref(true)

const selectedClass = computed(() => classes.value.find(c => c.id === selectedClassId.value) ?? classes.value[0])

const handleCreate = async () => {
    if (!pseudo.value) return
    if (!selectedClass.value) return // Sécurité supplémentaire
    isLoading.value = true
    try {
        // IMPORTANT : On utilise 'key' (warrior/rogue/mage) s'il existe (mode DB), sinon 'id' (mode local)
        const classKey = selectedClass.value.key || selectedClass.value.id
        await createCharacter(pseudo.value, classKey, selectedClass.value?.stats)
        navigateTo('/character/selection')
    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

// Electron drag region helper
const isElectron = ref(false)
onMounted(async () => {
    if ((window as any).electronAPI) isElectron.value = true

    // Chargement dynamique des classes depuis PocketBase
    await fetchClasses()
    isFetchingClasses.value = false
    
    if (classes.value.length > 0) {
        selectedClassId.value = classes.value[0].id
    }
})
</script>

<template>
    <div class="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
        
        <!-- Drag Region for Electron -->
        <div v-if="isElectron" class="absolute top-0 left-0 right-0 h-8 z-50 app-drag-region"></div>

        <!-- Background Layer -->
        <div class="absolute inset-0 pointer-events-none">
            <Transition name="fade-slow" mode="out-in">
                <div :key="selectedClassId || 'bg'" 
                     class="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] ease-out scale-105"
                     :style="{ backgroundImage: getClassImage(selectedClass) ? `url(${getClassImage(selectedClass)})` : undefined, opacity: 0.15 }">
                     <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/90"></div>
                </div>
            </Transition>
            <!-- Grid Overlay -->
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <!-- Main Content Grid -->
        <div v-if="isFetchingClasses" class="relative z-10 flex h-full w-full items-center justify-center">
            <div class="flex flex-col items-center gap-4">
                <Icon name="lucide:loader-2" class="animate-spin size-10 text-indigo-500" />
                <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Chargement des classes...</p>
            </div>
        </div>
        <div v-else class="relative z-10 flex h-full w-full max-w-[1600px] mx-auto p-6 lg:p-12 gap-12">
            
            <!-- Left Column: Navigation & Class Selection -->
            <ClassSelection 
                :classes="classes" 
                :selected-class-id="selectedClassId || ''"
                @select="selectedClassId = $event"
            />

            <!-- Center Column: Character Preview & Input -->
            <CharacterCreationPreview 
                v-model:pseudo="pseudo"
                :selected-class="selectedClass"
                :is-loading="isLoading"
                @create="handleCreate"
            />

            <!-- Right Column: Stats & Details -->
            <ClassDetails :selected-class="selectedClass" />

        </div>
    </div>
</template>

<style scoped>
.app-drag-region {
    -webkit-app-region: drag;
}

/* Transitions */
.fade-slow-enter-active, .fade-slow-leave-active { transition: opacity 1s ease; }
.fade-slow-enter-from, .fade-slow-leave-to { opacity: 0; }
</style>