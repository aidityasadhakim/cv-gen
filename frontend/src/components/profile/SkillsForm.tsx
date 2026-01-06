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
import { Label } from '../ui/label'

import type { Skill } from '../../types/json-resume'

interface SkillsFormProps {
  data: Skill[]
}

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master']

export function SkillsForm({ data }: SkillsFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Skill[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Skill[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'skills',
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
        level: '',
        keywords: [],
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof Skill, value: unknown) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <H2 className="text-charcoal">Skills</H2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No skills added"
          description="Add your technical and professional skills"
          actionLabel="Add Skill"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((skill, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Skill"
              onRemove={() => handleRemove(index)}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Skill Category"
                    value={skill.name ?? ''}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="Web Development"
                  />
                  <div>
                    <Label>Proficiency Level</Label>
                    <select
                      value={skill.level ?? ''}
                      onChange={(e) =>
                        handleChange(index, 'level', e.target.value)
                      }
                      className="flex h-11 w-full rounded-lg border-2 border-border bg-warm-white px-4 py-3 text-base text-charcoal transition-all duration-200 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20 mt-1"
                    >
                      <option value="">Select level</option>
                      {SKILL_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <TagInput
                  label="Keywords / Technologies"
                  value={skill.keywords ?? []}
                  onChange={(value) => handleChange(index, 'keywords', value)}
                  placeholder="React, TypeScript, Node.js..."
                />
              </div>
            </ListItemForm>
          ))}

          <FormSection
            title=""
            action={
              <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
                + Add Another Skill
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
