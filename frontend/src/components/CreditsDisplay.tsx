import { cn } from '../lib/utils'
import { Badge } from './ui/badge'
import { Small } from './ui/typography'
import { useCredits } from '../hooks/useAI'

interface CreditsDisplayProps {
  className?: string
  showWarning?: boolean
  variant?: 'badge' | 'full'
}

export function CreditsDisplay({
  className,
  showWarning = true,
  variant = 'badge',
}: CreditsDisplayProps) {
  const { data: credits, isLoading, error } = useCredits()

  if (isLoading) {
    return (
      <Badge variant="secondary" className={className}>
        Loading...
      </Badge>
    )
  }

  if (error || !credits) {
    return null
  }

  const remaining = credits.remaining
  const freeLimit = credits.free_generations_limit
  const paidCredits = credits.paid_credits
  const hasPaidCredits = paidCredits > 0
  const isLow = remaining <= 3
  const isEmpty = remaining === 0

  if (variant === 'badge') {
    return (
      <Badge
        variant={isEmpty ? 'destructive' : isLow ? 'warning' : 'default'}
        className={className}
      >
        {remaining} credit{remaining !== 1 ? 's' : ''}
        {hasPaidCredits && ` (${paidCredits} paid)`}
      </Badge>
    )
  }

  return (
    <div
      className={cn(
        'p-4 rounded-lg',
        isEmpty
          ? 'bg-coral/10 border border-coral/20'
          : isLow
            ? 'bg-amber/10 border border-amber/20'
            : 'bg-off-white border border-border',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <Small className="font-semibold text-charcoal">AI Generation Credits</Small>
        <Badge
          variant={isEmpty ? 'destructive' : isLow ? 'warning' : 'default'}
        >
          {remaining} remaining
        </Badge>
      </div>

      {/* Progress bar - shows free credits usage */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isEmpty
              ? 'bg-coral'
              : isLow
                ? 'bg-amber'
                : 'bg-success'
          )}
          style={{
            width: `${Math.min(100, (remaining / freeLimit) * 100)}%`,
          }}
        />
      </div>

      {/* Credits breakdown */}
      <div className="mt-2 flex items-center gap-4 text-xs text-mid-gray">
        <span>Free: {credits.free_generations_remaining}/{freeLimit}</span>
        {hasPaidCredits && (
          <span className="text-purple">+ {paidCredits} paid</span>
        )}
      </div>

      {showWarning && (
        <>
          {isEmpty && (
            <Small className="text-coral mt-2 block">
              You've used all your credits. Purchase more to continue generating!
            </Small>
          )}
          {isLow && !isEmpty && (
            <Small className="text-amber-dark mt-2 block">
              You have {remaining} generation{remaining !== 1 ? 's' : ''} left.
            </Small>
          )}
        </>
      )}
    </div>
  )
}
