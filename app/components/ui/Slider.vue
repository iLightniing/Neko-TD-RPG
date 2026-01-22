<script setup lang="ts">
defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()
</script>

<template>
    <div class="space-y-2">
        <div v-if="label" class="flex justify-between text-sm text-slate-300 font-bold">
            <span>{{ label }}</span>
            <span class="font-mono text-amber-400">{{ modelValue }}%</span>
        </div>
        <input 
            type="range" 
            :value="modelValue"
            @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
            :min="min || 0" 
            :max="max || 100" 
            :step="step || 1"
            class="w-full cursor-pointer appearance-none bg-transparent focus:outline-none"
        >
    </div>
</template>

<style scoped>
/* Webkit (Chrome, Safari, Edge) */
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  background: #1e293b; /* slate-800 */
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #f59e0b; /* amber-500 */
  margin-top: -7px; /* Centre le curseur verticalement par rapport à la piste */
  box-shadow: 0 0 0 2px #0f172a; /* Bordure simulée (slate-900) */
  transition: transform 0.1s, background-color 0.1s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: #fbbf24; /* amber-400 */
}

/* Firefox */
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 8px;
  background: #1e293b;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border: none;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 0 2px #0f172a;
  transition: transform 0.1s, background-color 0.1s;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
  background: #fbbf24;
}
</style>