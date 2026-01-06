import { useState } from 'react'

import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Small } from '../ui/typography'

interface JobInputFormProps {
  onSubmit: (jobDescription: string) => void
  isLoading?: boolean
  disabled?: boolean
}

export function JobInputForm({
  onSubmit,
  isLoading = false,
  disabled = false,
}: JobInputFormProps) {
  const [jobDescription, setJobDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (jobDescription.trim()) {
      onSubmit(jobDescription.trim())
    }
  }

  const characterCount = jobDescription.length
  const minCharacters = 100
  const isValidLength = characterCount >= minCharacters

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="job-description">Job Description</Label>
        <Textarea
          id="job-description"
          placeholder="Paste the full job description here. Include requirements, responsibilities, and any other relevant information from the job posting..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={12}
          className="mt-2 font-mono text-sm"
          disabled={disabled || isLoading}
        />
        <div className="flex justify-between items-center mt-2">
          <Small className="text-mid-gray">
            Tip: Include the complete job description for better analysis
          </Small>
          <Small
            className={
              isValidLength ? 'text-success' : 'text-mid-gray'
            }
          >
            {characterCount} characters
            {!isValidLength && ` (min ${minCharacters})`}
          </Small>
        </div>
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={!isValidLength || isLoading || disabled}
        className="w-full"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Analyzing...
          </>
        ) : (
          'Analyze Job Match'
        )}
      </Button>
    </form>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
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
  )
}
