import { Link } from '@tanstack/react-router'

import { cn } from '../../lib/utils'
import { Card } from './card'
import { Button } from './button'
import { Body, Small } from './typography'
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  variant?: 'default' | 'card' | 'inline'
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const content = (
    <div
      className={cn(
        'text-center',
        variant === 'inline' ? 'py-6' : 'py-12',
        className
      )}
    >
      {icon && (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-off-white">
          {icon}
        </div>
      )}
      <Body className="font-semibold text-charcoal">{title}</Body>
      {description && (
        <Small className="mt-2 text-mid-gray mx-auto">{description}</Small>
      )}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link to={action.href}>
              <Button variant="default">{action.label}</Button>
            </Link>
          ) : (
            <Button variant="default" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )

  if (variant === 'card') {
    return <Card variant="default" className="p-6">{content}</Card>
  }

  return content
}

// Pre-configured empty states for common use cases
export function EmptyStateCVs() {
  return (
    <EmptyState
      variant="card"
      icon={
        <svg
          className="h-8 w-8 text-mid-gray"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
      title="No CVs yet"
      description="Get started by creating your first CV. Use AI to tailor it for specific job postings."
      action={{
        label: 'Create New CV',
        href: '/cv/new',
      }}
    />
  )
}

export function EmptyStateCoverLetters() {
  return (
    <EmptyState
      variant="card"
      icon={
        <svg
          className="h-8 w-8 text-mid-gray"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      }
      title="No cover letters yet"
      description="Generate a personalized cover letter from any of your CVs to complement your job applications."
    />
  )
}

export function EmptyStateNoResults({
  query,
  onClear,
}: {
  query?: string
  onClear?: () => void
}) {
  return (
    <EmptyState
      variant="inline"
      icon={
        <svg
          className="h-8 w-8 text-mid-gray"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="No results found"
      description={
        query
          ? `No matches for "${query}". Try different keywords.`
          : 'Try adjusting your search or filters.'
      }
      action={
        onClear
          ? {
            label: 'Clear search',
            onClick: onClear,
          }
          : undefined
      }
    />
  )
}

export function EmptyStateError({
  title = 'Something went wrong',
  description = 'We encountered an error loading this content. Please try again.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <EmptyState
      variant="card"
      icon={
        <svg
          className="h-8 w-8 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
      title={title}
      description={description}
      action={
        onRetry
          ? {
            label: 'Try again',
            onClick: onRetry,
          }
          : undefined
      }
    />
  )
}
