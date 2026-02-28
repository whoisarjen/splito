export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, fetchUser, loading } = useAuth()

  // If we haven't checked auth yet, fetch user
  if (loading.value) {
    await fetchUser()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/')
  }
})
