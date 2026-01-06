import { useState, useEffect, useCallback } from 'react'

import { useUpdateProfileSection } from '../../hooks/useProfile'
import {
  FormField,
  FormSection,
  ListItemForm,
  SaveButton,
  EmptyState,
} from './FormComponents'

import type { Publication } from '../../types/json-resume'

interface PublicationsFormProps {
  data: Publication[]
}

export function PublicationsForm({ data }: PublicationsFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Publication[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Publication[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'publications',
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
        publisher: '',
        releaseDate: '',
        url: '',
        summary: '',
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (
    index: number,
    field: keyof Publication,
    value: string
  ) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Publications</h2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No publications added"
          description="Add your publications, articles, and research papers"
          actionLabel="Add Publication"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((pub, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Publication"
              onRemove={() => handleRemove(index)}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Publication Title"
                    value={pub.name ?? ''}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="Article or Paper Title"
                  />
                  <FormField
                    label="Publisher"
                    value={pub.publisher ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'publisher', e.target.value)
                    }
                    placeholder="Journal, Blog, etc."
                  />
                  <FormField
                    label="Release Date"
                    type="month"
                    value={pub.releaseDate ?? ''}
                    onChange={(e) =>
                      handleChange(index, 'releaseDate', e.target.value)
                    }
                  />
                  <FormField
                    label="URL"
                    type="url"
                    value={pub.url ?? ''}
                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <FormField
                  label="Summary"
                  as="textarea"
                  value={pub.summary ?? ''}
                  onChange={(e) =>
                    handleChange(index, 'summary', e.target.value)
                  }
                  placeholder="Brief description of the publication..."
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
                + Add Another Publication
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
