import { useState } from 'react'

import { useProfile } from '../../hooks/useProfile'
import {
  RESUME_SECTIONS,
  calculateProfileCompletion,
  createEmptyJSONResume,
} from '../../types/json-resume'
import { SectionNav } from './SectionNav'
import { ProgressIndicator } from './ProgressIndicator'
import { BasicInfoForm } from './BasicInfoForm'
import { WorkExperienceForm } from './WorkExperienceForm'
import { EducationForm } from './EducationForm'
import { SkillsForm } from './SkillsForm'
import { ProjectsForm } from './ProjectsForm'
import { CertificatesForm } from './CertificatesForm'
import { AwardsForm } from './AwardsForm'
import { PublicationsForm } from './PublicationsForm'
import { LanguagesForm } from './LanguagesForm'
import { VolunteerForm } from './VolunteerForm'
import { InterestsForm } from './InterestsForm'
import { ReferencesForm } from './ReferencesForm'
import { JsonImportExport } from './JsonImportExport'

import type { ResumeSectionId } from '../../types/json-resume'

export function ProfileLayout() {
  const { data: profile, isLoading, error } = useProfile()
  const [activeSection, setActiveSection] = useState<ResumeSectionId>('basics')

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile: {error.message}</p>
        </div>
      </div>
    )
  }

  const resumeData = profile?.resume_data ?? createEmptyJSONResume()
  const completion = calculateProfileCompletion(resumeData)

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'basics':
        return <BasicInfoForm data={resumeData.basics} />
      case 'work':
        return <WorkExperienceForm data={resumeData.work ?? []} />
      case 'education':
        return <EducationForm data={resumeData.education ?? []} />
      case 'skills':
        return <SkillsForm data={resumeData.skills ?? []} />
      case 'projects':
        return <ProjectsForm data={resumeData.projects ?? []} />
      case 'certificates':
        return <CertificatesForm data={resumeData.certificates ?? []} />
      case 'awards':
        return <AwardsForm data={resumeData.awards ?? []} />
      case 'publications':
        return <PublicationsForm data={resumeData.publications ?? []} />
      case 'languages':
        return <LanguagesForm data={resumeData.languages ?? []} />
      case 'volunteer':
        return <VolunteerForm data={resumeData.volunteer ?? []} />
      case 'interests':
        return <InterestsForm data={resumeData.interests ?? []} />
      case 'references':
        return <ReferencesForm data={resumeData.references ?? []} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Master Profile</h1>
              <p className="mt-1 text-sm text-gray-600">
                Your complete career information in JSON Resume format
              </p>
            </div>
            <JsonImportExport resumeData={resumeData} />
          </div>
          <ProgressIndicator completion={completion} className="mt-4" />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <SectionNav
              sections={RESUME_SECTIONS}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              resumeData={resumeData}
            />
          </div>

          {/* Form Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white shadow rounded-lg p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
