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
    maxLevel: 1, // Niveau maximum atteint (pour débloquer les chapitres)
    playerHealth: 100,
    monsterAttackDamage: 5,
    combatLog: [] as string[], // Nouveau : Journal de combat
    // Stats du héros (RPG)
    playerLevel: 1,
    playerXp: 0,
    playerMaxXp: 100,
    playerMana: 100,
    // Stats primaires
    playerStrength: 5,
    playerAgility: 5,
    playerIntelligence: 5,
    playerVitality: 5,
    playerLuck: 5,
    playerDefense: 0,
    // Auto-Combat & Vitesse
    autoCombatActive: false,
    combatSpeed: 1,
    autoCombatTimer: 0,
    isDead: false,
    // État du jeu textuel
    gameState: 'IDLE' as 'IDLE' | 'COMBAT' | 'EVENT',
  }),
  
  getters: {
    // PV Max basés sur la Vitalité (1 Vitalité = 1 PV) + Base 100
    playerMaxHealth: (state) => 100 + state.playerVitality,
    
    // Mana Max basé sur l'Intelligence (1 Intelligence = 5 Mana)
    playerMaxMana: (state) => 50 + (state.playerIntelligence * 5),

    currentGoldPerClick: (state) => {
      let power = 1
      
      // Ajout de la Force aux dégâts de base (1 Force = 1 Dégât)
      power += state.playerStrength

      UPGRADES.filter(u => u.type === 'click').forEach(u => {
        power += (state.inventory[u.id] || 0) * u.power
      })
      return power
    },
    currentGoldPerSecond: (state) => {
      let power = 0
      UPGRADES.filter(u => u.type === 'auto').forEach(u => {
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

    // Action d'exploration (Lancer un combat)
    explore() {
        if (this.gameState !== 'IDLE') return
        
        this.gameState = 'COMBAT'
        this.addToLog(`🌲 Vous vous enfoncez dans la zone...`)
        // Générer un monstre (réutilisation de la logique existante)
        this.monsterMaxHealth = Math.floor(50 * Math.pow(1.15, this.level))
        this.monsterHealth = this.monsterMaxHealth
        this.monsterAttackDamage = Math.floor(5 * Math.pow(1.1, this.level))
        
        this.addToLog(`⚠️ Un monstre de niveau ${this.level} apparaît ! (PV: ${this.monsterHealth})`)
    },

    // Action de combat (Tour par tour)
    attack() {
      if (this.gameState !== 'COMBAT') return

      // Tour du Joueur
      const dmg = this.currentGoldPerClick
      this.monsterHealth -= dmg
      this.addToLog(`⚔️ Vous attaquez : -${dmg} PV`)

      if (this.monsterHealth <= 0) {
        this.winCombat()
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
      this.addToLog(`💀 Vous êtes mort !`)
      this.isDead = true
      this.gameState = 'IDLE'
      this.autoCombatActive = false
    },

    reviveAndReset() {
        this.isDead = false
        this.playerHealth = this.playerMaxHealth
        this.playerMana = this.playerMaxMana
        this.travelToLevel(1) // Reset au niveau 1 (Chapitre 1)
        this.gameState = 'IDLE'
        this.addToLog(`✨ Vous avez été ressuscité à la Taverne.`)
    },

    gainXp(amount: number) {
        this.playerXp += amount
        if (this.playerXp >= this.playerMaxXp) {
            this.playerLevel++
            this.playerXp -= this.playerMaxXp
            this.playerMaxXp = Math.floor(this.playerMaxXp * 1.5)
            
            // Bonus de niveau : Soin complet + Augmentation stats
            this.playerHealth = this.playerMaxHealth
            this.playerMana = this.playerMaxMana
            
            this.addToLog(`🆙 NIVEAU SUPÉRIEUR ! Vous êtes niveau ${this.playerLevel}`)
        }
    },

    winCombat() {
      this.level++
      if (this.level > this.maxLevel) this.maxLevel = this.level
      
      const reward = this.level * 10
      this.gold += reward
      this.gainXp(this.level * 10)
      
      this.addToLog(`✨ Victoire ! +${reward} Or, +${this.level * 10} XP.`)
      this.gameState = 'IDLE' // Retour au calme
    },

    travelToLevel(targetLevel: number) {
        this.level = targetLevel
        // On réinitialise le monstre pour ce niveau
        this.monsterMaxHealth = Math.floor(50 * Math.pow(1.15, this.level))
        this.monsterHealth = this.monsterMaxHealth
        this.monsterAttackDamage = Math.floor(5 * Math.pow(1.1, this.level))
        this.addToLog(`✈️ Voyage vers le niveau ${this.level}.`)
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
      }

      // Régénération de Mana (1% par tick de 100ms = 10% par seconde)
      if (this.playerMana < this.playerMaxMana) {
          this.playerMana = Math.min(this.playerMaxMana, this.playerMana + (this.playerMaxMana * 0.01))
      }

      // Régénération de Santé (1% par seconde)
      if (this.playerHealth < this.playerMaxHealth && this.playerHealth > 0) {
          this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + (this.playerMaxHealth * 0.001))
      }
    },

    toggleAutoCombat() {
        if (this.playerLevel >= 2) {
            this.autoCombatActive = !this.autoCombatActive
        }
    },

    cycleSpeed() {
        if (this.playerLevel < 5) return
        if (this.combatSpeed === 1 && this.playerLevel >= 5) this.combatSpeed = 2
        else if (this.combatSpeed === 2 && this.playerLevel >= 10) this.combatSpeed = 3
        else this.combatSpeed = 1
    },

    saveGame() {
      const saveState = {
        gold: this.gold,
        inventory: this.inventory,
        level: this.level,
        maxLevel: this.maxLevel,
        playerHealth: this.playerHealth,
        playerLevel: this.playerLevel,
        playerXp: this.playerXp,
        playerMana: this.playerMana,
        playerStrength: this.playerStrength,
        playerAgility: this.playerAgility,
        playerIntelligence: this.playerIntelligence,
        playerVitality: this.playerVitality,
        playerLuck: this.playerLuck,
        playerDefense: this.playerDefense,
        autoCombatActive: this.autoCombatActive,
        combatSpeed: this.combatSpeed,
        isDead: this.isDead
      }
      localStorage.setItem('rpg_save', JSON.stringify(saveState))
    },

    loadGame() {
      // 1. Charger les données du PERSONNAGE (Stats, Or, XP...)
      const charSaved = localStorage.getItem('neko_rpg_character')
      if (charSaved) {
        const char = JSON.parse(charSaved)
        this.gold = char.gold || 0
        this.inventory = char.inventory || {}
        this.playerLevel = char.level || 1
        this.playerXp = char.xp || 0
        
        // Chargement des stats depuis le personnage
        if (char.stats) {
            this.playerStrength = char.stats.strength ?? 5
            this.playerAgility = char.stats.agility ?? 5
            this.playerIntelligence = char.stats.intelligence ?? 5
            this.playerVitality = char.stats.vitality ?? 5
            this.playerLuck = char.stats.luck ?? 5
            this.playerDefense = char.stats.defense ?? 0
        }
        
        // On s'assure que la vie actuelle est cohérente
        this.playerHealth = this.playerMaxHealth
        this.playerMana = this.playerMaxMana
      }

      // 2. Charger l'état du DONJON (Niveau, Monstre...)
      const gameSaved = localStorage.getItem('rpg_save')
      if (gameSaved) {
        const parsed = JSON.parse(gameSaved)
        this.level = parsed.level || 1
        this.maxLevel = parsed.maxLevel || this.level // Rétrocompatibilité
        
        // Si on a une sauvegarde de donjon, on reprend les PV actuels
        if (parsed.playerHealth) this.playerHealth = parsed.playerHealth
        if (parsed.playerMana) this.playerMana = parsed.playerMana
        if (parsed.autoCombatActive !== undefined) this.autoCombatActive = parsed.autoCombatActive
        if (parsed.combatSpeed) this.combatSpeed = parsed.combatSpeed
        if (parsed.isDead !== undefined) this.isDead = parsed.isDead
      }

      // 3. Initialisation du monstre (basé sur le niveau chargé)
      this.monsterMaxHealth = Math.floor(50 * Math.pow(1.15, this.level))
      // Si pas de save de monstre, on le met full life
      this.monsterHealth = (gameSaved && JSON.parse(gameSaved).monsterHealth) || this.monsterMaxHealth
      this.monsterAttackDamage = Math.floor(5 * Math.pow(1.1, this.level))
      
      this.addToLog("📂 Données du héros chargées.")
    }
  }
})