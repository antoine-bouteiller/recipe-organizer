<script lang="ts">
  import { useForm } from '@void/svelte'
  import type { Snippet } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import Badge from '@/components/ui/data-display/badge/badge.svelte'
  import { PlusIcon } from '@/components/ui/data-display/icons'
  import ItemGroup from '@/components/ui/data-display/item/item-group.svelte'
  import ItemSeparator from '@/components/ui/data-display/item/item-separator.svelte'
  import Item from '@/components/ui/data-display/item/item.svelte'
  import SearchInput from '@/components/ui/forms/search-input/search-input.svelte'
  import SelectField from '@/components/ui/forms/select-field/select-field.svelte'
  import TextField from '@/components/ui/forms/text-field/text-field.svelte'
  import Tabs from '@/components/ui/navigation/tabs/tabs.svelte'
  import FormDialog from '@/components/ui/overlays/form-dialog/form-dialog.svelte'
  import type { UserFormInput, UserStatus } from '@/features/users/schemas'
  import { alertError } from '@/lib/client/alert-error'
  import { useFormActionError } from '@/lib/client/page-action.svelte'
  import type { User } from '@/types/user'

  import ApproveUser from './approve-user.svelte'
  import BlockUser from './block-user.svelte'

  const { users }: { users: Record<UserStatus, readonly User[]> } = $props()
  const userDefaultValues: Required<UserFormInput> = { email: '', role: 'user' }
  const roleOptions = [
    { label: 'Utilisateur', value: 'user' },
    { label: 'Administrateur', value: 'admin' },
  ]
  const roleLabels = new Map([
    ['admin', 'Admin'],
    ['user', 'Utilisateur'],
  ])
  const USER_TAB_LABELS = {
    active: { empty: 'Aucun utilisateur actif.', label: 'Actifs' },
    blocked: { empty: 'Aucun utilisateur bloqué.', label: 'Bloqués' },
    pending: { empty: 'Aucun utilisateur en attente.', label: 'En attente' },
  } satisfies Record<UserStatus, { empty: string; label: string }>
  let open = $state(false)
  let search = $state('')
  const query = $derived(search.trim().toLowerCase())
  const filterUsers = (items: readonly User[]) =>
    items.filter((userItem) => userItem.email.toLowerCase().includes(query) || userItem.role.toLowerCase().includes(query))
  const filteredUsers = $derived({ active: filterUsers(users.active), blocked: filterUsers(users.blocked), pending: filterUsers(users.pending) })
  const form = useForm('/settings/users?create', userDefaultValues)
  useFormActionError(() => form.error, "Erreur lors de la création de l'utilisateur")
  const submit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (form.pending) {
      return
    }
    try {
      await form.post({ preserveState: true })
      if (form.wasSuccessful) {
        form.data.email = ''
        form.data.role = 'user'
        open = false
      }
    } catch (error) {
      alertError(`Erreur lors de la création de l'utilisateur ${form.data.email}`, error)
    }
  }
</script>

{#snippet userList(status: UserStatus)}
  <div class="users-management-panel">
    {#if filteredUsers[status].length === 0}
      <p class="users-management-empty-state">{search ? 'Aucun utilisateur trouvé pour cette recherche.' : USER_TAB_LABELS[status].empty}</p>
    {:else}
      <ItemGroup>
        {#each filteredUsers[status] as userItem, index (userItem.id)}
          <Item layout="row">
            {#snippet actions()}
              {#if status === 'blocked' || status === 'pending'}<ApproveUser userId={userItem.id} />{/if}
              {#if status === 'active' || status === 'pending'}<BlockUser userEmail={userItem.email} userId={userItem.id} />{/if}
            {/snippet}
            {#snippet title()}<span class="users-management-user-email">{userItem.email}</span><Badge
                variant={userItem.role === 'admin' ? 'default' : 'secondary'}>{roleLabels.get(userItem.role)}</Badge
              >{/snippet}
          </Item>
          {#if index !== filteredUsers[status].length - 1}<ItemSeparator />{/if}
        {/each}
      </ItemGroup>
    {/if}
  </div>
{/snippet}
{#snippet activeLabel()}{USER_TAB_LABELS.active.label}{/snippet}
{#snippet pendingLabel()}{USER_TAB_LABELS.pending.label}{/snippet}
{#snippet blockedLabel()}{USER_TAB_LABELS.blocked.label}{/snippet}
{#snippet activeContent()}{@render userList('active')}{/snippet}
{#snippet pendingContent()}{@render userList('pending')}{/snippet}
{#snippet blockedContent()}{@render userList('blocked')}{/snippet}

<div class="users-management-search-bar">
  <SearchInput placeholder="Rechercher une recette, un ingrédient…" {search} setSearch={(next) => (search = next)} />
  <FormDialog
    errors={form.errors}
    pending={form.pending}
    onsubmit={submit}
    {open}
    setOpen={(next) => (open = next)}
    submitLabel="Ajouter"
    title="Ajouter un utilisateur"
  >
    {#snippet renderTrigger(props)}<Button {...props} aria-label="Ajouter un utilisateur" size="icon-lg" variant="outline"><PlusIcon /></Button
      >{/snippet}
    <TextField
      name="email"
      value={form.data.email}
      onChange={(value) => (form.data.email = value)}
      disabled={form.pending}
      label="Email"
      placeholder="Ex: user@example.com"
    />
    <SelectField
      name="role"
      value={form.data.role}
      onChange={(value) => {
        if (value === 'admin' || value === 'user') form.data.role = value
      }}
      disabled={form.pending}
      items={roleOptions}
      label="Rôle"
    />
  </FormDialog>
</div>
<div class="users-management-tabs">
  <Tabs
    items={[
      { content: activeContent, label: activeLabel, value: 'active' },
      { content: pendingContent, label: pendingLabel, value: 'pending' },
      { content: blockedContent, label: blockedLabel, value: 'blocked' },
    ] satisfies { content: Snippet; label: Snippet; value: string }[]}
  />
</div>

<style>
  .users-management-panel {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 16px;
  }

  .users-management-empty-state {
    color: var(--colors-muted-foreground);
    padding-block: 32px;
    text-align: center;
  }

  .users-management-user-email {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .users-management-search-bar {
    align-items: center;
    background: var(--colors-muted);
    display: flex;
    flex-shrink: 0;
    gap: 16px;
    padding-bottom: 8px;
  }

  .users-management-tabs {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    margin-bottom: -16px;
    min-height: 0px;
  }
</style>
