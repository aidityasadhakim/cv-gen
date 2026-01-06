import { THEMES } from '../../lib/themes'
import { cn } from '../../lib/utils'

interface TemplateSelectorProps {
  value: string
  onChange: (templateId: string) => void
  compact?: boolean
}

export function TemplateSelector({ value, onChange, compact = false }: TemplateSelectorProps) {
  if (compact) {
    return (
      <div className="flex gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              value === theme.id
                ? 'bg-amber text-white'
                : 'bg-gray-100 text-mid-gray hover:bg-gray-200'
            )}
          >
            {theme.name}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onChange(theme.id)}
          className={cn(
            'w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left',
            value === theme.id
              ? 'border-amber bg-amber/5'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
            <ThemeIcon themeId={theme.id} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-charcoal text-sm">{theme.name}</div>
            <div className="text-xs text-mid-gray truncate">{theme.description}</div>
          </div>
          {value === theme.id && (
            <div className="w-5 h-5 rounded-full bg-amber flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

function ThemeIcon({ themeId }: { themeId: string }) {
  const baseClass = "text-mid-gray/50"
  
  switch (themeId) {
    case 'professional':
      return (
        <svg className={cn("w-6 h-6", baseClass)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'modern':
      return (
        <svg className={cn("w-6 h-6", baseClass)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    case 'minimal':
      return (
        <svg className={cn("w-6 h-6", baseClass)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      )
    default:
      return null
  }
}
