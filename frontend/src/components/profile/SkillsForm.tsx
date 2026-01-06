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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Skills</h2>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Proficiency Level
                    </label>
                    <select
                      value={skill.level ?? ''}
                      onChange={(e) =>
                        handleChange(index, 'level', e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                + Add Another Skill
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
