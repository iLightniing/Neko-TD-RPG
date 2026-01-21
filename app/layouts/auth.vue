<script setup lang="ts">
import LauncherBackground from '~/components/launcher/Background.vue'
import LauncherLogo from '~/components/launcher/Logo.vue'
import LauncherNews from '~/components/launcher/News.vue'
import LauncherFooter from '~/components/launcher/Footer.vue'

const isElectron = ref(false)
const route = useRoute()

// On détecte si on est sur une page d'authentification (Login/Register) ou de personnage
const isAuthPage = computed(() => ['/auth/login', '/auth/register', '/auth/forgot-password'].includes(route.path))

onMounted(() => {
    const api = (window as any).electronAPI
    if (api) {
        isElectron.value = true
        if (typeof api.resize === 'function') {
            // Taille Launcher large (Auth + News)
            api.resize(1280, 800)
            api.center?.()
        }
    }
})
</script>

<template>
    <div class="h-full w-full bg-slate-950 relative overflow-hidden font-sans text-slate-200 selection:bg-indigo-500/30 flex flex-col">
        
        <LauncherBackground />

        <!-- Main Content (Split View) -->
        <div class="flex-1 flex relative z-10 animate-fade-in overflow-hidden">
            
            <!-- Left Column: Auth System -->
            <div v-if="isAuthPage" class="w-full md:w-[420px] shrink-0 flex flex-col p-8 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 relative shadow-2xl z-20">
                
                <!-- Web Specific Status Display (Integrated) -->
                <div v-if="!isElectron" class="absolute top-6 left-0 right-0 flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <div class="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full border border-white/5">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span class="text-emerald-400">En ligne</span>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1 bg-black/30 rounded-full border border-white/5">
                        <Icon name="lucide:users" class="w-3 h-3" />
                        <span>1,243</span>
                    </div>
                </div>

                <!-- Logo (Fixed Top) -->
                <div class="mt-8 shrink-0">
                    <LauncherLogo />
                </div>

                <!-- Auth Forms Slot (Centered in remaining space) -->
                <div class="flex-1 flex items-start justify-center w-full max-w-sm mx-auto pt-6">
                    <div class="w-full">
                        <slot />
                    </div>
                </div>

                <!-- Footer Version (Fixed Bottom) -->
                <div class="mt-auto shrink-0">
                    <LauncherFooter :is-electron="isElectron" />
                </div>
            </div>
            
            <!-- Right Column: News & Events -->
            <LauncherNews v-if="isAuthPage" />

            <!-- Full Screen Content (Character Selection / Creation) -->
            <div v-else class="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md relative">
                <div class="w-full max-w-5xl h-full flex flex-col">
                    <slot />
                </div>
                <div class="absolute bottom-4 left-0 right-0">
                    <LauncherFooter :is-electron="isElectron" />
                </div>
            </div>
            
        </div>
    </div>
</template>