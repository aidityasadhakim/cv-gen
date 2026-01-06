import { useState, useEffect, useCallback } from 'react'

import { useUpdateProfileSection } from '../../hooks/useProfile'
import {
  FormField,
  FormSection,
  ListItemForm,
  SaveButton,
  EmptyState,
} from './FormComponents'

import type { Award } from '../../types/json-resume'

interface AwardsFormProps {
  data: Award[]
}

export function AwardsForm({ data }: AwardsFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Award[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Award[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'awards',
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
        title: '',
        date: '',
        awarder: '',
        summary: '',
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof Award, value: string) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Awards</h2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No awards added"
          description="Add your awards, honors, and recognitions"
          actionLabel="Add Award"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((award, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Award"
              onRemove={() => handleRemove(index)}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Award Title"
                    value={award.title ?? ''}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    placeholder="Employee of the Year"
                  />
                  <FormField
                    label="Awarder"
                    value={award.awarder ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'awarder', e.target.value)
                    }
                    placeholder="Company Name"
                  />
                  <FormField
                    label="Date"
                    type="month"
                    value={award.date ?? ''}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    className="sm:col-span-2"
                  />
                </div>
                <FormField
                  label="Summary"
                  as="textarea"
                  value={award.summary ?? ''}
                  onChange={(e) =>
                    handleChange(index, 'summary', e.target.value)
                  }
                  placeholder="Brief description of the award..."
                  rows={2}
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
                + Add Another Award
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
