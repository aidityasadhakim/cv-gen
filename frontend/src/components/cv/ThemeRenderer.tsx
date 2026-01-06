import { ProfessionalTheme, ModernTheme, MinimalTheme } from './themes'

import type { JSONResume } from '../../types/json-resume'

interface ThemeRendererProps {
  resume: JSONResume
  themeId: string
  className?: string
}

/**
 * Renders a JSON Resume using the specified theme
 */
export function ThemeRenderer({ resume, themeId, className }: ThemeRendererProps) {
  switch (themeId) {
    case 'modern':
      return <ModernTheme resume={resume} className={className} />
    case 'minimal':
      return <MinimalTheme resume={resume} className={className} />
    case 'professional':
    default:
      return <ProfessionalTheme resume={resume} className={className} />
  }
}
