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
import { Label } from '../ui/label'

import type { Language } from '../../types/json-resume'

interface LanguagesFormProps {
  data: Language[]
}

const FLUENCY_LEVELS = [
  'Elementary',
  'Limited Working',
  'Professional Working',
  'Full Professional',
  'Native/Bilingual',
]

export function LanguagesForm({ data }: LanguagesFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Language[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Language[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'languages',
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
        language: '',
        fluency: '',
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (
    index: number,
    field: keyof Language,
    value: string
  ) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <H2 className="text-charcoal">Languages</H2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No languages added"
          description="Add the languages you speak and your proficiency level"
          actionLabel="Add Language"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((lang, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Language"
              onRemove={() => handleRemove(index)}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Language"
                  value={lang.language ?? ''}
                  onChange={(e) =>
                    handleChange(index, 'language', e.target.value)
                  }
                  placeholder="English"
                />
                <div>
                  <Label>Fluency Level</Label>
                  <select
                    value={lang.fluency ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'fluency', e.target.value)
                    }
                    className="flex h-11 w-full rounded-lg border-2 border-border bg-warm-white px-4 py-3 text-base text-charcoal transition-all duration-200 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20 mt-1"
                  >
                    <option value="">Select fluency</option>
                    {FLUENCY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </ListItemForm>
          ))}

          <FormSection
            title=""
            action={
              <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
                + Add Another Language
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
