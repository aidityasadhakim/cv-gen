import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { ProtectedRoute } from '../../components/ProtectedRoute'
import { Container } from '../../components/ui/container'
import { Section } from '../../components/ui/section'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { H1, H2, Body, Small } from '../../components/ui/typography'
import { THEMES, getDefaultThemeId } from '../../lib/themes'
import { useCreateCV } from '../../hooks/useCVs'
import { cn } from '../../lib/utils'

export const Route = createFileRoute('/cv/new')({
  component: NewCVPage,
})

function NewCVPage() {
  return (
    <ProtectedRoute>
      <NewCVContent />
    </ProtectedRoute>
  )
}

function NewCVContent() {
  const navigate = useNavigate()
  const createCVMutation = useCreateCV()
  const [name, setName] = useState('')
  const [templateId, setTemplateId] = useState(getDefaultThemeId())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const cv = await createCVMutation.mutateAsync({
        name: name || 'Untitled CV',
        template_id: templateId,
      })
      if (cv) {
        navigate({ to: '/cv/$cvId', params: { cvId: cv.id } })
      }
    } catch (err) {
      console.error('Failed to create CV:', err)
    }
  }

  return (
    <Section spacing="lg">
      <Container maxWidth="lg">
        <div className="mb-8">
          <H1 className="text-charcoal">Create New CV</H1>
          <Body className="mt-2 text-mid-gray">
            Start from your master profile and customize for your target role
          </Body>
        </div>

        <form onSubmit={handleSubmit}>
          <Card variant="default" className="p-6 mb-6">
            <div className="mb-6">
              <Label htmlFor="cv-name">CV Name</Label>
              <Input
                id="cv-name"
                type="text"
                placeholder="e.g., Software Engineer at Google"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
              <Small className="text-mid-gray mt-1">
                Give your CV a name to easily identify it later
              </Small>
            </div>
          </Card>

          <Card variant="default" className="p-6 mb-6">
            <H2 className="text-charcoal mb-4">Select Template</H2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setTemplateId(theme.id)}
                  className={cn(
                    'p-4 rounded-lg border-2 text-left transition-all duration-200',
                    templateId === theme.id
                      ? 'border-amber bg-amber/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="aspect-[8.5/11] bg-gray-100 rounded mb-3 flex items-center justify-center">
                    <ThemePreviewIcon themeId={theme.id} />
                  </div>
                  <Body className="font-semibold text-charcoal">{theme.name}</Body>
                  <Small className="text-mid-gray">{theme.description}</Small>
                </button>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate({ to: '/dashboard' })}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={createCVMutation.isPending}
            >
              {createCVMutation.isPending ? 'Creating...' : 'Create CV'}
            </Button>
          </div>

          {createCVMutation.isError && (
            <Card variant="default" className="mt-4 p-4 border-error/20 bg-error/5">
              <Small className="text-error">
                Failed to create CV: {createCVMutation.error?.message}
              </Small>
            </Card>
          )}
        </form>
      </Container>
    </Section>
  )
}

function ThemePreviewIcon({ themeId }: { themeId: string }) {
  // Simple visual representation of each theme style
  switch (themeId) {
    case 'professional':
      return (
        <div className="w-16 text-mid-gray/40">
          <div className="border-b-2 border-current pb-1 mb-2">
            <div className="h-2 w-12 bg-current rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-full bg-current/50 rounded" />
            <div className="h-1 w-10 bg-current/50 rounded" />
            <div className="h-1 w-14 bg-current/50 rounded" />
          </div>
        </div>
      )
    case 'modern':
      return (
        <div className="w-16 text-mid-gray/40">
          <div className="bg-charcoal/20 p-1 rounded mb-2">
            <div className="h-2 w-10 bg-amber/50 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="col-span-2 space-y-1">
              <div className="h-1 w-full bg-current/50 rounded" />
              <div className="h-1 w-8 bg-current/50 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-1 w-full bg-current/30 rounded" />
              <div className="h-1 w-3 bg-current/30 rounded" />
            </div>
          </div>
        </div>
      )
    case 'minimal':
      return (
        <div className="w-16 text-mid-gray/40 text-center">
          <div className="h-2 w-10 bg-current/30 rounded mx-auto mb-2" />
          <div className="h-0.5 w-8 bg-current/20 rounded mx-auto mb-2" />
          <div className="space-y-1">
            <div className="h-1 w-full bg-current/50 rounded" />
            <div className="h-1 w-12 bg-current/50 rounded mx-auto" />
          </div>
        </div>
      )
    default:
      return null
  }
}
