export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: `${config.public.appUrl}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })

  return sendRedirect(event, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
})
