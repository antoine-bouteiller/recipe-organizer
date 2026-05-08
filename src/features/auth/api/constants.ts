const authErrors = {
  account_blocked: 'account_blocked',
  account_pending: 'account_pending',
  email_not_verified: 'email_not_verified',
  error_communicating_with_google: 'error_communicating_with_google',
  invalid_state: 'invalid_state',
}

export type AuthError = keyof typeof authErrors
