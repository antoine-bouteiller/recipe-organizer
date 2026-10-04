<script lang="ts">
  import { Link } from '@void/svelte'
  import type { Component } from 'svelte'

  import Button from '@/components/ui/actions/button/button.svelte'
  import Card from '@/components/ui/data-display/card/card.svelte'
  import type { IconProps } from '@/components/ui/data-display/icons/icon-types'
  import { CaretRightIcon, CookieIcon, ThemeIcon, UserIcon, UsersIcon } from '@/components/ui/data-display/icons/svelte'
  import { toggleTheme } from '@/lib/client/theme'

  import * as styles from './settings-content.css'

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

<div class={styles.themeToggle}>
  <Button onclick={toggleTheme} variant="outline" width="full" align="start"><ThemeIcon size="lg" />Changer le thème</Button>
</div>
<div class={styles.sections}>
  {#each visibleSections as section (section.id)}
    <Link href={section.path}
      ><div class={styles.sectionLink}>
        <Card
          ><div class={styles.sectionCard}>
            <div class={styles.sectionContent}>
              <div class={styles.sectionIcon}><section.icon size="lg" /></div>
              <div class={styles.sectionDetails}>
                <h3 class={styles.sectionTitle}>{section.title}</h3>
                <p class={styles.sectionDescription}>{section.description}</p>
              </div>
            </div>
            <span class={styles.sectionCaret}><CaretRightIcon size="lg" /></span>
          </div></Card
        >
      </div></Link
    >
  {/each}
</div>
