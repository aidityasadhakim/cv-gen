import { memo } from 'react'

import { ProfessionalTheme, ModernTheme, MinimalTheme, AcademicTheme } from './themes'

import type { JSONResume } from '../../types/json-resume'

interface ThemeRendererProps {
  resume: JSONResume
  themeId: string
  className?: string
}

/**
 * Renders a JSON Resume using the specified theme
 * Memoized to prevent unnecessary re-renders when parent components update
 */
export const ThemeRenderer = memo(function ThemeRenderer({ resume, themeId, className }: ThemeRendererProps) {
  switch (themeId) {
    case 'modern':
      return <ModernTheme resume={resume} className={className} />
    case 'minimal':
      return <MinimalTheme resume={resume} className={className} />
    case 'academic':
      return <AcademicTheme resume={resume} className={className} />
    case 'professional':
    default:
      return <ProfessionalTheme resume={resume} className={className} />
  }
})
