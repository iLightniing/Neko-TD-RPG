import { defineStore } from 'pinia'
import { UPGRADES } from '~/data/upgrades'

export const useGameStore = defineStore('game', {
  state: () => ({
    gold: 0,
    inventory: {} as Record<string, number>,
    level: 1,
    monsterHealth: 100,
    monsterMaxHealth: 100,
    // Stats du joueur et du monstre pour le tour par tour
    playerHealth: 100,
    playerMaxHealth: 100,
    monsterAttackDamage: 5,
    combatLog: [] as string[], // Nouveau : Journal de combat
    // Stats du héros (RPG)
    playerLevel: 1,
    playerXp: 0,
    playerMaxXp: 100,
    playerMana: 100,
    playerMaxMana: 100,
    // Stats primaires
    playerStrength: 5,
    playerAgility: 5,
    playerIntelligence: 5,
    playerVitality: 5,
    playerLuck: 5,
    playerDefense: 0,
  }),
  
  getters: {
    currentGoldPerClick: (state) => {
      let power = 1
      UPGRADES.filter(u => u.type === 'click').forEach(u => {
        power += (state.inventory[u.id] || 0) * u.power
      })
      return power
    },
    currentGoldPerSecond: (state) => {
      let power = 0
      UPGRADES.filter(u => u.type === 'passive').forEach(u => {
        power += (state.inventory[u.id] || 0) * u.power
      })
      return power
    }
  },

  actions: {
    // Helper pour calculer le coût n'importe où (UI ou logique)
    getUpgradeCost(upgradeId: string) {
      const upgrade = UPGRADES.find(u => u.id === upgradeId)
      if (!upgrade) return 0
      const count = this.inventory[upgradeId] || 0
      return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, count))
    },

    addToLog(message: string) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        this.combatLog.unshift(`[${time}] ${message}`) // Ajoute au début pour voir le dernier en haut
        if (this.combatLog.length > 30) this.combatLog.pop() // Limite la taille
    },

    handleMainClick() {
      // Tour du Joueur
      const dmg = this.currentGoldPerClick
      this.monsterHealth -= dmg
      this.addToLog(`⚔️ Vous attaquez : -${dmg} PV`)

      if (this.monsterHealth <= 0) {
        this.nextMonster()
        return
      }

      // Tour du Monstre (Riposte)
      this.playerHealth -= this.monsterAttackDamage
      this.addToLog(`🛡️ Le monstre riposte : -${this.monsterAttackDamage} PV`)
      
      if (this.playerHealth <= 0) {
        this.handlePlayerDeath()
      }
    },

    handlePlayerDeath() {
      this.addToLog(`💀 Vous êtes mort ! Retour au niveau précédent.`)
      // Pénalité : On recule d'un niveau (min 1) et on soigne tout le monde
      this.level = Math.max(1, this.level - 1)
      this.nextMonster(true) // true = reset du niveau actuel
    },

    gainXp(amount: number) {
        this.playerXp += amount
        if (this.playerXp >= this.playerMaxXp) {
            this.playerLevel++
            this.playerXp -= this.playerMaxXp
            this.playerMaxXp = Math.floor(this.playerMaxXp * 1.5)
            
            // Bonus de niveau : Soin complet + Augmentation stats
            this.playerMaxHealth += 20
            this.playerHealth = this.playerMaxHealth
            this.playerMaxMana += 10
            this.playerMana = this.playerMaxMana
            
            this.addToLog(`🆙 NIVEAU SUPÉRIEUR ! Vous êtes niveau ${this.playerLevel}`)
        }
    },

    nextMonster(reset = false) {
      if (!reset) {
          this.level++
          this.addToLog(`✨ Victoire ! Niveau ${this.level} atteint.`)
          this.gainXp(this.level * 10) // Gain d'XP basé sur le niveau du monstre
      }
      
      // Formule scalable : PV augmentent de 15% par niveau
      this.monsterMaxHealth = Math.floor(100 * Math.pow(1.15, this.level))
      this.monsterHealth = this.monsterMaxHealth
      this.monsterAttackDamage = Math.floor(5 * Math.pow(1.1, this.level))
      
      // Récompense et Soin partiel
      if (!reset) {
          const reward = this.level * 10
          this.gold += reward
          this.addToLog(`💰 Récompense : +${reward} Or`)
      }
      this.playerHealth = Math.min(this.playerHealth + 20, this.playerMaxHealth)
    },

    buyUpgrade(upgradeId: string) {
      const cost = this.getUpgradeCost(upgradeId)
      const upgrade = UPGRADES.find(u => u.id === upgradeId)

      if (this.gold >= cost) {
        this.gold -= cost
        this.inventory[upgradeId] = (this.inventory[upgradeId] || 0) + 1
        if(upgrade) this.addToLog(`🔨 Amélioration : ${upgrade.name} (Niv. ${this.inventory[upgradeId]})`)
      }
    },

    generatePassiveIncome() {
      // Divisé par 10 car la loop tourne à 100ms (10 ticks/sec)
      const value = this.currentGoldPerSecond / 10
      if (value > 0) {
        this.gold += value
        // En tour par tour, le passif ne blesse plus le monstre, c'est juste de l'or
      }
      
      // Régénération de Mana (1% par tick de 100ms = 10% par seconde)
      if (this.playerMana < this.playerMaxMana) {
          this.playerMana = Math.min(this.playerMaxMana, this.playerMana + (this.playerMaxMana * 0.01))
      }
    },

    saveGame() {
      const saveState = {
        gold: this.gold,
        inventory: this.inventory,
        level: this.level,
        playerHealth: this.playerHealth,
        playerLevel: this.playerLevel,
        playerXp: this.playerXp,
        playerMaxXp: this.playerMaxXp,
        playerMana: this.playerMana,
        playerMaxMana: this.playerMaxMana,
        playerStrength: this.playerStrength,
        playerAgility: this.playerAgility,
        playerIntelligence: this.playerIntelligence,
        playerVitality: this.playerVitality,
        playerLuck: this.playerLuck,
        playerDefense: this.playerDefense
      }
      localStorage.setItem('rpg_save', JSON.stringify(saveState))
    },

    loadGame() {
      const saved = localStorage.getItem('rpg_save')
      if (saved) {
        const parsed = JSON.parse(saved)
        this.gold = parsed.gold || 0
        this.inventory = parsed.inventory || {}
        this.level = parsed.level || 1
        this.playerHealth = parsed.playerHealth || 100
        this.playerLevel = parsed.playerLevel || 1
        this.playerXp = parsed.playerXp || 0
        this.playerMaxXp = parsed.playerMaxXp || 100
        this.playerMana = parsed.playerMana || 100
        this.playerMaxMana = parsed.playerMaxMana || 100
        this.playerStrength = parsed.playerStrength || 5
        this.playerAgility = parsed.playerAgility || 5
        this.playerIntelligence = parsed.playerIntelligence || 5
        this.playerVitality = parsed.playerVitality || 5
        this.playerLuck = parsed.playerLuck || 5
        this.playerDefense = parsed.playerDefense || 0
        // On recalcule la vie du monstre en fonction du niveau chargé
        this.monsterMaxHealth = Math.floor(100 * Math.pow(1.15, this.level))
        this.monsterHealth = this.monsterMaxHealth
        this.monsterAttackDamage = Math.floor(5 * Math.pow(1.1, this.level))
        this.addToLog("📂 Partie chargée.")
      }
    }
  }
})