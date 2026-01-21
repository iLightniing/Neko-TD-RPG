<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  type?: string
  label?: string
  placeholder?: string
  icon?: string
  required?: boolean
}>(), {
  type: 'text',
  modelValue: ''
})

const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)
const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) return 'text'
  return props.type
})
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="text-xs font-bold uppercase text-slate-400 ml-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative group">
      <!-- Icone gauche -->
      <div v-if="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none flex items-center">
        <Icon :name="icon" class="w-5 h-5" />
      </div>

      <input :value="modelValue" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" :type="inputType" :placeholder="placeholder" :required="required" class="w-full bg-slate-950/50 border border-white/10 rounded-lg py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 select-text" :class="[icon ? 'pl-10' : 'px-4', type === 'password' ? 'pr-10' : '']" />

      <!-- Toggle Password -->
      <button v-if="type === 'password'" type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none flex items-center" tabindex="-1">
        <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>