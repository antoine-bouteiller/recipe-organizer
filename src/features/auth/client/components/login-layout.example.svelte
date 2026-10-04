<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'

  import LoginLayout from './login-layout.svelte'

  let requests = $state(0)
  let rejectSignIn: ((error: Error) => void) | undefined = $state()
  const signIn = async () => {
    requests += 1
    await new Promise<void>((_resolve, reject) => {
      rejectSignIn = reject
    })
  }
</script>

<Button onclick={() => rejectSignIn?.(new Error('Google indisponible'))}>Échouer la connexion</Button>
<p role="status">Connexions: {requests}</p>
<LoginLayout error="Votre compte est en attente d'approbation par un administrateur" onSignIn={signIn} />
