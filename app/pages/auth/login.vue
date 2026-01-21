<script setup lang="ts">
definePageMeta({
    layout: 'auth',
    pageTransition: {
        name: 'page',
        mode: 'out-in'
    }
})

const { login, error, isLoading } = useAuth()
const email = ref('')
const password = ref('')
const rememberEmail = ref(false)

// Effacer le message d'erreur dès que l'utilisateur modifie un champ
watch([email, password], () => {
    if (error.value) error.value = ''
})

// Charger l'email sauvegardé au montage
onMounted(() => {
    const saved = localStorage.getItem('loopbreaker_saved_email')
    if (saved) {
        email.value = saved
        rememberEmail.value = true
    }
})

const handleLogin = async () => {
    if (!email.value || !password.value) {
        error.value = "Veuillez remplir tous les champs."
        return
    }

    // Gestion de la sauvegarde de l'email
    if (rememberEmail.value) {
        localStorage.setItem('loopbreaker_saved_email', email.value)
    } else {
        localStorage.removeItem('loopbreaker_saved_email')
    }

    try {
        await login(email.value, password.value)
        navigateTo('/')
    } catch (e) {}
}
</script>

<template>
    <form @submit.prevent="handleLogin" class="space-y-4" novalidate>
        <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <Icon name="lucide:alert-circle" class="w-4 h-4"/> {{ error }}
        </div>

        <UiInput v-model="email" label="Email" type="email" placeholder="heros@loopbreaker.com" icon="lucide:mail" required />
        <div class="-mt-2">
            <UiCheckbox v-model="rememberEmail" label="Se souvenir de l'email" />
        </div>
        
        <UiInput v-model="password" label="Mot de passe" type="password" placeholder="••••••••" icon="lucide:lock" required />

        <div class="flex justify-end">
            <NuxtLink to="/auth/forgot-password" class="text-xs text-slate-500 hover:text-slate-300 transition-colors">Mot de passe oublié ?</NuxtLink>
        </div>

        <button type="submit" :disabled="isLoading"
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
            <Icon v-if="isLoading" name="lucide:loader-2" class="animate-spin" />
            <span>{{ isLoading ? 'Connexion...' : 'Se connecter' }}</span>
        </button>

        <div class="text-center text-sm text-slate-400 mt-4">
            Pas encore de compte ? 
            <NuxtLink to="/auth/register" class="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Créer un compte</NuxtLink>
        </div>
    </form>
</template>