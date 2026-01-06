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

import type { Interest } from '../../types/json-resume'

interface InterestsFormProps {
  data: Interest[]
}

export function InterestsForm({ data }: InterestsFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Interest[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Interest[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'interests',
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
        keywords: [],
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (
    index: number,
    field: keyof Interest,
    value: unknown
  ) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <H2 className="text-charcoal">Interests</H2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No interests added"
          description="Add your hobbies and personal interests"
          actionLabel="Add Interest"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((interest, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Interest"
              onRemove={() => handleRemove(index)}
            >
              <div className="space-y-4">
                <FormField
                  label="Interest Category"
                  value={interest.name ?? ''}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="Photography, Hiking, etc."
                />
                <TagInput
                  label="Keywords"
                  value={interest.keywords ?? []}
                  onChange={(value) => handleChange(index, 'keywords', value)}
                  placeholder="Landscape, Portrait, etc."
                />
              </div>
            </ListItemForm>
          ))}

          <FormSection
            title=""
            action={
              <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
                + Add Another Interest
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
