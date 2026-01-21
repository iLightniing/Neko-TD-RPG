<script setup lang="ts">
import wallpaper from '~/assets/images/wallpapers/wallpaper1.png'
</script>

<template>
    <div class="absolute inset-0 z-0 pointer-events-none">
         <!-- Image de fond d'ambiance (Fantasy) -->
         <div class="absolute inset-0 bg-cover bg-center opacity-30" :style="{ backgroundImage: `url(${wallpaper})` }"></div>
         <!-- Gradient pour fondre l'image -->
         <div class="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950"></div>
         <!-- Particules d'ambiance (CSS) -->
         <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.15),transparent_70%)]"></div>
    </div>
</template>