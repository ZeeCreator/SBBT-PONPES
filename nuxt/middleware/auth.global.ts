export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loading, role, refreshRole } = useAuth()
  const authCookie = useCookie<boolean>('auth-logged-in')
  const publicRoutes = ['/', '/auth/login']

  if (publicRoutes.includes(to.path)) return

  if (import.meta.server) {
    if (!authCookie.value) {
      return navigateTo('/auth/login')
    }
    return
  }

  if (loading.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(loading, (val) => {
        if (!val) {
          unwatch()
          resolve()
        }
      })
    })
  }

  if (!user.value) {
    return navigateTo('/auth/login')
  }

  if (!role.value) {
    await refreshRole()
  }

  const requiredRole = to.meta?.requiredRole as string | undefined
  if (requiredRole && role.value !== 'super_admin' && role.value !== requiredRole) {
    return navigateTo('/auth/login')
  }
})
