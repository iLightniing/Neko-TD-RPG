<script setup lang="ts">
const activeNewsTab = ref('updates') // 'updates' | 'events'

const news = {
    updates: [
        { id: 1, date: '24 Oct', title: 'Patch 0.1.0 : Le commencement', desc: 'Bienvenue dans l\'alpha fermée de Loopbreaker. Découvrez les premiers étages du donjon.', type: 'patch' },
        { id: 2, date: '20 Oct', title: 'Hotfix : Équilibrage', desc: 'Réduction des PV du Boss niveau 10.', type: 'hotfix' },
        { id: 3, date: '15 Oct', title: 'Note de développement', desc: 'Aperçu des futures classes.', type: 'dev' },
    ],
    events: [
        { id: 1, date: '31 Oct', title: 'Événement Halloween', desc: 'Double XP et butin maudit pendant 24h !', type: 'event' },
    ]
}
</script>

<template>
    <div class="flex-1 hidden md:flex flex-col bg-black/20 p-8 overflow-hidden relative border-l border-white/5">
        <!-- News Header / Tabs -->
        <div class="flex items-center gap-8 mb-6 border-b border-white/10 shrink-0">
            <button @click="activeNewsTab = 'updates'" :class="activeNewsTab === 'updates' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'" class="pb-3 px-2 font-bold uppercase tracking-wider text-xs transition-all hover:bg-white/5 rounded-t-md">Mises à jour</button>
            <button @click="activeNewsTab = 'events'" :class="activeNewsTab === 'events' ? 'text-white border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'" class="pb-3 px-2 font-bold uppercase tracking-wider text-xs transition-all hover:bg-white/5 rounded-t-md">Événements</button>
        </div>

        <!-- News Content -->
        <div class="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            <div v-for="item in news[activeNewsTab as keyof typeof news]" :key="item.id" class="bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/60 transition-all p-4 rounded-lg group cursor-pointer">
                <div class="flex justify-between items-start mb-1">
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider" :class="item.type === 'event' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'">{{ item.type }}</span>
                    <span class="text-[10px] text-slate-500">{{ item.date }}</span>
                </div>
                <h3 class="font-bold text-slate-200 group-hover:text-white transition-colors mb-1">{{ item.title }}</h3>
                <p class="text-xs text-slate-400 leading-relaxed">{{ item.desc }}</p>
            </div>
        </div>
    </div>
</template>