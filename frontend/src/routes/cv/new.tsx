import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { ProtectedRoute } from '../../components/ProtectedRoute'
import { Container } from '../../components/ui/container'
import { Section } from '../../components/ui/section'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Body, H1, H2, Small } from '../../components/ui/typography'
import { useToast } from '../../components/ui/toast'
import { THEMES, getDefaultThemeId } from '../../lib/themes'
import { useCreateCV } from '../../hooks/useCVs'
import { useAnalyzeJob, useCredits, useGenerateCV } from '../../hooks/useAI'
import { cn } from '../../lib/utils'
import { JobInputForm } from '../../components/cv/JobInputForm'
import { MatchScore } from '../../components/cv/MatchScore'
import { SkillsAnalysis } from '../../components/cv/SkillsAnalysis'
import { SuggestionsPanel } from '../../components/cv/SuggestionsPanel'
import { CreditsDisplay } from '../../components/CreditsDisplay'

import type { JobAnalysis } from '../../types/ai'

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

type CVCreationType = 'blank' | 'tailored'
type TailoredStep = 'input' | 'analysis' | 'generating' | 'complete'

function NewCVContent() {
  const navigate = useNavigate()
  const toast = useToast()
  const [creationType, setCreationType] = useState<CVCreationType | null>(null)

  // Regular CV creation state
  const createCVMutation = useCreateCV()
  const [name, setName] = useState('')
  const [templateId, setTemplateId] = useState(getDefaultThemeId())

  // AI-powered CV creation state
  const [tailoredStep, setTailoredStep] = useState<TailoredStep>('input')
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null)

  const analyzeJobMutation = useAnalyzeJob()
  const generateCVMutation = useGenerateCV()
  const { data: credits } = useCredits()

  const hasCredits = credits && credits.remaining > 0

  const handleRegularSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const cv = await createCVMutation.mutateAsync({
        name: name || 'Untitled CV',
        template_id: templateId,
      })
      if (cv) {
        toast.success('CV created successfully')
        navigate({ to: '/cv/$cvId', params: { cvId: cv.id } })
      }
    } catch (err) {
      console.error('Failed to create CV:', err)
      toast.error('Failed to create CV')
    }
  }

  const handleAnalyzeJob = async (description: string) => {
    setJobDescription(description)
    try {
      const result = await analyzeJobMutation.mutateAsync({
        job_description: description,
      })
      if (result?.analysis) {
        setAnalysis(result.analysis)
        setTailoredStep('analysis')
        toast.success('Job analysis complete')
      }
    } catch (err) {
      console.error('Failed to analyze job:', err)
      toast.error('Failed to analyze job description')
    }
  }

  const handleGenerateCV = async () => {
    if (!analysis) return
    setTailoredStep('generating')

    try {
      const result = await generateCVMutation.mutateAsync({
        job_description: jobDescription,
        cv_name: name || `${jobTitle || 'Tailored'} CV`,
        job_title: jobTitle,
        company_name: companyName,
      })
      if (result?.cv) {
        toast.success('CV generated successfully')
        navigate({ to: '/cv/$cvId', params: { cvId: result.cv.id } })
      }
    } catch (err) {
      console.error('Failed to generate CV:', err)
      toast.error('Failed to generate CV')
      setTailoredStep('analysis')
    }
  }

  const resetToSelection = () => {
    setCreationType(null)
    setTailoredStep('input')
    setAnalysis(null)
    setJobDescription('')
    setJobTitle('')
    setCompanyName('')
    setName('')
  }

  // Selection screen
  if (!creationType) {
    return (
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="mb-12 text-center">
            <H1 className="text-charcoal">Create New CV</H1>
            <Body className="mt-2 text-mid-gray">
              Choose how you want to create your CV
            </Body>
          </div>

          <div className="mx-auto space-y-6">
            {/* Blank CV Option */}
            <Card
              variant="default"
              className="cursor-pointer hover:shadow-medium transition-all duration-200 hover:border-charcoal"
              onClick={() => setCreationType('blank')}
            >
              <div className="p-6">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-off-white flex items-center justify-center">
                    <DocumentIcon className="w-7 h-7 text-charcoal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <H2 className="text-charcoal mb-2">Blank CV</H2>
                    <Body className="text-mid-gray">
                      Start with your master profile and customize manually.
                      Best for when you want full control over every detail.
                    </Body>
                  </div>
                  <div className="shrink-0 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-off-white">
                    <ChevronRightIcon className="w-5 h-5 text-mid-gray" />
                  </div>
                </div>
              </div>
            </Card>

            {/* AI-Tailored CV Option */}
            <Card
              variant={hasCredits ? 'elevated' : 'default'}
              className={cn(
                'transition-all duration-200',
                hasCredits
                  ? 'cursor-pointer hover:shadow-elevated border-amber/50 hover:border-amber bg-gradient-to-r from-amber/5 to-transparent'
                  : 'opacity-60 cursor-not-allowed'
              )}
              onClick={() => hasCredits && setCreationType('tailored')}
            >
              <div className="p-6">
                <div className="flex items-start gap-5">
                  <div
                    className={cn(
                      'shrink-0 w-14 h-14 rounded-full flex items-center justify-center',
                      hasCredits ? 'bg-amber/20' : 'bg-gray-200'
                    )}
                  >
                    <SparklesIcon
                      className={cn(
                        'w-7 h-7',
                        hasCredits ? 'text-amber-dark' : 'text-gray-400'
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <H2 className="text-charcoal">AI-Tailored CV</H2>
                      <span className="px-2 py-0.5 text-xs font-semibold bg-amber text-charcoal rounded-full">
                        AI
                      </span>
                    </div>
                    <Body className="text-mid-gray">
                      Paste a job description and let AI analyze and tailor your
                      CV automatically. Uses 1 credit.
                    </Body>
                    {!hasCredits && (
                      <Small className="text-coral mt-3 block font-medium">
                        No credits remaining
                      </Small>
                    )}
                  </div>
                  <div
                    className={cn(
                      'shrink-0 hidden sm:flex items-center justify-center w-10 h-10 rounded-full',
                      hasCredits ? 'bg-amber/10' : 'bg-gray-100'
                    )}
                  >
                    <ChevronRightIcon
                      className={cn(
                        'w-5 h-5',
                        hasCredits ? 'text-amber-dark' : 'text-gray-400'
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Credits display */}
          <div className="mt-10 flex justify-center">
            <CreditsDisplay variant="full" />
          </div>
        </Container>
      </Section>
    )
  }

  // Blank CV creation flow
  if (creationType === 'blank') {
    return (
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="mb-8">
            <button
              onClick={resetToSelection}
              className="text-mid-gray hover:text-charcoal mb-4 flex items-center gap-1 text-sm"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Back
            </button>
            <H1 className="text-charcoal">Create Blank CV</H1>
            <Body className="mt-2 text-mid-gray">
              Start from your master profile and customize for your target role
            </Body>
          </div>

          <form onSubmit={handleRegularSubmit}>
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
                    <Body className="font-semibold text-charcoal">
                      {theme.name}
                    </Body>
                    <Small className="text-mid-gray">{theme.description}</Small>
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={resetToSelection}>
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
              <Card
                variant="default"
                className="mt-4 p-4 border-error/20 bg-error/5"
              >
                <Small className="text-error">
                  Failed to create CV: {createCVMutation.error.message}
                </Small>
              </Card>
            )}
          </form>
        </Container>
      </Section>
    )
  }

  // AI-Tailored CV creation flow
  return (
    <Section spacing="lg">
      <Container maxWidth="lg">
        <div className="mb-8">
          <button
            onClick={
              tailoredStep === 'input' ? resetToSelection : () => setTailoredStep('input')
            }
            className="text-mid-gray hover:text-charcoal mb-4 flex items-center gap-1 text-sm"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            {tailoredStep === 'input' ? 'Back' : 'Start Over'}
          </button>
          <div className="flex items-center gap-3">
            <H1 className="text-charcoal">AI-Tailored CV</H1>
            <CreditsDisplay variant="badge" />
          </div>
          <Body className="mt-2 text-mid-gray">
            {tailoredStep === 'input' &&
              'Paste a job description to analyze your fit and generate a tailored CV'}
            {tailoredStep === 'analysis' &&
              'Review the analysis and generate your tailored CV'}
            {tailoredStep === 'generating' && 'Generating your tailored CV...'}
          </Body>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['input', 'analysis', 'complete'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  tailoredStep === step ||
                    (tailoredStep === 'generating' && step === 'analysis')
                    ? 'bg-amber text-charcoal'
                    : ['analysis', 'generating', 'complete'].includes(tailoredStep) &&
                      step === 'input'
                      ? 'bg-success text-white'
                      : 'bg-gray-200 text-mid-gray'
                )}
              >
                {['analysis', 'generating', 'complete'].includes(tailoredStep) &&
                  step === 'input' ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div
                  className={cn(
                    'w-16 h-1 mx-2',
                    (tailoredStep === 'analysis' ||
                      tailoredStep === 'generating') &&
                      index === 0
                      ? 'bg-success'
                      : tailoredStep === 'complete' && index <= 1
                        ? 'bg-success'
                        : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Job Input */}
        {tailoredStep === 'input' && (
          <Card variant="default" className="p-6">
            <H2 className="text-charcoal mb-4">Enter Job Details</H2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="job-title">Job Title (Optional)</Label>
                <Input
                  id="job-title"
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="company-name">Company Name (Optional)</Label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder="e.g., Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <JobInputForm
              onSubmit={handleAnalyzeJob}
              isLoading={analyzeJobMutation.isPending}
            />

            {analyzeJobMutation.isError && (
              <Card
                variant="default"
                className="mt-4 p-4 border-error/20 bg-error/5"
              >
                <Small className="text-error">
                  {analyzeJobMutation.error.message}
                </Small>
              </Card>
            )}
          </Card>
        )}

        {/* Step 2: Analysis Results */}
        {(tailoredStep === 'analysis' || tailoredStep === 'generating') &&
          analysis && (
            <div className="space-y-6">
              {/* Match Score Card */}
              <Card variant="elevated" className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <MatchScore score={analysis.match_score} size="lg" />
                  <div className="flex-1 text-center md:text-left">
                    <H2 className="text-charcoal mb-2">
                      {jobTitle || 'Job'} Analysis
                      {companyName && ` at ${companyName}`}
                    </H2>
                    <Body className="text-mid-gray">
                      Based on your profile, here's how well you match this
                      position and suggestions for your tailored CV.
                    </Body>
                  </div>
                </div>
              </Card>

              {/* Skills Analysis */}
              <Card variant="default" className="p-6">
                <SkillsAnalysis
                  matchingSkills={analysis.matching_skills}
                  missingSkills={analysis.missing_skills}
                />
              </Card>

              {/* Suggestions */}
              <Card variant="default" className="p-6">
                <SuggestionsPanel
                  suggestions={analysis.suggestions}
                  keywords={analysis.keywords_to_include}
                  relevantExperiences={analysis.relevant_experiences}
                />
              </Card>

              {/* CV Name Input */}
              <Card variant="default" className="p-6">
                <div>
                  <Label htmlFor="cv-name-tailored">CV Name</Label>
                  <Input
                    id="cv-name-tailored"
                    type="text"
                    placeholder={`${jobTitle || 'Tailored'} CV${companyName ? ` - ${companyName}` : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                  <Small className="text-mid-gray mt-1">
                    Give your CV a name to easily identify it later
                  </Small>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setTailoredStep('input')}
                  disabled={tailoredStep === 'generating'}
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={handleGenerateCV}
                  variant="default"
                  size="lg"
                  disabled={
                    tailoredStep === 'generating' || generateCVMutation.isPending
                  }
                >
                  {tailoredStep === 'generating' ||
                    generateCVMutation.isPending ? (
                    <>
                      <LoadingSpinner />
                      Generating CV...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      Generate Tailored CV
                    </>
                  )}
                </Button>
              </div>

              {generateCVMutation.isError && (
                <Card
                  variant="default"
                  className="p-4 border-error/20 bg-error/5"
                >
                  <Small className="text-error">
                    {generateCVMutation.error.message}
                  </Small>
                </Card>
              )}
            </div>
          )}
      </Container>
    </Section>
  )
}

// Icons
function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function ThemePreviewIcon({ themeId }: { themeId: string }) {
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
