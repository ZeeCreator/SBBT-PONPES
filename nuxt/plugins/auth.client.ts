export default defineNuxtPlugin(() => {
  const { init, refreshRole, loading } = useAuth()
  init()
  if (import.meta.client) {
    const unwatch = watch(loading, (val) => {
      if (!val) {
        unwatch()
        refreshRole()
      }
    })
  }
})
