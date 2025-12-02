export const authErrors = {
  error_communicating_with_google: 'error_communicating_with_google',
  invalid_state: 'invalid_state',
  signup_disabled: 'signup_disabled',
}

export type AuthError = keyof typeof authErrors
