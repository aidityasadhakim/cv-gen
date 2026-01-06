import { useState } from 'react'

import { CVCard } from './CVCard'
import { Button } from '../ui/button'
import { Small } from '../ui/typography'
import { useToast } from '../ui/toast'
import { SkeletonCard } from '../ui/skeleton'
import { EmptyStateCVs, EmptyStateError } from '../ui/empty-state'
import { useCVs, useDeleteCV, useDuplicateCV } from '../../hooks/useCVs'

export function CVList() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useCVs(page, 10)
  const deleteMutation = useDeleteCV()
  const duplicateMutation = useDuplicateCV()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const toast = useToast()

  const handleDuplicate = async (cvId: string) => {
    try {
      await duplicateMutation.mutateAsync(cvId)
      toast.success('CV duplicated successfully')
    } catch (err) {
      console.error('Failed to duplicate CV:', err)
      toast.error('Failed to duplicate CV')
    }
  }

  const handleDelete = async (cvId: string) => {
    if (deleteConfirm === cvId) {
      try {
        await deleteMutation.mutateAsync(cvId)
        setDeleteConfirm(null)
        toast.success('CV deleted successfully')
      } catch (err) {
        console.error('Failed to delete CV:', err)
        toast.error('Failed to delete CV')
      }
    } else {
      setDeleteConfirm(cvId)
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return <EmptyStateError onRetry={() => window.location.reload()} />
  }

  if (!data || data.cvs.length === 0) {
    return <EmptyStateCVs />
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.cvs.map((cv) => (
          <div key={cv.id} className="relative">
            <CVCard
              cv={cv}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
            {deleteConfirm === cv.id && (
              <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Small className="text-charcoal font-medium">
                    Click delete again to confirm
                  </Small>
                  <div className="mt-2 flex gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cv.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.total_pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Small className="text-mid-gray px-4">
            Page {page} of {data.total_pages}
          </Small>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
            disabled={page === data.total_pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
