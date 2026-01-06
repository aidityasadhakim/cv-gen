import { useState, useEffect, useCallback } from 'react'

import { useUpdateProfileSection } from '../../hooks/useProfile'
import {
  FormField,
  FormSection,
  ListItemForm,
  SaveButton,
  EmptyState,
} from './FormComponents'

import type { Reference } from '../../types/json-resume'

interface ReferencesFormProps {
  data: Reference[]
}

export function ReferencesForm({ data }: ReferencesFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Reference[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Reference[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'references',
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
        reference: '',
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (
    index: number,
    field: keyof Reference,
    value: string
  ) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">References</h2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No references added"
          description="Add professional references (optional - often requested separately)"
          actionLabel="Add Reference"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((ref, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Reference"
              onRemove={() => handleRemove(index)}
            >
              <div className="space-y-4">
                <FormField
                  label="Reference Name"
                  value={ref.name ?? ''}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="John Smith, Manager at Acme Inc."
                />
                <FormField
                  label="Reference Quote"
                  as="textarea"
                  value={ref.reference ?? ''}
                  onChange={(e) =>
                    handleChange(index, 'reference', e.target.value)
                  }
                  placeholder="A testimonial or quote from this reference..."
                  rows={3}
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
                + Add Another Reference
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
