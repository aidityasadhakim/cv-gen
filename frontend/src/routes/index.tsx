import { Link, createFileRoute } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

import { Container } from '../components/ui/container'
import { Section } from '../components/ui/section'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Body, H2, H3, Hero, Small } from '../components/ui/typography'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <Section variant="warmFade">
        <Container maxWidth="xl">
          <div className="text-center w-full">
            <Hero className="text-charcoal w-full">
              Create AI-Powered CVs
              <span className="text-gradient block mt-2">
                Tailored to Your Dream Job
              </span>
            </Hero>
            <Body className="mt-8 text-mid-gray max-w-2xl mx-auto">
              Stop sending generic resumes. CV-Gen analyzes job postings and
              creates perfectly tailored CVs that highlight your most relevant
              experience.
            </Body>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <Link to="/auth/sign-up">
                  <Button size="lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/auth/sign-in">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>
            <Small className="mt-4 text-mid-gray block">
              10 free generations to start. No credit card required.
            </Small>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            <H2 className="text-charcoal">How It Works</H2>
            <Body className="mt-4 text-mid-gray">
              Three simple steps to your perfect CV
            </Body>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="default" className="p-8 text-center">
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-dark">1</span>
              </div>
              <H3 className="text-charcoal mb-3">Create Your Master Profile</H3>
              <Body className="text-mid-gray">
                Enter all your experience, skills, and achievements once. Our
                system stores everything securely.
              </Body>
            </Card>

            <Card variant="default" className="p-8 text-center">
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-dark">2</span>
              </div>
              <H3 className="text-charcoal mb-3">Paste the Job URL</H3>
              <Body className="text-mid-gray">
                Our AI analyzes the job posting to understand exactly what the
                employer is looking for.
              </Body>
            </Card>

            <Card variant="default" className="p-8 text-center">
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-amber-dark">3</span>
              </div>
              <H3 className="text-charcoal mb-3">Get Your Tailored CV</H3>
              <Body className="text-mid-gray">
                Receive a professionally formatted CV that highlights your most
                relevant qualifications.
              </Body>
            </Card>
          </div>
        </Container>
      </Section>

      <Section variant="dark">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <H2 className="text-warm-white mb-6">
                Stand Out from the Competition
              </H2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-success rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <Body className="text-warm-white/80">
                    <strong className="text-warm-white">ATS-Optimized:</strong> Your CV passes automated screening systems
                  </Body>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-success rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <Body className="text-warm-white/80">
                    <strong className="text-warm-white">Keyword Matching:</strong> Automatically includes relevant keywords from job postings
                  </Body>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-success rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <Body className="text-warm-white/80">
                    <strong className="text-warm-white">Professional Templates:</strong> Clean, modern designs that impress recruiters
                  </Body>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-success rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <Body className="text-warm-white/80">
                    <strong className="text-warm-white">Cover Letters:</strong> Generate matching cover letters with one click
                  </Body>
                </div>
              </div>
            </div>
            <Card variant="dark" className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-amber/10 rounded-full mb-6">
                  <svg className="w-10 h-10 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <H3 className="text-warm-white mb-2">Start Free Today</H3>
                <Body className="text-warm-white/70 mb-6">
                  Get 10 free CV generations. No credit card required.
                </Body>
                <SignedOut>
                  <Link to="/auth/sign-up" className="block">
                    <Button className="w-full" size="lg">
                      Create Your Free Account
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link to="/dashboard" className="block">
                    <Button className="w-full" size="lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <footer className="bg-charcoal py-12">
        <Container maxWidth="xl">
          <div className="text-center">
            <span className="font-display text-xl font-bold text-warm-white">CV-Gen</span>
            <Small className="text-warm-white/60 mt-2 block">
              AI-powered CV generation for your dream job
            </Small>
            <Small className="text-warm-white/40 mt-4 block">
              &copy; {new Date().getFullYear()} CV-Gen. All rights reserved.
            </Small>
          </div>
        </Container>
      </footer>
    </div>
  )
}
