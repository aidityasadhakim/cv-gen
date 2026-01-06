import { cn } from '../../lib/utils'

import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'

interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  required?: boolean
  error?: string
  as?: 'input' | 'textarea'
  rows?: number
  className?: string
}

export function FormField({
  label,
  required,
  error,
  as = 'input',
  rows = 3,
  className,
  ...props
}: FormFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = props.id ?? label.toLowerCase().replace(/\s+/g, '-')
  const inputClasses = cn(
    'mt-1 block w-full rounded-md shadow-sm sm:text-sm',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
  )

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={inputId}
          rows={rows}
          className={inputClasses}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          className={inputClasses}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

interface FormSectionProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export function FormSection({
  title,
  description,
  action,
  children,
}: FormSectionProps) {
  return (
    <div className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

interface ListItemFormProps {
  index: number
  title: string
  onRemove: () => void
  children: ReactNode
}

export function ListItemForm({
  index,
  title,
  onRemove,
  children,
}: ListItemFormProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-medium text-gray-700">
          {title} #{index + 1}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-500 text-sm"
        >
          Remove
        </button>
      </div>
      {children}
    </div>
  )
}

interface SaveButtonProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
  onSave: () => void
}

export function SaveButton({ status, onSave }: SaveButtonProps) {
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

interface EmptyStateProps {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-6">
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {actionLabel}
      </button>
    </div>
  )
}

interface TagInputProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function TagInput({
  label,
  value,
  onChange,
  placeholder = 'Type and press Enter',
}: TagInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const input = e.currentTarget
      const newTag = input.value.trim()
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag])
        input.value = ''
      }
    }
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {value.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                >
                  <span className="sr-only">Remove {tag}</span>
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M1.41 0L0 1.41l2.59 2.59L0 6.59 1.41 8l2.59-2.59L6.59 8 8 6.59 5.41 4 8 1.41 6.59 0 4 2.59 1.41 0z" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
