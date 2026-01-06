import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

import { ProtectedRoute } from '../../components/ProtectedRoute'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Body, H2, Small } from '../../components/ui/typography'
import { Badge } from '../../components/ui/badge'
import { useToast } from '../../components/ui/toast'
import { LoadingSpinner } from '../../components/ui/loading-spinner'
import { useCoverLetter, useDeleteCoverLetter, useUpdateCoverLetter } from '../../hooks/useCoverLetters'

export const Route = createFileRoute('/cover-letter/$id')({
  component: CoverLetterPage,
})

function CoverLetterPage() {
  const { id } = Route.useParams()

  return (
    <ProtectedRoute>
      <CoverLetterContent coverLetterId={id} />
    </ProtectedRoute>
  )
}

function CoverLetterContent({ coverLetterId }: { coverLetterId: string }) {
  const navigate = useNavigate()
  const { data: coverLetter, isLoading, error } = useCoverLetter(coverLetterId)
  const updateMutation = useUpdateCoverLetter()
  const deleteMutation = useDeleteCoverLetter()
  const toast = useToast()

  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (coverLetter) {
      setContent(coverLetter.content)
    }
  }, [coverLetter])

  const saveChanges = useCallback(
    (newContent: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        updateMutation.mutate({
          coverLetterId,
          input: { content: newContent },
        })
      }, 1000)
    },
    [coverLetterId, updateMutation]
  )

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    saveChanges(newContent)
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('Copied to clipboard')
    } catch {
      console.error('Failed to copy to clipboard')
      toast.error('Failed to copy to clipboard')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this cover letter?')) {
      try {
        await deleteMutation.mutateAsync(coverLetterId)
        toast.success('Cover letter deleted')
        navigate({ to: '/dashboard' })
      } catch {
        toast.error('Failed to delete cover letter')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <Body className="text-mid-gray">Loading cover letter...</Body>
        </div>
      </div>
    )
  }

  if (error || !coverLetter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card variant="default" className="p-8 text-center">
          <Body className="text-error font-medium">Failed to load cover letter</Body>
          <Small className="text-mid-gray mt-2">
            {error?.message || 'Cover letter not found'}
          </Small>
          <Link to="/dashboard" className="inline-block mt-4">
            <Button variant="default">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream print:bg-white">
      {/* Header - hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </Button>
              </Link>

              <div>
                <H2 className="text-charcoal text-lg">Cover Letter</H2>
                <div className="flex items-center gap-2 mt-1">
                  {coverLetter.job_title && (
                    <Badge variant="default">{coverLetter.job_title}</Badge>
                  )}
                  {coverLetter.company_name && (
                    <Badge variant="secondary">{coverLetter.company_name}</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {updateMutation.isPending && (
                <Small className="text-mid-gray">Saving...</Small>
              )}
              <Button variant="ghost" size="sm" onClick={handleCopyToClipboard}>
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </Button>
              <Button variant="default" onClick={handlePrint}>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download PDF
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto p-4 print:p-0 print:max-w-none">
        <Card variant="default" className="print:shadow-none print:border-0">
          <div className="p-8 print:p-12">
            {/* Header for print */}
            <div className="hidden print:block mb-8">
              {coverLetter.job_title && coverLetter.company_name && (
                <div className="text-center mb-6">
                  <Body className="text-lg font-semibold text-charcoal">
                    Application for {coverLetter.job_title}
                  </Body>
                  <Small className="text-mid-gray">{coverLetter.company_name}</Small>
                </div>
              )}
            </div>

            {/* Edit Toggle */}
            <div className="print:hidden flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'View Mode' : 'Edit Mode'}
              </Button>
            </div>

            {/* Content */}
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[500px] font-serif text-base leading-relaxed"
                placeholder="Write your cover letter..."
              />
            ) : (
              <div className="prose prose-slate">
                {content.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-4 text-charcoal leading-relaxed font-serif"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: letter;
            margin: 1in;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
