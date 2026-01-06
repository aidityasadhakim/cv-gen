import { useState, useCallback } from 'react'

type ValidationRule<T> = {
  validate: (value: T) => boolean
  message: string
}

type FieldValidation<T> = {
  required?: boolean | string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  custom?: ValidationRule<T>[]
}

type FormErrors<T> = Partial<Record<keyof T, string>>
type FormTouched<T> = Partial<Record<keyof T, boolean>>

interface UseFormValidationOptions<T extends Record<string, unknown>> {
  initialValues: T
  validations: Partial<Record<keyof T, FieldValidation<T[keyof T]>>>
  onSubmit?: (values: T) => void | Promise<void>
}

export function useFormValidation<T extends Record<string, unknown>>({
  initialValues,
  validations,
  onSubmit,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<FormTouched<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | undefined => {
      const fieldValidation = validations[name]
      if (!fieldValidation) return undefined

      // Required check
      if (fieldValidation.required) {
        const isEmpty =
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)

        if (isEmpty) {
          return typeof fieldValidation.required === 'string'
            ? fieldValidation.required
            : 'This field is required'
        }
      }

      // Only validate further if there's a value
      if (value === undefined || value === null || value === '') {
        return undefined
      }

      const stringValue = String(value)

      // Min length check
      if (fieldValidation.minLength) {
        if (stringValue.length < fieldValidation.minLength.value) {
          return fieldValidation.minLength.message
        }
      }

      // Max length check
      if (fieldValidation.maxLength) {
        if (stringValue.length > fieldValidation.maxLength.value) {
          return fieldValidation.maxLength.message
        }
      }

      // Pattern check
      if (fieldValidation.pattern) {
        if (!fieldValidation.pattern.value.test(stringValue)) {
          return fieldValidation.pattern.message
        }
      }

      // Custom validations
      if (fieldValidation.custom) {
        for (const rule of fieldValidation.custom) {
          if (!rule.validate(value)) {
            return rule.message
          }
        }
      }

      return undefined
    },
    [validations]
  )

  const validateAllFields = useCallback((): FormErrors<T> => {
    const newErrors: FormErrors<T> = {}
    for (const key of Object.keys(validations) as (keyof T)[]) {
      const error = validateField(key, values[key])
      if (error) {
        newErrors[key] = error
      }
    }
    return newErrors
  }, [validateField, validations, values])

  const setValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({ ...prev, [name]: value }))
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[name]
          return next
        })
      }
    },
    [errors]
  )

  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }))
  }, [])

  const handleBlur = useCallback(
    (name: keyof T) => {
      setFieldTouched(name, true)
      const error = validateField(name, values[name])
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }))
      }
    },
    [setFieldTouched, validateField, values]
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()

      // Touch all fields
      const allTouched: FormTouched<T> = {}
      for (const key of Object.keys(validations) as (keyof T)[]) {
        allTouched[key] = true
      }
      setTouched(allTouched)

      // Validate all fields
      const newErrors = validateAllFields()
      setErrors(newErrors)

      if (Object.keys(newErrors).length > 0) {
        return false
      }

      if (onSubmit) {
        setIsSubmitting(true)
        try {
          await onSubmit(values)
        } finally {
          setIsSubmitting(false)
        }
      }

      return true
    },
    [validateAllFields, onSubmit, values, validations]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: values[name],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => setValue(name, e.target.value as T[keyof T]),
      onBlur: () => handleBlur(name),
      error: touched[name] && !!errors[name],
      errorMessage: touched[name] ? errors[name] : undefined,
    }),
    [values, setValue, handleBlur, touched, errors]
  )

  const isValid = Object.keys(errors).length === 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setFieldTouched,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
    validateField,
    validateAllFields,
  }
}

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s-()]+$/,
  url: /^https?:\/\/.+/,
  linkedIn: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
  github: /^https?:\/\/(www\.)?github\.com\/.+/,
}
