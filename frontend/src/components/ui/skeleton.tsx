import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'rounded'
  animation?: 'pulse' | 'shimmer' | 'none'
}

export function Skeleton({
  className,
  variant = 'default',
  animation = 'pulse',
}: SkeletonProps) {
  const baseStyles = 'bg-gray-200'

  const variantStyles = {
    default: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  }

  const animationStyles = {
    pulse: 'animate-pulse',
    shimmer:
      'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent',
    none: '',
  }

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
    />
  )
}

// Pre-configured skeleton variants
export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <Skeleton variant="circular" className={cn(sizeStyles[size], className)} />
  )
}

export function SkeletonButton({
  size = 'default',
  className,
}: {
  size?: 'sm' | 'default' | 'lg'
  className?: string
}) {
  const sizeStyles = {
    sm: 'h-8 w-20',
    default: 'h-10 w-24',
    lg: 'h-12 w-32',
  }

  return (
    <Skeleton variant="rounded" className={cn(sizeStyles[size], className)} />
  )
}

// Card skeleton for CV and Cover Letter lists
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-6 shadow-soft border border-gray-100',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="circular" className="w-8 h-8" />
          <Skeleton variant="circular" className="w-8 h-8" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <Skeleton variant="rounded" className="h-6 w-20" />
        <Skeleton variant="rounded" className="h-6 w-24" />
      </div>
      <Skeleton className="h-3 w-1/3" />
    </div>
  )
}

// Profile section skeleton
export function SkeletonProfileSection({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-6 shadow-soft border border-gray-100',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton variant="rounded" className="h-9 w-20" />
      </div>
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full" variant="rounded" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" variant="rounded" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-24 w-full" variant="rounded" />
        </div>
      </div>
    </div>
  )
}
