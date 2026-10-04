<script lang="ts">
  import { Link } from '@void/svelte'
  import type { Component } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import Card from '@/components/ui/data-display/card/card.svelte'
  import { CaretRightIcon, CookieIcon, ThemeIcon, UserIcon, UsersIcon } from '@/components/ui/data-display/icons'
  import type { IconProps } from '@/components/ui/data-display/icons/icon-types'
  import { toggleTheme } from '@/lib/client/theme'

  interface SettingsSection {
    adminOnly?: boolean
    description: string
    icon: Component<IconProps>
    id: string
    path: string
    title: string
  }
  const settingsSections: SettingsSection[] = [
    {
      description: 'Gérer vos informations de compte et vous déconnecter',
      icon: UserIcon,
      id: 'account',
      path: '/settings/account',
      title: 'Compte',
    },
    {
      description: 'Gérer la liste des ingrédients disponibles',
      icon: CookieIcon,
      id: 'ingredients',
      path: '/settings/ingredients',
      title: 'Ingrédients',
    },
    {
      adminOnly: true,
      description: 'Gérer les utilisateurs et leurs rôles',
      icon: UsersIcon,
      id: 'users',
      path: '/settings/users',
      title: 'Utilisateurs',
    },
  ]
  const { isAdmin }: { readonly isAdmin: boolean } = $props()
  const visibleSections = $derived(settingsSections.filter((section) => !section.adminOnly || isAdmin))
</script>

<div class="settings-content-theme-toggle">
  <Button onclick={toggleTheme} variant="outline" width="full" align="start"><ThemeIcon size="lg" />Changer le thème</Button>
</div>
<div class="settings-content-sections">
  {#each visibleSections as section (section.id)}
    <Link href={section.path}
      ><div class="settings-content-section-link">
        <Card
          ><div class="settings-content-section-card">
            <div class="settings-content-section-content">
              <div class="settings-content-section-icon"><section.icon size="lg" /></div>
              <div class="settings-content-section-details">
                <h3 class="settings-content-section-title">{section.title}</h3>
                <p class="settings-content-section-description">{section.description}</p>
              </div>
            </div>
            <span class="settings-content-section-caret"><CaretRightIcon size="lg" /></span>
          </div></Card
        >
      </div></Link
    >
  {/each}
</div>

<style>
  .settings-content-theme-toggle {
    display: block;
    margin-bottom: 16px;
    width: 100%;
  }

  @media screen and (min-width: 768px) {
    .settings-content-theme-toggle {
      display: none;
    }
  }

  .settings-content-sections {
    display: grid;
    gap: 16px;
  }

  @media screen and (min-width: 768px) {
    .settings-content-sections {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .settings-content-section-link {
    cursor: pointer;
    height: 100%;
  }

  .settings-content-section-card {
    align-items: flex-start;
    display: flex;
    justify-content: space-between;
    padding: 16px;
  }

  .settings-content-section-content {
    align-items: flex-start;
    display: flex;
    flex: 1 1 0%;
    gap: 12px;
  }

  .settings-content-section-icon {
    background: color-mix(in srgb, var(--colors-primary) 10%, transparent);
    border-radius: var(--radius-lg);
    color: var(--colors-primary);
    padding: 8px;
  }

  .settings-content-section-details {
    flex: 1 1 0%;
  }

  .settings-content-section-title {
    font-weight: var(--font-weights-semibold);
  }

  .settings-content-section-description {
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-sm);
    margin-top: 4px;
  }

  .settings-content-section-caret {
    color: var(--colors-muted-foreground);
    flex-shrink: 0;
  }
</style>
