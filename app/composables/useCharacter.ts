import { ref } from 'vue'

export const useCharacter = () => {
    const { pb, user } = useAuth()
    // const { notify } = useNotification() // À décommenter si vous avez ce composable
    const character = useState<any>('current_character', () => null)
    const characters = useState<any[]>('user_characters', () => [])

    // Récupérer TOUS les personnages de l'utilisateur
    const fetchAllCharacters = async () => {
        if (!user.value) return []
        console.log("Chargement des personnages pour l'utilisateur:", user.value.id)
        try {
            const records = await pb.collection('characters').getFullList({
                filter: `user="${user.value.id}"`,
                sort: '-created'
            })
            console.log("Personnages trouvés:", records)
            characters.value = records
            return records
        } catch (e) {
            console.error("Erreur chargement personnages:", e)
            return []
        }
    }

    const selectCharacter = (char: any) => {
        character.value = char
    }

    const deleteCharacter = async (id: string) => {
        try {
            await pb.collection('characters').delete(id)
            characters.value = characters.value.filter(c => c.id !== id)
        } catch (e) {
            console.error("Erreur suppression personnage:", e)
            throw e
        }
    }

    // Créer un nouveau personnage
    const createCharacter = async (pseudo: string, className: string, initialStats?: Record<string, number>) => {
        console.log("Tentative de création de personnage...", { pseudo, className, userId: user.value?.id })
        
        if (!user.value) {
            console.error("Utilisateur non connecté !")
            return
        }
        
        // Données initiales selon la classe
        // Si des stats sont fournies (depuis la DB/Selection), on les utilise, sinon fallback
        const stats = initialStats || {
            strength: className === 'warrior' ? 5 : 1,
            intelligence: className === 'mage' ? 5 : 1,
            agility: className === 'rogue' ? 5 : 1,
        }

        const initialData = {
            inventory: {},
            upgrades: {},
            stats: stats
        }

        try {
            const record = await pb.collection('characters').create({
                user: user.value.id,
                pseudo: pseudo,
                class: className,
                level: 1,
                gold: 0,
                data: initialData
            })
            character.value = record
            // notify(`Personnage ${pseudo} créé !`, 'success')
            return record
        } catch (e: any) {
            console.error("Erreur création personnage:", e)
            // Affiche les détails précis de l'erreur de validation (ex: quel champ est refusé)
            if (e.response && e.response.data) {
                console.error("Détails validation PocketBase:", e.response.data)
            }
            // notify('Erreur lors de la création du personnage', 'error')
            throw e
        }
    }

    return {
        character,
        characters,
        fetchAllCharacters,
        selectCharacter,
        deleteCharacter,
        createCharacter
    }
}