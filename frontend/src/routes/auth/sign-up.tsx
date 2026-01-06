import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/clerk-react'

import { Container } from '../../components/ui/container'
import { Section } from '../../components/ui/section'
import { Card } from '../../components/ui/card'
import { H2, Body } from '../../components/ui/typography'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <Section spacing="lg">
      <Container maxWidth="md">
        <Card variant="default" className="p-8">
          <div className="text-center mb-8">
            <H2 className="text-charcoal">Create your account</H2>
            <Body className="mt-2 text-mid-gray">
              Get 10 free CV generations to start
            </Body>
          </div>
          <div className="flex justify-center">
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none',
                },
              }}
              signInUrl="/auth/sign-in"
              forceRedirectUrl="/dashboard"
            />
          </div>
        </Card>
      </Container>
    </Section>
  )
}
