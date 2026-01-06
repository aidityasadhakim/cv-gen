import { useState, useEffect, useCallback } from 'react'

import { useUpdateProfileSection } from '../../hooks/useProfile'
import {
  FormField,
  FormSection,
  ListItemForm,
  SaveButton,
  EmptyState,
} from './FormComponents'
import { Button } from '../ui/button'
import { H2 } from '../ui/typography'

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <H2 className="text-charcoal">References</H2>
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
              <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
                + Add Another Reference
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
