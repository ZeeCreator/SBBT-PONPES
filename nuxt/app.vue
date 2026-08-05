<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'SIM-PPT | Sistem Informasi Manajemen Pondok Pesantren Terpadu',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'description', content: 'Sistem Informasi Manajemen Pondok Pesantren Terpadu - Platform manajemen digital terpadu untuk lingkungan pondok pesantren.' },
  ],
  bodyAttrs: {
    class: 'bg-background text-on-background font-sans min-h-screen overflow-x-hidden',
  },
})
</script>
