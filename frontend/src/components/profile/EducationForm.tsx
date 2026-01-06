import { useState, useEffect, useCallback } from 'react'

import { useUpdateProfileSection } from '../../hooks/useProfile'
import {
  FormField,
  FormSection,
  ListItemForm,
  SaveButton,
  EmptyState,
  TagInput,
} from './FormComponents'
import { Button } from '../ui/button'
import { H2 } from '../ui/typography'

import type { Education } from '../../types/json-resume'

interface EducationFormProps {
  data: Education[]
}

export function EducationForm({ data }: EducationFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Education[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Education[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'education',
          data: newData,
        })
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch {
        setSaveStatus('error')
      }
    },
    [updateSection]
  )

  const handleSave = () => saveData(formData)

  const handleAdd = () => {
    setFormData([
      ...formData,
      {
        institution: '',
        url: '',
        area: '',
        studyType: '',
        startDate: '',
        endDate: '',
        score: '',
        courses: [],
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (
    index: number,
    field: keyof Education,
    value: unknown
  ) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <H2 className="text-charcoal">Education</H2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No education added"
          description="Add your educational background and qualifications"
          actionLabel="Add Education"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((edu, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Education"
              onRemove={() => handleRemove(index)}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Institution"
                    value={edu.institution ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'institution', e.target.value)
                    }
                    placeholder="Stanford University"
                  />
                  <FormField
                    label="Degree / Study Type"
                    value={edu.studyType ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'studyType', e.target.value)
                    }
                    placeholder="Bachelor of Science"
                  />
                  <FormField
                    label="Field of Study"
                    value={edu.area ?? ''}
                    onChange={(e) => handleChange(index, 'area', e.target.value)}
                    placeholder="Computer Science"
                  />
                  <FormField
                    label="Score / GPA"
                    value={edu.score ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'score', e.target.value)
                    }
                    placeholder="3.8/4.0"
                  />
                  <FormField
                    label="Start Date"
                    type="month"
                    value={edu.startDate ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'startDate', e.target.value)
                    }
                  />
                  <FormField
                    label="End Date"
                    type="month"
                    value={edu.endDate ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                  />
                  <FormField
                    label="Institution URL"
                    type="url"
                    value={edu.url ?? ''}
                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                    placeholder="https://stanford.edu"
                    className="sm:col-span-2"
                  />
                </div>
                <TagInput
                  label="Relevant Courses"
                  value={edu.courses ?? []}
                  onChange={(value) => handleChange(index, 'courses', value)}
                  placeholder="Add a course and press Enter"
                />
              </div>
            </ListItemForm>
          ))}

          <FormSection
            title=""
            action={
              <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
                + Add Another Education
              </Button>
            }
          >
            <></>
          </FormSection>
        </div>
      )}
    </div>
  )
}
