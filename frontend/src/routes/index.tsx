import { Link, createFileRoute } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

import { Container } from '../components/ui/container'
import { Section } from '../components/ui/section'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  Body,
  Caption,
  H1,
  H2,
  H3,
  Hero,
  Small,
} from '../components/ui/typography'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section variant="warmFade" className="relative min-h-[90vh] flex items-center">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-purple/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-coral/15 rounded-full blur-2xl animate-pulse" />

        <Container maxWidth="xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              <Badge className="mb-6">
                AI-Powered CV Generation
              </Badge>
              <Hero className="text-charcoal mb-2">
                Land Your
              </Hero>
              <Hero className="text-gradient mb-6">
                Dream Job
              </Hero>
              <Body className="text-mid-gray text-lg mb-8">
                Stop sending generic resumes. Our AI analyzes job postings and
                creates perfectly tailored CVs that highlight your most relevant
                experience — in seconds.
              </Body>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SignedOut>
                  <Link to="/auth/sign-up">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Free — No Card Required
                    </Button>
                  </Link>
                  <Link to="/auth/sign-in">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
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
              <div className="flex items-center gap-6 text-sm text-mid-gray">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>10 free CVs</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>ATS-optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Ready in 30s</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Card Preview */}
                <Card variant="elevated" className="p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber to-coral rounded-full flex items-center justify-center text-white font-bold text-xl">
                      JD
                    </div>
                    <div>
                      <H3 className="text-charcoal">John Doe</H3>
                      <Small className="text-mid-gray">Senior Software Engineer</Small>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-cream rounded-full w-full" />
                    <div className="h-3 bg-cream rounded-full w-5/6" />
                    <div className="h-3 bg-cream rounded-full w-4/6" />
                  </div>
                  <div className="mt-6 flex gap-2 flex-wrap">
                    <Badge variant="default">React</Badge>
                    <Badge variant="default">TypeScript</Badge>
                    <Badge variant="default">Node.js</Badge>
                  </div>
                </Card>

                {/* Floating Match Score */}
                <div className="absolute -top-4 -right-4 bg-white shadow-elevated rounded-2xl p-4 animate-bounce">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                      <span className="text-success font-bold">94%</span>
                    </div>
                    <Small className="text-charcoal font-medium">Match Score</Small>
                  </div>
                </div>

                {/* Floating ATS Badge */}
                <div className="absolute -bottom-4 -left-4 bg-charcoal text-white shadow-elevated rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <Small className="text-white font-medium">ATS Passed</Small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section spacing="md" className="bg-charcoal">
        <Container maxWidth="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <H2 className="text-amber mb-1">50K+</H2>
              <Small className="text-warm-white/70">CVs Generated(boong)</Small>
            </div>
            <div>
              <H2 className="text-amber mb-1">89%</H2>
              <Small className="text-warm-white/70">Interview Rate(boong)</Small>
            </div>
            <div>
              <H2 className="text-amber mb-1">30s</H2>
              <Small className="text-warm-white/70">Average Generation(boong, tpi dikit)</Small>
            </div>
            <div>
              <H2 className="text-amber mb-1">4.9/5</H2>
              <Small className="text-warm-white/70">User Rating(boong)</Small>
            </div>
          </div>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            <Caption className="text-amber mb-3 block">Simple Process</Caption>
            <H1 className="text-charcoal mb-4">How It Works</H1>
            <Body className="text-mid-gray mx-auto">
              Three simple steps to transform your job search. No more hours
              spent customizing your CV for each application.
            </Body>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-amber via-coral to-purple" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-amber/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-amber/20 transition-colors duration-300">
                    <svg className="w-10 h-10 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber rounded-full flex items-center justify-center text-charcoal font-bold text-sm shadow-soft">
                    1
                  </div>
                </div>
                <H3 className="text-charcoal mb-3">Create Your Profile</H3>
                <Body className="text-mid-gray">
                  Enter your experience, skills, and achievements once. We
                  securely store everything for future use.
                </Body>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-coral/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-coral/20 transition-colors duration-300">
                    <svg className="w-10 h-10 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-coral rounded-full flex items-center justify-center text-white font-bold text-sm shadow-soft">
                    2
                  </div>
                </div>
                <H3 className="text-charcoal mb-3">Paste the Job Description</H3>
                <Body className="text-mid-gray">
                  Our AI analyzes the job posting to understand exactly what the
                  employer is looking for.
                </Body>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-purple/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-purple/20 transition-colors duration-300">
                    <svg className="w-10 h-10 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple rounded-full flex items-center justify-center text-white font-bold text-sm shadow-soft">
                    3
                  </div>
                </div>
                <H3 className="text-charcoal mb-3">Get Your Tailored CV</H3>
                <Body className="text-mid-gray">
                  Download a professionally formatted CV that highlights your
                  most relevant qualifications.
                </Body>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section variant="warmFade" spacing="lg">
        <Container maxWidth="xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Feature List */}
            <div>
              <Caption className="text-amber mb-3 block">Why CV-Gen?</Caption>
              <H1 className="text-charcoal mb-6">
                Stand Out from <span className="text-gradient">the Crowd</span>
              </H1>
              <Body className="text-mid-gray mb-10">
                Our AI doesn't just match keywords — it understands context,
                restructures your experience, and presents you as the ideal
                candidate.
              </Body>

              <div className="space-y-6">
                <FeatureItem
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  }
                  title="ATS-Optimized"
                  description="Every CV passes automated screening systems with flying colors."
                />
                <FeatureItem
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                    </svg>
                  }
                  title="Smart Keyword Matching"
                  description="Automatically includes relevant keywords from job postings."
                />
                <FeatureItem
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  }
                  title="Professional Templates"
                  description="Clean, modern designs that impress recruiters instantly."
                />
                <FeatureItem
                  icon={
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  }
                  title="Cover Letters Included"
                  description="Generate matching cover letters with a single click."
                />
              </div>
            </div>

            {/* Right - Feature Cards */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card variant="elevated" className="p-6 col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <Small className="text-mid-gray">Job Match Analysis</Small>
                    <Badge variant="success">Live</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Small className="text-charcoal">Skills Match</Small>
                      <Small className="text-success font-semibold">92%</Small>
                    </div>
                    <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: '92%' }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Small className="text-charcoal">Experience Match</Small>
                      <Small className="text-amber font-semibold">85%</Small>
                    </div>
                    <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-amber rounded-full" style={{ width: '85%' }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Small className="text-charcoal">Keyword Coverage</Small>
                      <Small className="text-purple font-semibold">97%</Small>
                    </div>
                    <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-purple rounded-full" style={{ width: '97%' }} />
                    </div>
                  </div>
                </Card>

                <Card variant="default" className="p-5">
                  <div className="w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <H3 className="text-charcoal text-lg mb-1">30 Seconds</H3>
                  <Small className="text-mid-gray">Average generation time</Small>
                </Card>

                <Card variant="default" className="p-5">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  <H3 className="text-charcoal text-lg mb-1">PDF & Word</H3>
                  <Small className="text-mid-gray">Multiple export formats</Small>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center mb-16">
            <Caption className="text-amber mb-3 block">Success Stories</Caption>
            <H1 className="text-charcoal mb-4">Loved by Job Seekers(boong)</H1>
            <Body className="text-mid-gray mx-auto">
              Join thousands who've landed their dream jobs with CV-Gen.
            </Body>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="I applied to 20 jobs with my old CV and got 1 interview. With CV-Gen, I got 8 interviews from 15 applications!"
              name="Sarah M."
              role="Product Manager"
              company="Tech Startup"
            />
            <TestimonialCard
              quote="The AI understood exactly what the job required and highlighted my relevant experience perfectly. Got the job in 2 weeks."
              name="Michael R."
              role="Software Engineer"
              company="FAANG"
            />
            <TestimonialCard
              quote="As someone changing careers, CV-Gen helped me present my transferable skills in a way I never could have done myself."
              name="Emily L."
              role="Marketing Lead"
              company="Agency"
            />
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber/10 rounded-full mb-8">
              <svg className="w-10 h-10 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            <H1 className="text-warm-white mb-4">
              Ready to Land Your Dream Job?
            </H1>
            <Body className="text-warm-white/70 mb-8 mx-auto">
              Start with 10 free CV generations. No credit card required. Cancel
              anytime.
            </Body>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <Link to="/auth/sign-up">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/auth/sign-in">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-warm-white/20 text-warm-white hover:bg-warm-white/10">
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
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-white/5">
        <Container maxWidth="xl">
          <div className="py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <span className="font-display text-2xl font-bold text-warm-white">CV-Gen</span>
                <Body className="text-warm-white/60 mt-3">
                  AI-powered CV generation that helps you land your dream job
                  faster.
                </Body>
                <div className="flex gap-4 mt-6">
                  <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-warm-white/60 hover:text-amber hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-warm-white/60 hover:text-amber hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-warm-white/60 hover:text-amber hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Links */}
              <div>
                <Small className="text-warm-white font-semibold mb-4 block">Product</Small>
                <ul className="space-y-3">
                  <li><a href="#" className="text-warm-white/60 hover:text-amber transition-colors text-sm">Features</a></li>
                  <li><a href="#" className="text-warm-white/60 hover:text-amber transition-colors text-sm">Pricing</a></li>
                  <li><a href="#" className="text-warm-white/60 hover:text-amber transition-colors text-sm">Templates</a></li>
                  <li><a href="#" className="text-warm-white/60 hover:text-amber transition-colors text-sm">Examples</a></li>
                </ul>
              </div>

              <div>
                <Small className="text-warm-white font-semibold mb-4 block">Company</Small>
                <ul className="space-y-3">
                  <li><a href="#" className="text-warm-white/60 hover:text-amber transition-colors text-sm">About</a></li>
                  <li><a href="#" className="text-warm-white/60 hover:text-amber transition-colors text-sm">Blog</a></li>
                  <li><a href="#" className="text-warm-white/60 hover:text-amber transition-colors text-sm">Privacy</a></li>
                  <li><a href="#" className="text-warm-white/60 hover:text-amber transition-colors text-sm">Terms</a></li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-white/5 text-center">
              <Small className="text-warm-white/40">
                &copy; {new Date().getFullYear()} CV-Gen. All rights reserved.
              </Small>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}

// Feature Item Component
function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="flex-shrink-0 w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center text-amber group-hover:bg-amber group-hover:text-charcoal transition-colors duration-300">
        {icon}
      </div>
      <div>
        <H3 className="text-charcoal text-lg mb-1">{title}</H3>
        <Body className="text-mid-gray text-sm">{description}</Body>
      </div>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({
  quote,
  name,
  role,
  company,
}: {
  quote: string
  name: string
  role: string
  company: string
}) {
  return (
    <Card variant="default" className="p-6 h-full flex flex-col">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <Body className="text-charcoal flex-grow mb-6">"{quote}"</Body>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber to-coral rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <Small className="text-charcoal font-semibold block">{name}</Small>
          <Caption className="text-mid-gray">{role} at {company}</Caption>
        </div>
      </div>
    </Card>
  )
}
