import { OAuth2Client } from 'google-auth-library'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const oauth2Client = new OAuth2Client({
    clientId: '你的 Google Client ID',
    clientSecret: '你的 Google Client Secret',
    redirectUri: '你的 Google Redirect Uri'
  })

  let { tokens } = await oauth2Client.getToken(body.authCode)
  oauth2Client.setCredentials({ access_token: tokens.access_token })

  const userInfo = await oauth2Client
    .request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    })
    .then((response) => response.data)
    .catch(() => null)

  oauth2Client.revokeCredentials()

  if (!userInfo) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid token'
    })
  }

  return {
    id: userInfo.sub,
    name: userInfo.name,
    avatar: userInfo.picture,
    email: userInfo.email,
    emailVerified: userInfo.email_verified,
  }
})