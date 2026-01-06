import { useState, useCallback, useRef, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { ProtectedRoute } from '../../../components/ProtectedRoute'
import { ThemeRenderer } from '../../../components/cv/ThemeRenderer'
import { TemplateSelector } from '../../../components/cv/TemplateSelector'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { H2, Body, Small } from '../../../components/ui/typography'
import { useCV, useUpdateCV } from '../../../hooks/useCVs'
import { RESUME_SECTIONS, sectionHasContent } from '../../../types/json-resume'
import { cn } from '../../../lib/utils'

import type { JSONResume, ResumeSectionId } from '../../../types/json-resume'

export const Route = createFileRoute('/cv/$cvId/')({
  component: CVEditorPage,
})

function CVEditorPage() {
  const { cvId } = Route.useParams()

  return (
    <ProtectedRoute>
      <CVEditorContent cvId={cvId} />
    </ProtectedRoute>
  )
}

function CVEditorContent({ cvId }: { cvId: string }) {
  const { data: cv, isLoading, error } = useCV(cvId)
  const updateMutation = useUpdateCV()
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [localResume, setLocalResume] = useState<JSONResume | null>(null)
  const [templateId, setTemplateId] = useState<string>('professional')
  const [hiddenSections, setHiddenSections] = useState<Set<ResumeSectionId>>(new Set())
  const printRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initialize local state when CV loads
  useEffect(() => {
    if (cv) {
      setLocalResume(cv.cv_data)
      setTemplateId(cv.template_id || 'professional')
      setEditedName(cv.name)
    }
  }, [cv])

  // Auto-save function with debounce
  const saveChanges = useCallback(
    (updates: { name?: string; cv_data?: JSONResume; template_id?: string }) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        updateMutation.mutate({ cvId, input: updates })
      }, 1000)
    },
    [cvId, updateMutation]
  )

  const handleNameSave = () => {
    if (editedName !== cv?.name) {
      saveChanges({ name: editedName })
    }
    setIsEditingName(false)
  }

  const handleTemplateChange = (newTemplateId: string) => {
    setTemplateId(newTemplateId)
    saveChanges({ template_id: newTemplateId })
  }

  const handleToggleSection = (sectionId: ResumeSectionId) => {
    setHiddenSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const handlePrint = () => {
    window.print()
  }

  // Filter resume data based on hidden sections
  const filteredResume: JSONResume = localResume
    ? {
        ...localResume,
        work: hiddenSections.has('work') ? [] : localResume.work,
        education: hiddenSections.has('education') ? [] : localResume.education,
        skills: hiddenSections.has('skills') ? [] : localResume.skills,
        projects: hiddenSections.has('projects') ? [] : localResume.projects,
        certificates: hiddenSections.has('certificates') ? [] : localResume.certificates,
        awards: hiddenSections.has('awards') ? [] : localResume.awards,
        publications: hiddenSections.has('publications') ? [] : localResume.publications,
        languages: hiddenSections.has('languages') ? [] : localResume.languages,
        volunteer: hiddenSections.has('volunteer') ? [] : localResume.volunteer,
        interests: hiddenSections.has('interests') ? [] : localResume.interests,
        references: hiddenSections.has('references') ? [] : localResume.references,
      }
    : {}

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-amber border-t-transparent rounded-full mx-auto mb-4" />
          <Body className="text-mid-gray">Loading CV...</Body>
        </div>
      </div>
    )
  }

  if (error || !cv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card variant="default" className="p-8 text-center max-w-md">
          <Body className="text-error font-medium">Failed to load CV</Body>
          <Small className="text-mid-gray mt-2">
            {error?.message || 'CV not found'}
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
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
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

              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-64"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSave()
                      if (e.key === 'Escape') {
                        setEditedName(cv.name)
                        setIsEditingName(false)
                      }
                    }}
                  />
                  <Button variant="default" size="sm" onClick={handleNameSave}>
                    Save
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-lg font-semibold text-charcoal hover:text-amber transition-colors"
                >
                  {cv.name}
                  <svg
                    className="w-4 h-4 inline ml-2 text-mid-gray"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {updateMutation.isPending && (
                <Small className="text-mid-gray">Saving...</Small>
              )}
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto print:max-w-none">
        <div className="flex print:block">
          {/* Sidebar - hidden when printing */}
          <div className="w-80 flex-shrink-0 p-4 print:hidden">
            <div className="sticky top-20 space-y-4">
              {/* Template Selector */}
              <Card variant="default" className="p-4">
                <H2 className="text-charcoal mb-3 text-sm">Template</H2>
                <TemplateSelector
                  value={templateId}
                  onChange={handleTemplateChange}
                />
              </Card>

              {/* Section Toggles */}
              <Card variant="default" className="p-4">
                <H2 className="text-charcoal mb-3 text-sm">Sections</H2>
                <div className="space-y-2">
                  {RESUME_SECTIONS.map((section) => {
                    const hasContent = localResume
                      ? sectionHasContent(localResume, section.id)
                      : false
                    const isHidden = hiddenSections.has(section.id)

                    return (
                      <button
                        key={section.id}
                        onClick={() => handleToggleSection(section.id)}
                        disabled={!hasContent}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                          hasContent
                            ? isHidden
                              ? 'bg-gray-100 text-mid-gray'
                              : 'bg-amber/10 text-charcoal'
                            : 'bg-gray-50 text-mid-gray/50 cursor-not-allowed'
                        )}
                      >
                        <span>{section.label}</span>
                        {hasContent && (
                          <span className={cn(
                            'w-5 h-5 rounded flex items-center justify-center',
                            isHidden ? 'bg-gray-200' : 'bg-amber text-white'
                          )}>
                            {!isHidden && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                <Small className="text-mid-gray mt-3 block">
                  Toggle sections to show/hide them in your CV
                </Small>
              </Card>

              {/* Edit Profile Link */}
              <Card variant="default" className="p-4">
                <Link to="/profile" className="flex items-center gap-2 text-amber hover:underline">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <Small>Edit Master Profile</Small>
                </Link>
                <Small className="text-mid-gray mt-1 block">
                  Changes to your master profile will update this CV
                </Small>
              </Card>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 p-4 print:p-0">
            <div
              ref={printRef}
              className="bg-white shadow-lg mx-auto print:shadow-none print:mx-0"
              style={{
                width: '8.5in',
                minHeight: '11in',
                padding: '0.75in',
              }}
            >
              <ThemeRenderer resume={filteredResume} themeId={templateId} />
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: letter;
            margin: 0;
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
