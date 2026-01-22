<script setup lang="ts">
const game = useGameStore()
const { deleteAccount } = useAuth()
const { character } = useCharacter()
const { settings } = useSettings()
const showDeleteModal = ref(false)

// Changer de personnage (Retour à la sélection)
const changeCharacter = async () => {
    game.saveGame()
    character.value = null // Cela va aussi supprimer le localStorage grâce au watch dans useCharacter
    navigateTo('/character/selection')
}

// Fonction pour supprimer le compte
const handleDeleteAccount = async () => {
    try {
        await deleteAccount()
        // Le loader est géré dans useAuth
        // Redirection après la suppression
        await navigateTo('/auth/login')
    } catch (e) {
        // L'erreur est déjà gérée dans useAuth, on pourrait ajouter une notif ici
    } finally {
        showDeleteModal.value = false
    }
}
</script>

<template>
    <div class="max-w-4xl mx-auto h-full flex flex-col gap-6">
        <div class="flex items-center gap-3 pb-4 border-b border-white/10">
            <Icon name="lucide:settings" class="w-6 h-6 text-slate-400"/>
            <h2 class="text-xl font-black text-white uppercase tracking-widest">Paramètres</h2>
        </div>

        <UiScrollArea class="flex-1 pr-4 -mr-4">
            <div class="space-y-8">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Audio -->
                    <section class="space-y-4">
                        <h3 class="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Icon name="lucide:volume-2" class="w-4 h-4"/> Audio
                        </h3>
                        
                        <div class="space-y-6 bg-slate-900/30 p-4 rounded-lg border border-white/5">
                            <UiSlider v-model="settings.audio.master" label="Volume Global" />
                            <UiSlider v-model="settings.audio.music" label="Musique" />
                            <UiSlider v-model="settings.audio.sfx" label="Effets Sonores" />
                        </div>
                    </section>

                    <!-- Graphismes & Gameplay -->
                    <section class="space-y-4">
                        <h3 class="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Icon name="lucide:monitor" class="w-4 h-4"/> Affichage
                        </h3>
                        
                        <div class="space-y-3 bg-slate-900/30 p-4 rounded-lg border border-white/5">
                            <UiSwitch v-model="settings.graphics.particles" label="Particules" />
                            <UiSwitch v-model="settings.graphics.screenShake" label="Tremblement d'écran" />
                            <UiSwitch v-model="settings.interface.showDamageNumbers" label="Dégâts flottants" />
                        </div>
                    </section>
                </div>

                <!-- Gestion de données -->
                <section class="space-y-4 pt-4 border-t border-white/10">
                    <h3 class="text-xs font-bold text-red-500 uppercase tracking-wider mb-4">Système</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UiButton @click="game.saveGame()" block class="justify-between group bg-slate-800 hover:bg-slate-700 border-white/10">
                            <span class="flex items-center gap-3"><Icon name="lucide:save" class="w-4 h-4"/> Sauvegarder</span>
                        </UiButton>

                        <UiButton @click="changeCharacter" block class="justify-between group bg-slate-800 hover:bg-slate-700 border-white/10">
                            <span class="flex items-center gap-3"><Icon name="lucide:users" class="w-4 h-4"/> Changer de perso</span>
                        </UiButton>
                    </div>

                    <div class="pt-4 mt-4 border-t border-red-500/20">
                        <UiButton @click="showDeleteModal = true" variant="danger" block class="bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-900/20">
                            <span class="flex items-center gap-2 justify-center"><Icon name="lucide:trash-2" class="w-4 h-4"/> Supprimer le compte</span>
                        </UiButton>
                    </div>

                    <div class="text-center pt-4">
                        <p class="text-[10px] text-slate-600 font-mono">
                            ID Joueur: {{ character?.id || 'Inconnu' }} <br>
                            Version: 0.1.0-alpha
                        </p>
                    </div>
                </section>
            </div>
        </UiScrollArea>

        <!-- Modale de confirmation de suppression -->
        <UiModal :show="showDeleteModal" title="Supprimer votre compte ?" @close="showDeleteModal = false">
            <div class="text-slate-300 space-y-4">
                <p>Êtes-vous absolument certain de vouloir supprimer votre compte ?</p>
                <p class="font-bold text-red-400 bg-red-500/10 p-3 rounded-md border border-red-500/20">Cette action est irréversible. Toutes vos données, y compris vos personnages, votre progression et vos objets, seront définitivement effacées.</p>
            </div>
            <div class="flex justify-end gap-3 mt-8">
                <UiButton @click="showDeleteModal = false">Annuler</UiButton>
                <UiButton @click="handleDeleteAccount" variant="danger">
                    <Icon name="lucide:alert-triangle" class="w-4 h-4"/> Confirmer la suppression
                </UiButton>
            </div>
        </UiModal>
    </div>
</template>