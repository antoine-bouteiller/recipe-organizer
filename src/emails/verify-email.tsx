import {
  Body,
  Button,
  Container,
  Head,
  Html,
  pretty,
  Preview,
  render,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface RecipeOrganizerEmailProps {
  loginUrl: string
}

const VerifyEmail = ({ loginUrl }: RecipeOrganizerEmailProps) => (
  <Html lang="fr">
    <Head />
    <Preview>Votre lien de connexion pour Recipe Organizer.</Preview>
    <Tailwind>
      <Body className="m-0 p-0 bg-[#f6f9fc] text-[#0f172a]">
        <Container className="w-full max-w-[600px] mx-auto p-6">
          <Section className="text-center my-2 text-xl font-bold">Recipe Organizer</Section>

          <Section className="bg-white rounded-2xl p-7 border border-gray-200">
            <Text className="text-slate-600 mb-5">Voici votre lien de connexion.</Text>

            <Section className="text-center my-6">
              <Button
                href={loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white py-3 px-5 rounded-lg font-semibold no-underline"
              >
                Se connecter
              </Button>
            </Section>

            <Text className="text-slate-600 text-sm mb-2">
              Ou copiez/collez ce lien dans votre navigateur&nbsp;:
            </Text>

            <Text className="break-all mb-4">
              <a
                href={loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black no-underline"
              >
                {loginUrl}
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export const getVerifyEmail = async (loginUrl: string) =>
  pretty(await render(<VerifyEmail loginUrl={loginUrl} />))
