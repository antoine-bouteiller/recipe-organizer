<script lang="ts">
  import { json, stubFetch } from '@storybook-helpers/stub-fetch'

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
  stubFetch(async (request) => {
    requests += 1
    if (failure === 'expected') {
      return json({ error: 'Adresse déjà utilisée' }, 409)
    }
    if (failure === 'thrown') {
      throw new Error('Service indisponible')
    }
    const data: { email?: string } = await request.json()
    if (data.email === 'invalide') {
      return json({ error: 'Invalid Schema', errors: { email: 'Adresse e-mail invalide' } }, 400)
    }
    await new Promise<void>((resolve) => {
      complete = resolve
    })
    complete = undefined
    return new Response(null, { status: 204 })
  })
</script>

<Button onclick={() => complete?.()}>Terminer la création</Button>
<Button onclick={() => (users = { ...users, active: [user('new', 'nouveau@example.com', 'active')] })}>Actualiser les utilisateurs</Button>
<p role="status">Requêtes: {requests}</p>
<UsersManagement {users} />
