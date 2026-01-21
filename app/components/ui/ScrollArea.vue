<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div class="overflow-y-auto scrollbar-custom" :class="class">
    <slot />
  </div>
</template>

<style scoped>
/* Design de la barre de défilement */
.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.scrollbar-custom::-webkit-scrollbar-corner {
  background: transparent;
}
</style>