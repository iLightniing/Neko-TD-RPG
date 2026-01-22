<script setup lang="ts">
definePageMeta({
    layout: 'auth',
    middleware: [] // Accessible publiquement
})

const route = useRoute()
const { confirmEmail } = useAuth()

onMounted(async () => {
    const token = route.query.token as string
    if (token) {
        const success = await confirmEmail(token)
        // On redirige vers le login avec le résultat en paramètre
        navigateTo(`/auth/login?verified=${success}`)
    } else {
        navigateTo('/auth/login')
    }
})
</script>

<template>
    <div class="flex items-center justify-center h-full">
        <!-- Le loader global s'affichera grâce à useAuth, ici on met juste un placeholder -->
    </div>
</template>