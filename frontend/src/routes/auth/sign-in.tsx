import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/clerk-react'

import { Container } from '../../components/ui/container'
import { Section } from '../../components/ui/section'
import { Card } from '../../components/ui/card'
import { H2, Body } from '../../components/ui/typography'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  return (
    <Section spacing="lg">
      <Container maxWidth="md">
        <Card variant="default" className="p-8">
          <div className="text-center mb-8">
            <H2 className="text-charcoal">Sign in to CV-Gen</H2>
            <Body className="mt-2 text-mid-gray">
              Create AI-powered CVs tailored to your dream job
            </Body>
          </div>
          <div className="flex justify-center">
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none',
                },
              }}
              signUpUrl="/auth/sign-up"
              forceRedirectUrl="/dashboard"
            />
          </div>
        </Card>
      </Container>
    </Section>
  )
}
