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

import type { Volunteer } from '../../types/json-resume'

interface VolunteerFormProps {
  data: Volunteer[]
}

export function VolunteerForm({ data }: VolunteerFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Volunteer[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Volunteer[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'volunteer',
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
        organization: '',
        position: '',
        url: '',
        startDate: '',
        endDate: '',
        summary: '',
        highlights: [],
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (
    index: number,
    field: keyof Volunteer,
    value: unknown
  ) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <H2 className="text-charcoal">Volunteer Experience</H2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No volunteer experience added"
          description="Add your volunteer work and community involvement"
          actionLabel="Add Volunteer Experience"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((vol, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Volunteer Role"
              onRemove={() => handleRemove(index)}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Organization"
                    value={vol.organization ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'organization', e.target.value)
                    }
                    placeholder="Red Cross"
                  />
                  <FormField
                    label="Position"
                    value={vol.position ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'position', e.target.value)
                    }
                    placeholder="Volunteer Coordinator"
                  />
                  <FormField
                    label="Start Date"
                    type="month"
                    value={vol.startDate ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'startDate', e.target.value)
                    }
                  />
                  <FormField
                    label="End Date"
                    type="month"
                    value={vol.endDate ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                  />
                  <FormField
                    label="Organization URL"
                    type="url"
                    value={vol.url ?? ''}
                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="sm:col-span-2"
                  />
                </div>
                <FormField
                  label="Summary"
                  as="textarea"
                  value={vol.summary ?? ''}
                  onChange={(e) =>
                    handleChange(index, 'summary', e.target.value)
                  }
                  placeholder="Brief description of your role..."
                  rows={2}
                />
                <TagInput
                  label="Highlights"
                  value={vol.highlights ?? []}
                  onChange={(value) => handleChange(index, 'highlights', value)}
                  placeholder="Key achievement..."
                />
              </div>
            </ListItemForm>
          ))}

          <FormSection
            title=""
            action={
              <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
                + Add Another Volunteer Experience
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
