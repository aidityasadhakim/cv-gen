import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

import { ProtectedRoute } from '../../../components/ProtectedRoute'
import { ThemeRenderer } from '../../../components/cv/ThemeRenderer'
import { TemplateSelector } from '../../../components/cv/TemplateSelector'
import { GenerateCoverLetterModal } from '../../../components/cover-letter/GenerateCoverLetterModal'
import { SuggestionsPanel } from '../../../components/cv/SuggestionsPanel'
import { MatchScore } from '../../../components/cv/MatchScore'
import { SkillsAnalysis } from '../../../components/cv/SkillsAnalysis'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Body, H2, Small } from '../../../components/ui/typography'
import { LoadingSpinner } from '../../../components/ui/loading-spinner'
import { useCV, useUpdateCV } from '../../../hooks/useCVs'
import { useEscapeKey } from '../../../hooks/useKeyboardShortcuts'
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
  const navigate = useNavigate()
  const { data: cv, isLoading, error } = useCV(cvId)
  const updateMutation = useUpdateCV()
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [localResume, setLocalResume] = useState<JSONResume | null>(null)
  const [templateId, setTemplateId] = useState<string>('professional')
  const [hiddenSections, setHiddenSections] = useState<Set<ResumeSectionId>>(new Set())
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [showAISuggestionsModal, setShowAISuggestionsModal] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  console.log(cv?.ai_suggestions)

  // Close mobile sidebar with Escape key
  useEscapeKey(() => setShowMobileSidebar(false), showMobileSidebar)

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
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
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
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                  <svg
                    className="w-4 h-4 sm:mr-1"
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
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </Link>

              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-40 sm:w-64"
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
                  className="text-base sm:text-lg font-semibold text-charcoal hover:text-amber transition-colors truncate max-w-[150px] sm:max-w-none"
                >
                  {cv.name}
                  <svg
                    className="w-4 h-4 inline ml-1 sm:ml-2 text-mid-gray"
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

            <div className="flex items-center gap-1 sm:gap-2">
              {updateMutation.isPending && (
                <Small className="text-mid-gray hidden sm:block">Saving...</Small>
              )}
              {/* Mobile settings button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden px-2"
                onClick={() => setShowMobileSidebar(true)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Button>
              {/* AI Suggestions button - only show if CV has AI suggestions */}
              {cv.ai_suggestions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAISuggestionsModal(true)}
                  className="hidden sm:flex"
                  title="View AI Suggestions"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-amber"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  AI Suggestions
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowCoverLetterModal(true)}
                className="hidden sm:flex"
              >
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Cover Letter
              </Button>
              <Button variant="default" size="sm" onClick={handlePrint}>
                <svg
                  className="w-4 h-4 sm:mr-2"
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
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto print:max-w-none">
        <div className="flex print:block">
          {/* Sidebar - hidden on mobile, shown on lg screens */}
          <div className="hidden lg:block w-80 flex-shrink-0 p-4 print:hidden">
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
          <div className="flex-1 p-2 sm:p-4 print:p-0 overflow-x-auto">
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

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b">
              <H2 className="text-charcoal">Settings</H2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* AI Suggestions Button (mobile) - only show if CV has AI suggestions */}
              {cv.ai_suggestions && (
                <Button
                  variant="ghost"
                  className="w-full justify-start border border-amber/30 bg-amber/5"
                  onClick={() => {
                    setShowMobileSidebar(false)
                    setShowAISuggestionsModal(true)
                  }}
                >
                  <svg
                    className="w-4 h-4 mr-2 text-amber"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  View AI Suggestions
                </Button>
              )}

              {/* Cover Letter Button (mobile) */}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setShowMobileSidebar(false)
                  setShowCoverLetterModal(true)
                }}
              >
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Generate Cover Letter
              </Button>

              {/* Template Selector */}
              <Card variant="default" className="p-4">
                <H2 className="text-charcoal mb-3 text-sm">Template</H2>
                <TemplateSelector
                  value={templateId}
                  onChange={(id) => {
                    handleTemplateChange(id)
                  }}
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
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-md transition-colors',
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
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-amber hover:underline"
                  onClick={() => setShowMobileSidebar(false)}
                >
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
        </div>
      )}

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

      {/* Generate Cover Letter Modal */}
      <GenerateCoverLetterModal
        isOpen={showCoverLetterModal}
        cvId={cvId}
        jobTitle={cv.job_title}
        jobDescription={cv.job_description}
        companyName={cv.company_name}
        onClose={() => setShowCoverLetterModal(false)}
        onSuccess={(coverLetterId) => {
          setShowCoverLetterModal(false)
          navigate({ to: '/cover-letter/$id', params: { id: coverLetterId } })
        }}
      />

      {/* AI Suggestions Modal */}
      {showAISuggestionsModal && cv.ai_suggestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAISuggestionsModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-elevated w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <H2 className="text-charcoal">AI Suggestions</H2>
              </div>
              <button
                onClick={() => setShowAISuggestionsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Match Score */}
              {cv.ai_suggestions.match_score > 0 && (
                <div className="mb-6 flex items-center gap-4">
                  <MatchScore score={cv.ai_suggestions.match_score} size="md" />
                  <div>
                    <Body className="text-charcoal font-medium">
                      {cv.job_title || 'Job'} Match
                      {cv.company_name && ` at ${cv.company_name}`}
                    </Body>
                    <Small className="text-mid-gray">
                      Based on your profile analysis
                    </Small>
                  </div>
                </div>
              )}

              {/* Skills Analysis */}
              {(cv.ai_suggestions.matching_skills.length > 0 ||
                cv.ai_suggestions.missing_skills.length > 0) && (
                  <div className="mb-6">
                    <SkillsAnalysis
                      matchingSkills={cv.ai_suggestions.matching_skills}
                      missingSkills={cv.ai_suggestions.missing_skills}
                    />
                  </div>
                )}

              {/* Suggestions Panel */}
              <SuggestionsPanel
                suggestions={cv.ai_suggestions.suggestions}
                keywords={cv.ai_suggestions.keywords_to_include}
                relevantExperiences={cv.ai_suggestions.relevant_experiences}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
