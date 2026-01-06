import { cn } from '../../lib/utils'

interface ProgressIndicatorProps {
  completion: number
  className?: string
}

export function ProgressIndicator({
  completion,
  className,
}: ProgressIndicatorProps) {
  const getColorClass = () => {
    if (completion >= 80) return 'bg-green-500'
    if (completion >= 50) return 'bg-yellow-500'
    return 'bg-indigo-500'
  }

  return (
    <div className={cn('bg-white shadow rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Profile Completion
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {completion}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={cn('h-2.5 rounded-full transition-all duration-300', getColorClass())}
          style={{ width: `${completion}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {completion < 50
          ? 'Add more information to improve your profile'
          : completion < 80
            ? 'Good progress! Keep adding details'
            : 'Great job! Your profile is well-filled'}
      </p>
    </div>
  )
}
