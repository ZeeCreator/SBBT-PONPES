<template>
  <div :class="['glass-card rounded-xl shadow-sm p-stack-md', hover && 'transition-transform hover:scale-[1.02]', borderColor && `border-l-4 border-${borderColor}`, className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  hover?: boolean
  borderColor?: string
  className?: string
}>(), {
  hover: false,
  borderColor: '',
  className: '',
})
</script>
