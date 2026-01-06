import type { JSONResume } from '../../types/json-resume'

/**
 * Theme metadata and configuration
 */
export interface ThemeInfo {
  id: string
  name: string
  description: string
  preview?: string // URL to theme preview image
}

/**
 * Props passed to theme components
 */
export interface ThemeProps {
  resume: JSONResume
  className?: string
}

/**
 * Theme component type
 */
export type ThemeComponent = React.ComponentType<ThemeProps>

/**
 * Registry of available themes
 */
export const THEMES: ThemeInfo[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, traditional layout suitable for corporate roles',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with visual flair',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, content-focused layout',
  },
]

/**
 * Get theme info by ID
 */
export function getThemeInfo(themeId: string): ThemeInfo | undefined {
  return THEMES.find((t) => t.id === themeId)
}

/**
 * Get default theme ID
 */
export function getDefaultThemeId(): string {
  return 'professional'
}
