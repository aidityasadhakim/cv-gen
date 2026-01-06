import { cn } from '../../lib/utils'

import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

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

  return (
    <div className={className}>
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-coral ml-1">*</span>}
      </Label>
      {as === 'textarea' ? (
        <Textarea
          id={inputId}
          rows={rows}
          className={cn(error && 'border-coral focus:border-coral focus:ring-coral/20')}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <Input
          id={inputId}
          className={cn(error && 'border-coral focus:border-coral focus:ring-coral/20')}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="mt-1 text-sm text-coral">{error}</p>}
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
    <div className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-mid-gray">{description}</p>
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
    <div className="border border-border rounded-xl p-5 bg-warm-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h4 className="text-sm font-medium text-charcoal">
          {title} #{index + 1}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-coral hover:text-coral hover:bg-coral/10 w-fit"
        >
          Remove
        </Button>
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
    <Button
      type="button"
      onClick={onSave}
      disabled={status === 'saving'}
      className="min-w-[100px]"
    >
      {status === 'saving' && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
      {status === 'error' && 'Error'}
    </Button>
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
    <div className="text-center py-12 px-4">
      <p className="font-medium text-charcoal">{title}</p>
      <p className="mt-2 text-sm text-mid-gray">{description}</p>
      <Button
        type="button"
        onClick={onAction}
        className="mt-6"
      >
        {actionLabel}
      </Button>
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
      <Label>{label}</Label>
      <div className="mt-2">
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {value.map((tag, index) => (
              <Badge key={index} variant="default">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-amber/30"
                >
                  <span className="sr-only">Remove {tag}</span>
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M1.41 0L0 1.41l2.59 2.59L0 6.59 1.41 8l2.59-2.59L6.59 8 8 6.59 5.41 4 8 1.41 6.59 0 4 2.59 1.41 0z" />
                  </svg>
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Input
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
