import PocketBase from 'pocketbase'

// ⚠️ URL du serveur PocketBase local
const pb = new PocketBase('http://127.0.0.1:8090')

export const useAuth = () => {
    const user = ref(pb.authStore.model)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Synchroniser l'état de l'utilisateur
    pb.authStore.onChange((token, model) => {
        user.value = model
    })

    const login = async (email: string, password: string) => {
        isLoading.value = true
        error.value = null
        try {
            await pb.collection('users').authWithPassword(email, password)
        } catch (e: any) {
            error.value = "Email ou mot de passe incorrect."
            throw e
        } finally {
            isLoading.value = false
        }
    }

    const register = async (email: string, password: string, passwordConfirm: string) => {
        isLoading.value = true
        error.value = null
        try {
            await pb.collection('users').create({
                email,
                password,
                passwordConfirm,
                emailVisibility: true
            })
            // Connexion automatique après inscription
            await login(email, password)
        } catch (e: any) {
            error.value = "Erreur lors de l'inscription. Vérifiez les données."
            throw e
        } finally {
            isLoading.value = false
        }
    }

    const logout = () => {
        pb.authStore.clear()
    }

    return {
        pb,
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: computed(() => !!user.value)
    }
}