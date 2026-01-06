import { Link } from '@tanstack/react-router'

import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Body, Small } from '../ui/typography'
import { getThemeInfo } from '../../lib/themes'

import type { CVListItem } from '../../hooks/useCVs'

interface CVCardProps {
  cv: CVListItem
  onDuplicate?: (id: string) => void
  onDelete?: (id: string) => void
}

export function CVCard({ cv, onDuplicate, onDelete }: CVCardProps) {
  const theme = getThemeInfo(cv.template_id)
  const createdDate = new Date(cv.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Card variant="default" className="p-4 hover:shadow-medium transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <Link
              to="/cv/$cvId"
              params={{ cvId: cv.id }}
              className="block"
            >
              <Body className="font-semibold text-charcoal truncate hover:text-amber transition-colors">
                {cv.name}
              </Body>
            </Link>
            <Small className="text-mid-gray">
              {theme?.name || cv.template_id} template
            </Small>
          </div>
          {cv.match_score !== undefined && cv.match_score !== null && (
            <div className="ml-2 flex-shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber/10 text-amber">
                {cv.match_score}% match
              </span>
            </div>
          )}
        </div>

        {/* Job info if available */}
        {(cv.job_title || cv.company_name) && (
          <div className="mb-3 pb-3 border-b border-gray-100">
            <Small className="text-mid-gray">
              {cv.job_title && <span className="font-medium">{cv.job_title}</span>}
              {cv.job_title && cv.company_name && ' at '}
              {cv.company_name && <span>{cv.company_name}</span>}
            </Small>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <Small className="text-mid-gray">Created {createdDate}</Small>
          <div className="flex items-center gap-1">
            <Link to="/cv/$cvId" params={{ cvId: cv.id }}>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </Link>
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  onDuplicate(cv.id)
                }}
              >
                <DuplicateIcon />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(cv.id)
                }}
                className="text-error hover:text-error"
              >
                <DeleteIcon />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function DuplicateIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}
