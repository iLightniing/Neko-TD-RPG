<script setup>
defineProps(['value', 'x', 'y'])
</script>

<template>
  <div 
    class="pointer-events-none absolute font-black text-2xl text-(--color-rpg-gold) animate-bounce-up opacity-0"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    +{{ value }}
  </div>
</template>

<style scoped>
@keyframes bounce-up {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100px); opacity: 0; }
}
.animate-bounce-up {
  animation: bounce-up 0.8s ease-out forwards;
}
</style>