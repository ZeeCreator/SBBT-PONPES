<template>
  <div v-if="selectedCount > 0" class="px-stack-md py-3 bg-primary-fixed/10 border-b border-surface-variant/30 flex items-center gap-3">
    <span class="text-label-sm font-semibold text-primary">{{ selectedCount }} terpilih</span>
    <slot name="actions" />
    <button class="ml-auto text-label-sm text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors" @click="$emit('clear')">
      <span class="material-symbols-outlined text-sm">close</span> Batal
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ selectedCount: number }>()
defineEmits<{ clear: [] }>()
</script>
