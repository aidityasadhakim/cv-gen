import { useState } from 'react'

import { useProfile } from '../../hooks/useProfile'
import {
  RESUME_SECTIONS,
  calculateProfileCompletion,
  createEmptyJSONResume,
} from '../../types/json-resume'
import { Container } from '../ui/container'
import { Section } from '../ui/section'
import { Card } from '../ui/card'
import { Body, H1 } from '../ui/typography'

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber mx-auto" />
          <p className="mt-4 text-mid-gray">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-coral">Failed to load profile: {error.message}</p>
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
    <Section spacing="lg">
      <Container maxWidth="xl">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <H1 className="text-charcoal">Master Profile</H1>
              <Body className="mt-2 text-mid-gray">
                Your complete career information in JSON Resume format
              </Body>
            </div>
            <JsonImportExport resumeData={resumeData} />
          </div>
          <div className="mt-6">
            <ProgressIndicator completion={completion} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <SectionNav
              sections={RESUME_SECTIONS}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              resumeData={resumeData}
            />
          </div>

          <div className="flex-1 min-w-0">
            <Card variant="default" className="p-6">
              {renderActiveSection()}
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  )
}
