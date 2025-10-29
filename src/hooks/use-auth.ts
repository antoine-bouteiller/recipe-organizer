import { authClient } from '@/lib/auth-client'
import { useParentMatches, useRouter } from '@tanstack/react-router'

export const useAuth = () => {
  const router = useRouter()
  const [rootRoute] = useParentMatches()

  const currentUser = rootRoute?.context?.authUser

  const signInWithMagicLink = async (email: string) => {
    const response = await authClient.signIn.magicLink({ email })
    await router.invalidate()
    return response
  }

  const signOut = async () => {
    const response = await authClient.signOut()
    await router.invalidate()
    return response
  }

  const signInWithGoogle = async () => {
    const response = await authClient.signIn.social({
      provider: 'google',
      errorCallbackURL: '/auth/login',
    })
    await router.invalidate()
    return response
  }

  return {
    currentUser,
    signOut,
    signInWithMagicLink,
    signInWithGoogle,
  }
}
