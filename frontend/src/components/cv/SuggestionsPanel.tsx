import { Badge } from '../ui/badge'
import { Body, H3 } from '../ui/typography'

interface SuggestionsPanelProps {
  suggestions: Array<string>
  keywords: Array<string>
  relevantExperiences?: Array<string>
  className?: string
}

export function SuggestionsPanel({
  suggestions,
  keywords,
  relevantExperiences = [],
  className,
}: SuggestionsPanelProps) {
  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Suggestions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LightBulbIcon className="w-5 h-5 text-amber" />
            <H3 className="text-charcoal">Suggestions</H3>
          </div>
          {suggestions.length > 0 ? (
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-charcoal"
                >
                  <span className="text-amber mt-1">•</span>
                  <Body className="text-sm">{suggestion}</Body>
                </li>
              ))}
            </ul>
          ) : (
            <Body className="text-mid-gray text-sm">No suggestions</Body>
          )}
        </div>

        {/* Keywords to Include */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TagIcon className="w-5 h-5 text-info" />
            <H3 className="text-charcoal">Keywords to Include</H3>
          </div>
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="info">
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <Body className="text-mid-gray text-sm">No specific keywords</Body>
          )}
        </div>

        {/* Relevant Experiences */}
        {relevantExperiences.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BriefcaseIcon className="w-5 h-5 text-purple" />
              <H3 className="text-charcoal">Relevant Experiences</H3>
            </div>
            <ul className="space-y-2">
              {relevantExperiences.map((experience, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-charcoal"
                >
                  <span className="text-purple mt-1">•</span>
                  <Body className="text-sm">{experience}</Body>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function LightBulbIcon({ className }: { className?: string }) {
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
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  )
}

function TagIcon({ className }: { className?: string }) {
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
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  )
}

function BriefcaseIcon({ className }: { className?: string }) {
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
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}
