export interface Upgrade {
    id: string
    name: string
    type: 'click' | 'auto'
    power: number
    baseCost: number
    costMultiplier: number
}

export const UPGRADES: Upgrade[] = [
    // Améliorations de Clic (Dégâts directs)
    {
        id: 'u_click_1',
        name: 'Poings nus',
        type: 'click',
        power: 1,
        baseCost: 10,
        costMultiplier: 1.5
    },
    {
        id: 'u_click_2',
        name: 'Gants de cuir',
        type: 'click',
        power: 3,
        baseCost: 50,
        costMultiplier: 1.5
    },
    {
        id: 'u_click_3',
        name: 'Dague rouillée',
        type: 'click',
        power: 8,
        baseCost: 250,
        costMultiplier: 1.5
    },
    {
        id: 'u_click_4',
        name: 'Épée courte',
        type: 'click',
        power: 20,
        baseCost: 1000,
        costMultiplier: 1.5
    },

    // Améliorations Automatiques (Revenus passifs / Dégâts par seconde)
    {
        id: 'u_auto_1',
        name: 'Rat domestique',
        type: 'auto',
        power: 1,
        baseCost: 15,
        costMultiplier: 1.2
    },
    {
        id: 'u_auto_2',
        name: 'Esclave Gobelin',
        type: 'auto',
        power: 5,
        baseCost: 100,
        costMultiplier: 1.2
    },
    {
        id: 'u_auto_3',
        name: 'Squelette',
        type: 'auto',
        power: 15,
        baseCost: 500,
        costMultiplier: 1.2
    }
]