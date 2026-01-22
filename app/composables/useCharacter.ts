export const useCharacter = () => {
    const { pb, user } = useAuth()
    // On utilise useState pour l'état global
    const character = useState<any>('character', () => null)
    const characters = useState<any[]>('characters_list', () => [])

    // Au chargement de l'app, on regarde s'il y a une sauvegarde dans le navigateur
    if (import.meta.client) {
        const stored = localStorage.getItem('neko_rpg_character')
        if (stored && !character.value) {
            try {
                character.value = JSON.parse(stored)
            } catch (e) {
                console.error('Erreur lors du chargement du personnage', e)
                localStorage.removeItem('neko_rpg_character')
            }
        }
    }

    // À chaque fois que 'character' change, on met à jour la sauvegarde
    watch(character, (newVal) => {
        if (import.meta.client) {
            if (newVal) {
                localStorage.setItem('neko_rpg_character', JSON.stringify(newVal))
            } else {
                localStorage.removeItem('neko_rpg_character')
            }
        }
    }, { deep: true })

    const fetchAllCharacters = async () => {
        if (!user.value) return
        try {
            const records = await pb.collection('characters').getFullList({
                sort: '-created',
                filter: `user = "${user.value.id}"`
            })
            characters.value = records
        } catch (e) {
            console.error("Impossible de récupérer les personnages :", e)
        }
    }

    const createCharacter = async (pseudo: string, classId: string, stats: any) => {
        if (!user.value) throw new Error("Utilisateur non connecté")
        
        // Récupérer les stats de base de la classe pour l'initialisation
        const { getClassInfo, fetchClasses } = useGameClasses()
        await fetchClasses() // S'assure que les classes sont chargées
        const classInfo = getClassInfo(classId)
        const startingStats = (stats && Object.keys(stats).length > 0) ? stats : (classInfo?.stats || {})

        const newCharacter = {
            user: user.value.id,
            pseudo: pseudo,
            class: classId,
            level: 1,
            xp: 0,
            gold: 0,
            stats: startingStats,
            equipment: {},
            inventory: []
        }

        return await pb.collection('characters').create(newCharacter)
    }

    const selectCharacter = (char: any) => {
        character.value = char
    }

    const deleteCharacter = async (id: string) => {
        await pb.collection('characters').delete(id)
        characters.value = characters.value.filter(c => c.id !== id)
        if (character.value?.id === id) {
            character.value = null
        }
    }

    return {
        character,
        characters,
        fetchAllCharacters,
        createCharacter,
        selectCharacter,
        deleteCharacter
    }
}