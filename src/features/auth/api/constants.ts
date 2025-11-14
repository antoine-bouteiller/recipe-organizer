export const authErrors = {
  signup_disabled: 'signup_disabled',
  error_communicating_with_google: 'error_communicating_with_google',
  invalid_state: 'invalid_state',
}

export type AuthError = keyof typeof authErrors
