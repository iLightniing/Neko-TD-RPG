<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  icon?: string
  required?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="text-xs font-bold text-slate-400 uppercase ml-1 block">
      {{ label }} <span v-if="required" class="text-red-400">*</span>
    </label>
    <div class="relative group">
      <div v-if="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
        <Icon :name="icon" class="w-5 h-5" />
      </div>
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :type="type || 'text'"
        :placeholder="placeholder"
        :required="required"
        class="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
        :class="{'pl-10': icon}"
      />
    </div>
  </div>
</template>