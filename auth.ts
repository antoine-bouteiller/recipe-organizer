import { defineAuth } from 'void/auth'

// Better Auth recognizes its API errors by name, so the OAuth callback redirects with this `code`.
class APIError extends Error {
  override readonly name = 'APIError'
  readonly body: { code: string; message: string }

  constructor(code: string, message: string) {
    super(message)
    this.body = { code, message }
  }
}

const timestamps = { createdAt: 'created_at', updatedAt: 'updated_at' }

// Void also loads this file in Node to derive the auth schema, so it may only import packages.
export default defineAuth(({ defaults, env }) => ({
  ...defaults,
  account: {
    fields: {
      ...timestamps,
      accessToken: 'access_token',
      accessTokenExpiresAt: 'access_token_expires_at',
      accountId: 'account_id',
      idToken: 'id_token',
      providerId: 'provider_id',
      refreshToken: 'refresh_token',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      userId: 'user_id',
    },
  },
  databaseHooks: {
    session: {
      create: {
        // Throwing aborts the OAuth callback, which redirects to `errorCallbackURL?error=<code>`.
        before: async (newSession, context) => {
          const existing = await context?.context.internalAdapter.findUserById(newSession.userId)
          const status = existing && 'status' in existing ? existing.status : undefined
          if (status === 'blocked') {
            throw new APIError('account_blocked', 'Account blocked')
          }
          if (status === 'pending') {
            throw new APIError('account_pending', 'Account pending approval')
          }
        },
      },
    },
    user: {
      create: {
        before: async (newUser) => ({ data: { ...newUser, status: 'pending' } }),
      },
    },
  },
  emailAndPassword: { enabled: false },
  session: {
    fields: { ...timestamps, expiresAt: 'expires_at', ipAddress: 'ip_address', userAgent: 'user_agent', userId: 'user_id' },
  },
  socialProviders: {
    google: { clientId: String(env.GOOGLE_CLIENT_ID), clientSecret: String(env.GOOGLE_CLIENT_SECRET) },
  },
  user: {
    additionalFields: {
      role: { defaultValue: 'user', input: false, required: false, type: 'string' },
      status: { defaultValue: 'active', input: false, required: false, type: 'string' },
    },
    fields: { ...timestamps, emailVerified: 'email_verified' },
  },
  verification: { fields: { ...timestamps, expiresAt: 'expires_at' } },
}))
