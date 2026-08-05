<script setup lang="ts">
definePageMeta({ layout: 'wali-santri', requiredRole: 'wali_santri' })

if (import.meta.client) {
  await navigateTo('/wali-santri/dashboard', { replace: true })
}
</script>

<template>
  <div></div>
</template>
