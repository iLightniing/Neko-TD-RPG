<script setup lang="ts">
</script>

<template>
    <div class="h-full flex flex-col gap-6">
        <GameProfileHeader />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
            <GameProfileAttributes />
            <GameProfileStats />
        </div>
    </div>
</template>