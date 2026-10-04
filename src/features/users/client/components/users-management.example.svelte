<script lang="ts">
  import { setContext } from 'svelte'
  import { createSsrRouter, VoidActionError } from 'void/pages-client'
  import type { VoidRouter } from 'void/pages-client'

  import Button from '@/components/ui/actions/button/button.svelte'
  import type { UserStatus } from '@/features/users/schemas'
  import type { User } from '@/types/user'

  import UsersManagement from './users-management.svelte'

  const { failure }: { failure?: 'expected' | 'thrown' } = $props()
  const user = (id: string, email: string, status: UserStatus, role: User['role'] = 'user'): User => ({
    createdAt: new Date('2026-10-01'),
    email,
    emailVerified: true,
    id,
    image: null,
    name: email,
    role,
    status,
    updatedAt: new Date('2026-10-01'),
  })
  let users = $state({
    active: [user('alice', 'alice@example.com', 'active', 'admin')],
    blocked: [user('carol', 'carol@example.com', 'blocked')],
    pending: [user('bob', 'bob@example.com', 'pending')],
  })
  let requests = $state(0)
  let complete: (() => void) | undefined = $state()
  const router: VoidRouter = {
    ...createSsrRouter('/settings/users'),
    visit: async (_url, options) => {
      requests += 1
      if (failure === 'expected') {
        throw new VoidActionError({ body: { error: 'Adresse déjà utilisée' }, status: 409, statusText: 'Conflict', url: '/settings/users?create' })
      }
      if (failure === 'thrown') {
        throw new Error('Service indisponible')
      }
      const data = options?.data as { email?: string }
      if (data.email === 'invalide') {
        return { errors: { email: 'Adresse e-mail invalide' } }
      }
      await new Promise<void>((resolve) => {
        complete = resolve
      })
      complete = undefined
      return {}
    },
  }
  setContext('__void_router', router)
</script>

<Button onclick={() => complete?.()}>Terminer la création</Button>
<Button onclick={() => (users = { ...users, active: [user('new', 'nouveau@example.com', 'active')] })}>Actualiser les utilisateurs</Button>
<p role="status">Requêtes: {requests}</p>
<UsersManagement {users} />
