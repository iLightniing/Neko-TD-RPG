export const useSettings = () => {
    // État par défaut
    const settings = useState('game_settings', () => ({
        audio: {
            master: 50,
            music: 30,
            sfx: 50,
        },
        graphics: {
            particles: true, // Afficher les particules de clic
            screenShake: true, // Tremblement d'écran lors des coups
        },
        interface: {
            showDamageNumbers: true, // Afficher les chiffres flottants
        }
    }))

    // Initialisation depuis le localStorage (côté client uniquement)
    if (import.meta.client) {
        const stored = localStorage.getItem('neko_rpg_settings')
        if (stored) {
            try {
                // On fusionne pour éviter les erreurs si on ajoute de nouvelles options plus tard
                const parsed = JSON.parse(stored)
                settings.value = {
                    audio: { ...settings.value.audio, ...parsed.audio },
                    graphics: { ...settings.value.graphics, ...parsed.graphics },
                    interface: { ...settings.value.interface, ...parsed.interface },
                }
            } catch (e) {
                console.error('Erreur chargement settings', e)
            }
        }

        // Sauvegarde automatique à chaque changement
        watch(settings, (newVal) => {
            localStorage.setItem('neko_rpg_settings', JSON.stringify(newVal))
        }, { deep: true })
    }

    return {
        settings
    }
}