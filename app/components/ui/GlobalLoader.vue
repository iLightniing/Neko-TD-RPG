<script setup lang="ts">
const { isLoading, loadingMessage } = useLoader()
</script>

<template>
  <Transition name="fade">
    <div v-if="isLoading" class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <UiLoader :message="loadingMessage" />
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>