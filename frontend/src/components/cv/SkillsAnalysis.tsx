import { Badge } from '../ui/badge'
import { H3, Body, Small } from '../ui/typography'

interface SkillsAnalysisProps {
  matchingSkills: string[]
  missingSkills: string[]
  className?: string
}

export function SkillsAnalysis({
  matchingSkills,
  missingSkills,
  className,
}: SkillsAnalysisProps) {
  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Matching Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-5 h-5 text-success" />
            <H3 className="text-charcoal">Matching Skills</H3>
            <Badge variant="success" className="ml-auto">
              {matchingSkills.length}
            </Badge>
          </div>
          {matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill, index) => (
                <Badge key={index} variant="success">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <Small className="text-mid-gray">No matching skills identified</Small>
          )}
        </div>

        {/* Missing/Improvement Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircleIcon className="w-5 h-5 text-amber-dark" />
            <H3 className="text-charcoal">Skills to Highlight</H3>
            <Badge variant="warning" className="ml-auto">
              {missingSkills.length}
            </Badge>
          </div>
          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <Small className="text-mid-gray">
              All required skills are covered
            </Small>
          )}
          {missingSkills.length > 0 && (
            <Body className="text-mid-gray mt-2 text-sm">
              These skills are mentioned in the job description. Consider
              emphasizing related experience or transferable skills.
            </Body>
          )}
        </div>
      </div>
    </div>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  )
}
