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

import type { Work } from '../../types/json-resume'

interface WorkExperienceFormProps {
  data: Work[]
}

export function WorkExperienceForm({ data }: WorkExperienceFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Work[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Work[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'work',
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
        name: '',
        position: '',
        url: '',
        startDate: '',
        endDate: '',
        summary: '',
        highlights: [],
        location: '',
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof Work, value: unknown) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Work Experience</h2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No work experience added"
          description="Add your professional experience to showcase your career history"
          actionLabel="Add Work Experience"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((work, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Position"
              onRemove={() => handleRemove(index)}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Company Name"
                    value={work.name ?? ''}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="Acme Inc."
                  />
                  <FormField
                    label="Position"
                    value={work.position ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'position', e.target.value)
                    }
                    placeholder="Senior Developer"
                  />
                  <FormField
                    label="Start Date"
                    type="month"
                    value={work.startDate ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'startDate', e.target.value)
                    }
                  />
                  <FormField
                    label="End Date"
                    type="month"
                    value={work.endDate ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                    placeholder="Leave empty if current"
                  />
                  <FormField
                    label="Location"
                    value={work.location ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'location', e.target.value)
                    }
                    placeholder="San Francisco, CA"
                  />
                  <FormField
                    label="Company URL"
                    type="url"
                    value={work.url ?? ''}
                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                    placeholder="https://acme.com"
                  />
                </div>
                <FormField
                  label="Summary"
                  as="textarea"
                  value={work.summary ?? ''}
                  onChange={(e) =>
                    handleChange(index, 'summary', e.target.value)
                  }
                  placeholder="Brief description of your role and responsibilities..."
                  rows={3}
                />
                <TagInput
                  label="Highlights / Achievements"
                  value={work.highlights ?? []}
                  onChange={(value) => handleChange(index, 'highlights', value)}
                  placeholder="Add an achievement and press Enter"
                />
              </div>
            </ListItemForm>
          ))}

          <FormSection
            title=""
            action={
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                + Add Another Position
              </button>
            }
          >
            <></>
          </FormSection>
        </div>
      )}
    </div>
  )
}
