import { authClient } from '@/lib/auth-client'
import { useRouter, useParentMatches } from '@tanstack/react-router'

export const useAuth = () => {
  const router = useRouter()
  const [rootRoute] = useParentMatches()

  const currentUser = rootRoute?.context?.authUser

  const signInWithMagicLink = async (email: string) => {
    const response = await authClient.signIn.magicLink({ email })
    router.invalidate()
    return response
  }

  const signOut = async () => {
    const response = await authClient.signOut()
    router.invalidate()
    return response
  }

  return {
    currentUser,
    signOut,
    signInWithMagicLink,
  }
}
