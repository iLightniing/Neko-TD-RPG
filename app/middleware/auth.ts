export default defineNuxtRouteMiddleware(async (to, from) => {
    const { isAuthenticated } = useAuth()
    const { character } = useCharacter()
    
    // 1. Vérification Auth basique
    if (!isAuthenticated.value) {
        if (!to.path.startsWith('/auth')) {
            return navigateTo('/auth/login')
        }
        return
    }

    // 2. Si on est connecté et qu'on essaie d'aller sur les pages d'auth -> Selection
    if (to.path.startsWith('/auth')) {
        return navigateTo('/character/selection')
    }

    // 3. Protection du Jeu : Il faut avoir sélectionné un personnage
    // Si on va sur le jeu (/) sans personnage sélectionné -> Selection
    if (to.path === '/' && !character.value) {
        return navigateTo('/character/selection')
    }
})