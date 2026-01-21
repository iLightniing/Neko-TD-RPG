<script setup lang="ts">
definePageMeta({
    layout: 'auth',
    pageTransition: {
        name: 'page',
        mode: 'out-in'
    }
})

const { pb } = useAuth()
const email = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const error = ref('')

const handleReset = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
        error.value = "Veuillez entrer une adresse email valide."
        return
    }
    isLoading.value = true
    error.value = ''
    successMessage.value = ''
    try {
        await pb.collection('users').requestPasswordReset(email.value)
        successMessage.value = "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé."
    } catch (e) {
        error.value = "Une erreur est survenue. Veuillez réessayer."
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <form @submit.prevent="handleReset" class="space-y-4" novalidate>
        <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <Icon name="lucide:alert-circle" class="w-4 h-4"/> {{ error }}
        </div>
        <div v-if="successMessage" class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
            <Icon name="lucide:check-circle" class="w-4 h-4"/> {{ successMessage }}
        </div>

        <UiInput v-model="email" label="Email" type="email" placeholder="heros@loopbreaker.com" icon="lucide:mail" required />

        <button type="submit" :disabled="isLoading"
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
            <Icon v-if="isLoading" name="lucide:loader-2" class="animate-spin" />
            <span>{{ isLoading ? 'Envoi...' : 'Réinitialiser le mot de passe' }}</span>
        </button>

        <div class="text-center text-sm text-slate-400 mt-4">
            <NuxtLink to="/auth/login" class="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Retour à la connexion</NuxtLink>
        </div>
    </form>
</template>