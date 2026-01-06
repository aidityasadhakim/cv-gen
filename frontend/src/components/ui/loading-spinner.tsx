import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'amber' | 'white' | 'charcoal'
}

export function LoadingSpinner({
  size = 'md',
  className,
  color = 'amber',
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  }

  const colorStyles = {
    amber: 'border-amber border-t-transparent',
    white: 'border-white border-t-transparent',
    charcoal: 'border-charcoal border-t-transparent',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Full page loading overlay
export function LoadingOverlay({
  message = 'Loading...',
}: {
  message?: string
}) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-mid-gray font-medium">{message}</p>
      </div>
    </div>
  )
}

// Inline loading state for buttons/forms
export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
    </span>
  )
}

// Page loading state with centered spinner
export function PageLoading({ message }: { message?: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        {message && <p className="text-mid-gray">{message}</p>}
      </div>
    </div>
  )
}
