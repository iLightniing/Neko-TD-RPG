import PocketBase from 'pocketbase'

// ⚠️ URL du serveur PocketBase local
const pb = new PocketBase('http://127.0.0.1:8090')

export const useAuth = () => {
    const user = ref(pb.authStore.model)
    const { startLoading, stopLoading } = useLoader()
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Synchroniser l'état de l'utilisateur
    pb.authStore.onChange((token, model) => {
        user.value = model
    })

    const login = async (email: string, password: string) => {
        startLoading('Connexion au royaume...')
        isLoading.value = true
        error.value = null
        try {
            // Délai artificiel pour l'effet "Jeu Vidéo" (1 seconde minimum)
            await new Promise(resolve => setTimeout(resolve, 1000))
            const authData = await pb.collection('users').authWithPassword(email, password)
            
            // Vérification du statut vérifié
            if (!authData.record.verified) {
                pb.authStore.clear()
                throw new Error("Veuillez vérifier votre email pour activer votre compte.")
            }
        } catch (e: any) {
            error.value = e.message || "Email ou mot de passe incorrect."
            throw e
        } finally {
            isLoading.value = false
            stopLoading()
        }
    }

    const register = async (email: string, password: string, passwordConfirm: string) => {
        startLoading('Création de votre légende...')
        isLoading.value = true
        error.value = null
        try {
            await pb.collection('users').create({
                email,
                password,
                passwordConfirm,
                emailVisibility: true
            })
            // Demande d'envoi du mail de vérification
            await pb.collection('users').requestVerification(email)
        } catch (e: any) {
            error.value = "Erreur lors de l'inscription. Vérifiez les données."
            throw e
        } finally {
            isLoading.value = false
            stopLoading()
        }
    }

    const logout = async () => {
        startLoading('Déconnexion...')
        try {
            pb.authStore.clear()
            // Petit délai pour l'effet visuel de déconnexion
            await new Promise(resolve => setTimeout(resolve, 1000))
        } finally {
            stopLoading()
        }
    }

    const deleteAccount = async () => {
        if (!user.value) return

        startLoading('Suppression de votre compte...')
        try {
            // Ceci supprime l'utilisateur et toutes les données liées si la cascade est activée dans PocketBase.
            await pb.collection('users').delete(user.value.id)
            pb.authStore.clear() // Nettoie la session locale immédiatement
        } catch (e: any) {
            console.error("Erreur lors de la suppression du compte:", e)
            error.value = "Une erreur est survenue lors de la suppression du compte."
            throw e
        } finally {
            stopLoading()
        }
    }

    const confirmEmail = async (token: string) => {
        startLoading('Validation du compte...')
        try {
            await pb.collection('users').confirmVerification(token)
            return true
        } catch (e) {
            console.error(e)
            return false
        } finally {
            stopLoading()
        }
    }

    return {
        pb,
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        deleteAccount,
        confirmEmail,
        isAuthenticated: computed(() => !!user.value)
    }
}