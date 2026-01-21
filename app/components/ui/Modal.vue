<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
}>()

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop (Fond flouté) -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal Content -->
        <div class="relative bg-slate-900 border border-white/10 rounded-md shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
          
          <!-- Header -->
          <div v-if="title" class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h3 class="text-lg font-bold text-white">{{ title }}</h3>
            <button @click="$emit('close')" class="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <slot />
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>