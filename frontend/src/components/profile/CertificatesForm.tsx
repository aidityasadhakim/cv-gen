import { useState, useEffect, useCallback } from 'react'

import { useUpdateProfileSection } from '../../hooks/useProfile'
import {
  FormField,
  FormSection,
  ListItemForm,
  SaveButton,
  EmptyState,
} from './FormComponents'

import type { Certificate } from '../../types/json-resume'

interface CertificatesFormProps {
  data: Certificate[]
}

export function CertificatesForm({ data }: CertificatesFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Certificate[]>(data)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')

  useEffect(() => {
    setFormData(data)
  }, [data])

  const saveData = useCallback(
    async (newData: Certificate[]) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'certificates',
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
        date: '',
        issuer: '',
        url: '',
      },
    ])
  }

  const handleRemove = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleChange = (
    index: number,
    field: keyof Certificate,
    value: string
  ) => {
    const newData = [...formData]
    newData[index] = { ...newData[index], [field]: value }
    setFormData(newData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Certificates</h2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      {formData.length === 0 ? (
        <EmptyState
          title="No certificates added"
          description="Add your professional certifications and credentials"
          actionLabel="Add Certificate"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-6">
          {formData.map((cert, index) => (
            <ListItemForm
              key={index}
              index={index}
              title="Certificate"
              onRemove={() => handleRemove(index)}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Certificate Name"
                  value={cert.name ?? ''}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                />
                <FormField
                  label="Issuing Organization"
                  value={cert.issuer ?? ''}
                  onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
                <FormField
                  label="Date"
                  type="month"
                  value={cert.date ?? ''}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                />
                <FormField
                  label="Certificate URL"
                  type="url"
                  value={cert.url ?? ''}
                  onChange={(e) => handleChange(index, 'url', e.target.value)}
                  placeholder="https://..."
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
                + Add Another Certificate
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
