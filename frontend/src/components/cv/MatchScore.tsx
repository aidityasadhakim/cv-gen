import { cn } from '../../lib/utils'

interface MatchScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function MatchScore({
  score,
  size = 'md',
  showLabel = true,
  className,
}: MatchScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-amber-dark'
    if (score >= 40) return 'text-warning'
    return 'text-coral'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Moderate Match'
    return 'Low Match'
  }

  const getBackgroundColor = (score: number) => {
    if (score >= 80) return 'bg-success/10'
    if (score >= 60) return 'bg-amber/10'
    if (score >= 40) return 'bg-warning/10'
    return 'bg-coral/10'
  }

  const sizeClasses = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-32 h-32 text-4xl',
  }

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold',
          sizeClasses[size],
          getScoreColor(score),
          getBackgroundColor(score)
        )}
      >
        {score}%
      </div>
      {showLabel && (
        <span
          className={cn(
            'font-medium',
            labelSizeClasses[size],
            getScoreColor(score)
          )}
        >
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  )
}
