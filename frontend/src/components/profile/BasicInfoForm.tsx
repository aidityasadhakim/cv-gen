import { useState, useEffect, useCallback } from 'react'

import { useUpdateProfileSection } from '../../hooks/useProfile'
import { FormField, FormSection } from './FormComponents'

import type { Basics, Profile as SocialProfile } from '../../types/json-resume'

interface BasicInfoFormProps {
  data?: Basics
}

export function BasicInfoForm({ data }: BasicInfoFormProps) {
  const updateSection = useUpdateProfileSection()
  const [formData, setFormData] = useState<Basics>(
    data ?? {
      name: '',
      email: '',
      label: '',
      phone: '',
      url: '',
      summary: '',
      location: {
        address: '',
        postalCode: '',
        city: '',
        countryCode: '',
        region: '',
      },
      profiles: [],
    }
  )
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Update form when data changes
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  // Debounced save
  const saveData = useCallback(
    async (newData: Basics) => {
      setSaveStatus('saving')
      try {
        await updateSection.mutateAsync({
          section: 'basics',
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

  // Handle field changes with auto-save
  const handleChange = (field: keyof Basics, value: string | SocialProfile[]) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
  }

  const handleLocationChange = (field: string, value: string) => {
    const newData = {
      ...formData,
      location: { ...formData.location, [field]: value },
    }
    setFormData(newData)
  }

  const handleSave = () => {
    saveData(formData)
  }

  const handleAddProfile = () => {
    const newProfiles = [
      ...(formData.profiles ?? []),
      { network: '', username: '', url: '' },
    ]
    setFormData({ ...formData, profiles: newProfiles })
  }

  const handleRemoveProfile = (index: number) => {
    const newProfiles = (formData.profiles ?? []).filter((_, i) => i !== index)
    setFormData({ ...formData, profiles: newProfiles })
  }

  const handleProfileChange = (
    index: number,
    field: keyof SocialProfile,
    value: string
  ) => {
    const newProfiles = [...(formData.profiles ?? [])]
    newProfiles[index] = { ...newProfiles[index], [field]: value }
    setFormData({ ...formData, profiles: newProfiles })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
        <SaveButton status={saveStatus} onSave={handleSave} />
      </div>

      <FormSection title="Personal Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
          />
          <FormField
            label="Professional Title"
            value={formData.label ?? ''}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="Senior Software Engineer"
          />
          <FormField
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
          />
          <FormField
            label="Phone"
            type="tel"
            value={formData.phone ?? ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 234 567 8900"
          />
          <FormField
            label="Website"
            type="url"
            value={formData.url ?? ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://johndoe.com"
            className="sm:col-span-2"
          />
        </div>
        <div className="mt-4">
          <FormField
            label="Professional Summary"
            as="textarea"
            value={formData.summary ?? ''}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Brief overview of your professional background and key strengths..."
            rows={4}
          />
        </div>
      </FormSection>

      <FormSection title="Location">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="City"
            value={formData.location?.city ?? ''}
            onChange={(e) => handleLocationChange('city', e.target.value)}
            placeholder="San Francisco"
          />
          <FormField
            label="Region/State"
            value={formData.location?.region ?? ''}
            onChange={(e) => handleLocationChange('region', e.target.value)}
            placeholder="California"
          />
          <FormField
            label="Country Code"
            value={formData.location?.countryCode ?? ''}
            onChange={(e) => handleLocationChange('countryCode', e.target.value)}
            placeholder="US"
          />
          <FormField
            label="Postal Code"
            value={formData.location?.postalCode ?? ''}
            onChange={(e) => handleLocationChange('postalCode', e.target.value)}
            placeholder="94105"
          />
          <FormField
            label="Address"
            value={formData.location?.address ?? ''}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            placeholder="123 Main St"
            className="sm:col-span-2"
          />
        </div>
      </FormSection>

      <FormSection
        title="Social Profiles"
        action={
          <button
            type="button"
            onClick={handleAddProfile}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            + Add Profile
          </button>
        }
      >
        {formData.profiles?.length === 0 ? (
          <p className="text-sm text-gray-500">
            No social profiles added yet. Add your LinkedIn, GitHub, Twitter,
            etc.
          </p>
        ) : (
          <div className="space-y-4">
            {formData.profiles?.map((profile, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Profile #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProfile(index)}
                    className="text-red-600 hover:text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <FormField
                    label="Network"
                    value={profile.network ?? ''}
                    onChange={(e) =>
                      handleProfileChange(index, 'network', e.target.value)
                    }
                    placeholder="LinkedIn"
                  />
                  <FormField
                    label="Username"
                    value={profile.username ?? ''}
                    onChange={(e) =>
                      handleProfileChange(index, 'username', e.target.value)
                    }
                    placeholder="johndoe"
                  />
                  <FormField
                    label="URL"
                    type="url"
                    value={profile.url ?? ''}
                    onChange={(e) =>
                      handleProfileChange(index, 'url', e.target.value)
                    }
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </FormSection>
    </div>
  )
}

function SaveButton({
  status,
  onSave,
}: {
  status: 'idle' | 'saving' | 'saved' | 'error'
  onSave: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={status === 'saving'}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      {status === 'saving' && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {status === 'idle' && 'Save'}
      {status === 'saving' && 'Saving...'}
      {status === 'saved' && 'Saved!'}
      {status === 'error' && 'Error - Try Again'}
    </button>
  )
}
