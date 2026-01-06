import { useEffect, useState } from 'react'

import { Modal, ModalFooter } from '../ui/modal'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Body, Small } from '../ui/typography'
import { useToast } from '../ui/toast'
import { useGenerateCoverLetter } from '../../hooks/useCoverLetters'

interface GenerateCoverLetterModalProps {
  isOpen: boolean
  cvId: string
  jobTitle?: string
  companyName?: string
  jobDescription?: string
  onClose: () => void
  onSuccess: (coverLetterId: string) => void
}

export function GenerateCoverLetterModal({
  isOpen,
  cvId,
  jobTitle: initialJobTitle = '',
  companyName: initialCompanyName = '',
  jobDescription: initialJobDescription = '',
  onClose,
  onSuccess,
}: GenerateCoverLetterModalProps) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle)
  const [companyName, setCompanyName] = useState(initialCompanyName)
  const [jobDescription, setJobDescription] = useState(initialJobDescription)
  const toast = useToast()

  // Reset form state when modal opens with new initial values
  useEffect(() => {
    if (isOpen) {
      setJobTitle(initialJobTitle)
      setCompanyName(initialCompanyName)
      setJobDescription(initialJobDescription)
    }
  }, [isOpen, initialJobTitle, initialCompanyName, initialJobDescription])

  const generateMutation = useGenerateCoverLetter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!jobTitle || !companyName) {
      return
    }

    try {
      const result = await generateMutation.mutateAsync({
        cv_id: cvId,
        job_title: jobTitle,
        company_name: companyName,
        job_description: jobDescription || undefined,
      })

      if (result?.cover_letter.id) {
        toast.success('Cover letter generated successfully')
        onSuccess(result.cover_letter.id)
      }
    } catch (error) {
      console.error('Failed to generate cover letter:', error)
      toast.error('Failed to generate cover letter')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Cover Letter"
    >
      <Body className="text-mid-gray mb-6">
        Generate a professional cover letter tailored to this job using AI.
        This will cost 1 credit.
      </Body>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            required
            autoFocus
          />
        </div>

        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google"
            required
          />
        </div>

        <div>
          <Label htmlFor="jobDescription">
            Job Description <Small className="text-mid-gray">(optional)</Small>
          </Label>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for a more tailored cover letter..."
            rows={4}
          />
          <Small className="text-mid-gray mt-1">
            Adding the job description helps AI create a more relevant cover letter
          </Small>
        </div>

        {generateMutation.error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <Small className="text-error">
              {generateMutation.error.message}
            </Small>
          </div>
        )}

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={generateMutation.isPending || !jobTitle || !companyName}
          >
            {generateMutation.isPending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Generating...
              </>
            ) : (
              'Generate Cover Letter'
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
