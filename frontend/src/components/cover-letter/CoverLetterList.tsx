import { Link, useNavigate } from '@tanstack/react-router'

import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Small } from '../ui/typography'
import { Badge } from '../ui/badge'
import { useToast } from '../ui/toast'
import { Skeleton } from '../ui/skeleton'
import { EmptyStateCoverLetters, EmptyStateError } from '../ui/empty-state'
import { useCoverLetters, useDeleteCoverLetter } from '../../hooks/useCoverLetters'

export function CoverLetterList() {
  const { data, isLoading, error } = useCoverLetters()
  const navigate = useNavigate()
  const deleteMutation = useDeleteCoverLetter()
  const toast = useToast()

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this cover letter?')) {
      try {
        await deleteMutation.mutateAsync(id)
        toast.success('Cover letter deleted successfully')
      } catch (err) {
        console.error('Failed to delete cover letter:', err)
        toast.error('Failed to delete cover letter')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} variant="default" className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-6 w-24" variant="rounded" />
                  <Skeleton className="h-6 w-20" variant="rounded" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" className="w-8 h-8" />
                <Skeleton variant="circular" className="w-8 h-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <EmptyStateError onRetry={() => window.location.reload()} />
  }

  const coverLetters = data?.cover_letters || []

  if (coverLetters.length === 0) {
    return <EmptyStateCoverLetters />
  }

  return (
    <div className="space-y-4">
      {coverLetters.map((cl) => (
        <Link
          key={cl.id}
          to="/cover-letter/$id"
          params={{ id: cl.id }}
          className="block"
        >
          <Card
            variant="default"
            className="p-6 hover:shadow-medium transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {cl.job_title && <Badge variant="default">{cl.job_title}</Badge>}
                  {cl.company_name && (
                    <Badge variant="secondary">{cl.company_name}</Badge>
                  )}
                </div>
                <Small className="text-mid-gray">
                  Created {new Date(cl.created_at).toLocaleDateString()}
                </Small>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate({ to: '/cover-letter/$id', params: { id: cl.id } })
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDelete(cl.id, e)}
                  disabled={deleteMutation.isPending}
                >
                  <svg
                    className="w-4 h-4 text-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
