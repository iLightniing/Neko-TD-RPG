<script setup lang="ts">
defineProps<{
    isElectron: boolean
}>()
</script>

<template>
    <div class="text-center text-[9px] text-slate-600 font-mono">
        v0.1.0-alpha &bull; {{ isElectron ? 'Client Desktop' : 'Client Web' }}
    </div>
</template>