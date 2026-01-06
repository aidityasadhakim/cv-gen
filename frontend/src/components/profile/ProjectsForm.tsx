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

import type { Project } from '../../types/json-resume'

interface ProjectsFormProps {
  data: Project[]
}

export function ProjectsForm({ data }: ProjectsFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Project[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Project[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'projects',
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
        description: '',
        highlights: [],
        keywords: [],
        startDate: '',
        endDate: '',
        url: '',
        roles: [],
        entity: '',
        type: '',
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof Project, value: unknown) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <H2 className="text-charcoal">Projects</H2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No projects added"
          description="Add personal or professional projects to showcase your work"
          actionLabel="Add Project"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((project, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Project"
              onRemove={() => handleRemove(index)}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Project Name"
                    value={project.name ?? ''}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="Open Source Library"
                  />
                  <FormField
                    label="Project Type"
                    value={project.type ?? ''}
                    onChange={(e) => handleChange(index, 'type', e.target.value)}
                    placeholder="Open Source, Personal, Client"
                  />
                  <FormField
                    label="Entity / Organization"
                    value={project.entity ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'entity', e.target.value)
                    }
                    placeholder="Personal, Company Name"
                  />
                  <FormField
                    label="Project URL"
                    type="url"
                    value={project.url ?? ''}
                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                  <FormField
                    label="Start Date"
                    type="month"
                    value={project.startDate ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'startDate', e.target.value)
                    }
                  />
                  <FormField
                    label="End Date"
                    type="month"
                    value={project.endDate ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                  />
                </div>
                <FormField
                  label="Description"
                  as="textarea"
                  value={project.description ?? ''}
                  onChange={(e) =>
                    handleChange(index, 'description', e.target.value)
                  }
                  placeholder="Brief description of the project..."
                  rows={3}
                />
                <TagInput
                  label="Roles"
                  value={project.roles ?? []}
                  onChange={(value) => handleChange(index, 'roles', value)}
                  placeholder="Lead Developer, Designer..."
                />
                <TagInput
                  label="Technologies / Keywords"
                  value={project.keywords ?? []}
                  onChange={(value) => handleChange(index, 'keywords', value)}
                  placeholder="React, Node.js, PostgreSQL..."
                />
                <TagInput
                  label="Highlights"
                  value={project.highlights ?? []}
                  onChange={(value) => handleChange(index, 'highlights', value)}
                  placeholder="Key achievement or feature..."
                />
              </div>
            </ListItemForm>
          ))}

          <FormSection
            title=""
            action={
              <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
                + Add Another Project
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
