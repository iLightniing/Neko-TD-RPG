import knightImg from '~/assets/images/characters/knight.png'
import rogueImg from '~/assets/images/characters/rogue.png'
import wizardImg from '~/assets/images/characters/wizard.png'

export const useGameClasses = () => {
    const { pb } = useAuth()
    // Utilisation de useState pour mettre en cache les classes entre les pages (Selection <-> Creation)
    const classes = useState<any[]>('game_classes', () => [])

    // Données de secours (Fallback) si la BDD est vide ou inaccessible
    const defaultClasses = [
        { 
            id: 'warrior', 
            key: 'warrior',
            name: 'Guerrier', 
            icon: 'lucide:sword', 
            desc: 'Un combattant redoutable qui écrase ses ennemis par la force brute. Sa résistance exceptionnelle lui permet de survivre aux assauts les plus violents.',
            color: 'text-red-500',
            bg: 'bg-red-500',
            stats: { strength: 8, agility: 3, intelligence: 2, defense: 9 },
            evolution: ['Paladin', 'Berserker']
        },
        { 
            id: 'rogue', 
            key: 'rogue',
            name: 'Voleur', 
            icon: 'lucide:swords', 
            desc: 'Un maître de la furtivité et de la précision. Il frappe les points vitaux de ses adversaires avant de disparaître dans les ombres.',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500',
            stats: { strength: 4, agility: 9, intelligence: 3, defense: 4 },
            evolution: ['Assassin', 'Ombre']
        },
        { 
            id: 'mage', 
            key: 'mage',
            name: 'Mage', 
            icon: 'lucide:wand-2', 
            desc: 'Un érudit des arts arcaniques capable de déchaîner les éléments. Sa puissance destructrice est sans égale, mais il reste fragile.',
            color: 'text-blue-500',
            bg: 'bg-blue-500',
            stats: { strength: 2, agility: 4, intelligence: 10, defense: 2 },
            evolution: ['Archimage', 'Nécromancien']
        }
    ]

    const fetchClasses = async () => {
        if (classes.value.length > 0) return
        try {
            const records = await pb.collection('classes').getFullList({ sort: 'name' })
            console.log("Classes chargées depuis PocketBase:", records)
            if (records && records.length > 0) {
                classes.value = records
            } else {
                console.warn("Aucune classe trouvée en BDD (Collection vide ?), utilisation du fallback.")
                classes.value = defaultClasses
            }
        } catch (e: any) {
            console.error("Erreur chargement classes (fallback activé):", e.message)
            if (e.status === 403) console.error("👉 ERREUR 403 : Vérifie tes API Rules dans PocketBase (List/Search doit être public ou accessible).")
            if (e.status === 404) console.error("👉 ERREUR 404 : La collection 'classes' est introuvable (Vérifie le nom exact).")
            classes.value = defaultClasses
        }
    }

    const getClassInfo = (key: string) => classes.value.find(c => c.key === key || c.id === key)

    const getClassImage = (charOrClass: any) => {
        if (!charOrClass) return undefined
        const key = charOrClass.class || charOrClass.key || charOrClass.id
        const cls = getClassInfo(key)
        
        // Priorité à l'image en BDD
        if (cls?.collectionId && cls?.image) {
            return pb.files.getURL(cls, cls.image)
        }
        
        // Fallback local
        if (key === 'warrior' || cls?.key === 'warrior') return knightImg
        if (key === 'rogue' || cls?.key === 'rogue') return rogueImg
        if (key === 'mage' || cls?.key === 'mage') return wizardImg
        return undefined
    }

    const getClassName = (charOrClass: any) => {
        if (!charOrClass) return ''
        const key = charOrClass.class || charOrClass.key || charOrClass.id
        return getClassInfo(key)?.name || key
    }

    const getClassBg = (charOrClass: any) => {
        if (!charOrClass) return 'bg-slate-500'
        const key = charOrClass.class || charOrClass.key || charOrClass.id
        return getClassInfo(key)?.bg || 'bg-slate-500'
    }

    return { classes, fetchClasses, getClassImage, getClassName, getClassBg }
}