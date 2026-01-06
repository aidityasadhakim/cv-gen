import { createFileRoute, Link } from '@tanstack/react-router'
import { useUser } from '@clerk/clerk-react'

import { ProtectedRoute } from '../../components/ProtectedRoute'

import { Container } from '../../components/ui/container'
import { Section } from '../../components/ui/section'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { H1, H2, Body, Small } from '../../components/ui/typography'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useUser()

  return (
    <Section spacing="lg">
      <Container maxWidth="xl">
        <div className="mb-8">
          <H1 className="text-charcoal">
            Welcome back, {user?.firstName || 'there'}!
          </H1>
          <Body className="mt-2 text-mid-gray">
            Create AI-powered CVs tailored to your dream job
          </Body>
        </div>

        <div className="mb-8">
          <H2 className="text-charcoal mb-6">Quick Actions</H2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              variant="default"
              className="p-6 cursor-pointer hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-amber/10 flex items-center justify-center">
                    <svg className="h-6 w-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <Body className="font-semibold text-charcoal">Create New CV</Body>
                  <Small className="text-mid-gray">Generate a tailored CV for a job posting</Small>
                </div>
              </div>
            </Card>

            <Link to="/profile" className="block">
              <Card
                variant="default"
                className="p-6 cursor-pointer hover:shadow-medium transition-all duration-300 h-full"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Body className="font-semibold text-charcoal">Master Profile</Body>
                    <Small className="text-mid-gray">Update your skills and experience</Small>
                  </div>
                </div>
              </Card>
            </Link>

            <Card
              variant="default"
              className="p-6 cursor-pointer hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-purple/10 flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <Body className="font-semibold text-charcoal">My CVs</Body>
                  <Small className="text-mid-gray">View and edit your generated CVs</Small>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <H2 className="text-charcoal mb-6">Recent Activity</H2>
          <Card variant="default" className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-mid-gray/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <Body className="mt-4 text-charcoal font-medium">No CVs yet</Body>
            <Small className="mt-1 text-mid-gray">Get started by creating your first tailored CV</Small>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
