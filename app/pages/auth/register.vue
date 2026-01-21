<script setup lang="ts">
definePageMeta({
    layout: 'auth',
    pageTransition: {
        name: 'page',
        mode: 'out-in'
    }
})

const { register, error, isLoading } = useAuth()
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

// Effacer le message d'erreur dès que l'utilisateur modifie un champ
watch([email, password, passwordConfirm], () => {
    if (error.value) error.value = ''
})

const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
        error.value = "Veuillez entrer une adresse email valide."
        return
    }
    if (password.value.length < 8) {
        error.value = "Le mot de passe doit contenir au moins 8 caractères."
        return
    }
    if (password.value !== passwordConfirm.value) {
        error.value = "Les mots de passe ne correspondent pas."
        return
    }
    try {
        await register(email.value, password.value, passwordConfirm.value)
        navigateTo('/')
    } catch (e) {}
}
</script>

<template>
    <form @submit.prevent="handleRegister" class="space-y-4" novalidate>
        <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <Icon name="lucide:alert-circle" class="w-4 h-4"/> {{ error }}
        </div>

        <UiInput v-model="email" label="Email" type="email" placeholder="heros@loopbreaker.com" icon="lucide:mail" required />

        <UiInput v-model="password" label="Mot de passe" type="password" placeholder="••••••••" icon="lucide:lock" required />
        <UiInput v-model="passwordConfirm" label="Confirmation" type="password" placeholder="••••••••" icon="lucide:lock" required />

        <button type="submit" :disabled="isLoading"
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
            <Icon v-if="isLoading" name="lucide:loader-2" class="animate-spin" />
            <span>{{ isLoading ? 'Création...' : 'S\'inscrire' }}</span>
        </button>

        <div class="text-center text-sm text-slate-400 mt-4">
            Déjà un compte ? 
            <NuxtLink to="/auth/login" class="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Se connecter</NuxtLink>
        </div>
    </form>
</template>