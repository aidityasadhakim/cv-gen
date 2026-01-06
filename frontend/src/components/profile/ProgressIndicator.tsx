import { cn } from '../../lib/utils'
import { Card } from '../ui/card'
import { Small } from '../ui/typography'

interface ProgressIndicatorProps {
  completion: number
  className?: string
}

export function ProgressIndicator({
  completion,
  className,
}: ProgressIndicatorProps) {
  const getColorClass = () => {
    if (completion >= 80) return 'bg-success'
    if (completion >= 50) return 'bg-amber'
    return 'bg-amber-light'
  }

  const getMessage = () => {
    if (completion < 50) return 'Add more information to improve your profile'
    if (completion < 80) return 'Good progress! Keep adding details'
    return 'Great job! Your profile is well-filled'
  }

  return (
    <Card variant="default" className="p-5">
      <div className="flex items-center justify-between mb-3">
        <Small className="font-semibold text-charcoal">Profile Completion</Small>
        <Small className="font-bold text-charcoal">{completion}%</Small>
      </div>
      <div className="w-full bg-off-white rounded-full h-2.5">
        <div
          className={cn('h-2.5 rounded-full transition-all duration-500 ease-default', getColorClass())}
          style={{ width: `${completion}%` }}
        />
      </div>
      <Small className="mt-3 text-mid-gray block">{getMessage()}</Small>
    </Card>
  )
}
