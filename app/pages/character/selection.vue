<script setup lang="ts">
import CharacterList from '~/components/character/selection/CharacterList.vue'
import CharacterPreview from '~/components/character/selection/CharacterPreview.vue'
import CharacterStats from '~/components/character/selection/CharacterStats.vue'

definePageMeta({
    layout: 'auth',
    middleware: 'auth',
    pageTransition: { name: 'page', mode: 'out-in' }
})

const { fetchAllCharacters, characters, selectCharacter, deleteCharacter } = useCharacter()
const { fetchClasses, getClassImage } = useGameClasses()
const { logout } = useAuth()
const isLoading = ref(true)
const selectedCharId = ref<string | null>(null)
const showDeleteModal = ref(false)
const isElectron = ref(false)

onMounted(async () => {
    if ((window as any).electronAPI) isElectron.value = true

    // 1. Charger les métadonnées des classes (via le composable optimisé)
    await fetchClasses()

    // 2. Charger les personnages
    await fetchAllCharacters()
    isLoading.value = false
    
    if (characters.value.length > 0) {
        selectedCharId.value = characters.value[0].id
    }
})

const selectedCharacter = computed(() => characters.value.find(c => c.id === selectedCharId.value))

const playCharacter = () => {
    const char = characters.value.find(c => c.id === selectedCharId.value)
    if (!char) return
    selectCharacter(char)
    navigateTo('/')
}

const handleDelete = () => {
    if (!selectedCharId.value) return
    showDeleteModal.value = true
}

const confirmDelete = async () => {
    if (selectedCharId.value) {
        await deleteCharacter(selectedCharId.value)
        // Resélectionner un autre perso ou null
        selectedCharId.value = characters.value.length > 0 ? characters.value[0].id : null
    }
    showDeleteModal.value = false
}
</script>

<template>
    <div class="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
        
        <!-- Drag Region (Inside root) -->
        <div v-if="isElectron" class="absolute top-0 left-0 right-0 h-8 z-50 app-drag-region"></div>

        <!-- Background Layer (Inside root) -->
        <div class="absolute inset-0 pointer-events-none">
            <Transition name="fade-slow" mode="out-in">
                <div :key="selectedCharId || 'bg'" 
                     class="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] ease-out scale-105"
                     :style="{ backgroundImage: getClassImage(selectedCharacter) ? `url(${getClassImage(selectedCharacter)})` : undefined, opacity: 0.15 }">
                     <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/90"></div>
                </div>
            </Transition>
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <!-- Main Content Grid (Inside root) -->
        <div class="relative z-10 flex flex-col md:flex-row h-full w-full max-w-[1600px] mx-auto p-6 lg:p-12 gap-4 lg:gap-12">
            
            <!-- Left Column: Character List -->
            <CharacterList 
                :characters="characters" 
                :selected-id="selectedCharId"
                @select="selectedCharId = $event"
                @create="navigateTo('/character/creation')"
                @delete="handleDelete"
                @play="playCharacter"
                @logout="logout(); navigateTo('/auth/login')"
            />

            <!-- Center Column: Preview -->
            <CharacterPreview 
                :character="selectedCharacter"
                @play="playCharacter"
            />

            <!-- Right Column: Stats & Details -->
            <CharacterStats 
                :character="selectedCharacter"
                @delete="handleDelete"
            />

        </div>

        <!-- Delete Modal (Inside root) -->
        <UiModal :show="showDeleteModal" title="Supprimer le personnage ?" @close="showDeleteModal = false">
            <p class="text-slate-300 mb-6">Voulez-vous vraiment supprimer ce personnage ? Cette action est irréversible.</p>
            <div class="flex gap-3">
                <UiButton @click="showDeleteModal = false" class="flex-1">Annuler</UiButton>
                <UiButton @click="confirmDelete" variant="danger" class="flex-1">Supprimer</UiButton>
            </div>
        </UiModal>
    </div>
</template>