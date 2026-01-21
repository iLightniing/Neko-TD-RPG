// data/upgrades.ts
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number; // Ex: 1.15 (le prix augmente de 15% à chaque achat)
  type: 'click' | 'passive';
  power: number;
}

export const UPGRADES: Upgrade[] = [
  {
    id: 'wooden_sword',
    name: 'Épée en bois',
    description: 'Une branche ramassée par terre.',
    baseCost: 10,
    costMultiplier: 1.15,
    type: 'click',
    power: 1
  },
  {
    id: 'training_dummy',
    name: 'Mannequin d\'entraînement',
    description: 'Génère de l\'or passivement.',
    baseCost: 50,
    costMultiplier: 1.20,
    type: 'passive',
    power: 2
  }
]