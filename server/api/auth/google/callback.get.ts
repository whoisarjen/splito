import { findOrCreateUser, createSession, setSessionCookie } from '../../../utils/auth'

interface GoogleTokenResponse {
  access_token: string
  id_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token?: string
}

interface GoogleUserInfo {
  sub: string
  email: string
  email_verified: boolean
  name: string
  given_name: string
  family_name?: string
  picture: string
  locale: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  // Check for errors from Google
  if (query.error) {
    console.error('Google OAuth error:', query.error)
    return sendRedirect(event, '/?error=oauth_failed')
  }

  const code = query.code as string
  if (!code) {
    return sendRedirect(event, '/?error=no_code')
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: config.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: `${config.public.appUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error('Token exchange failed:', error)
      return sendRedirect(event, '/?error=token_exchange_failed')
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json()

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      console.error('Failed to get user info')
      return sendRedirect(event, '/?error=user_info_failed')
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json()

    // Find or create user in database
    const user = await findOrCreateUser({
      googleId: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name || googleUser.given_name,
      avatar: googleUser.picture,
      locale: googleUser.locale?.split('-')[0] || 'en',
    })

    // Create session
    const sessionToken = await createSession(user.id)
    setSessionCookie(event, sessionToken)

    // Redirect to dashboard
    return sendRedirect(event, '/dashboard')
  } catch (error) {
    console.error('OAuth callback error:', error)
    return sendRedirect(event, '/?error=oauth_callback_failed')
  }
})
