import { useState } from 'react'
import { Link } from '@tanstack/react-router'

import { CVCard } from './CVCard'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Body, Small } from '../ui/typography'
import { useCVs, useDeleteCV, useDuplicateCV } from '../../hooks/useCVs'

export function CVList() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useCVs(page, 10)
  const deleteMutation = useDeleteCV()
  const duplicateMutation = useDuplicateCV()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleDuplicate = async (cvId: string) => {
    try {
      await duplicateMutation.mutateAsync(cvId)
    } catch (err) {
      console.error('Failed to duplicate CV:', err)
    }
  }

  const handleDelete = async (cvId: string) => {
    if (deleteConfirm === cvId) {
      try {
        await deleteMutation.mutateAsync(cvId)
        setDeleteConfirm(null)
      } catch (err) {
        console.error('Failed to delete CV:', err)
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
          <Card key={i} variant="default" className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card variant="default" className="p-6 text-center">
        <Body className="text-error">Failed to load CVs</Body>
        <Small className="text-mid-gray mt-1">{error.message}</Small>
      </Card>
    )
  }

  if (!data || data.cvs.length === 0) {
    return (
      <Card variant="default" className="p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-mid-gray/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <Body className="mt-4 text-charcoal font-medium">No CVs yet</Body>
        <Small className="mt-1 text-mid-gray">
          Get started by creating your first CV
        </Small>
        <Link to="/cv/new" className="inline-block mt-4">
          <Button variant="default">Create New CV</Button>
        </Link>
      </Card>
    )
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
