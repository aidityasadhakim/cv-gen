import { useEffect, useCallback, useRef } from 'react'

type KeyModifiers = {
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
}

type KeyboardShortcut = {
  key: string
  modifiers?: KeyModifiers
  action: () => void
  description?: string
  enabled?: boolean
}

/**
 * Hook for registering keyboard shortcuts
 *
 * @example
 * useKeyboardShortcuts([
 *   { key: 's', modifiers: { ctrl: true }, action: handleSave, description: 'Save' },
 *   { key: 'Escape', action: handleClose, description: 'Close' },
 * ])
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow Escape to work even in inputs
      if (event.key !== 'Escape') {
        return
      }
    }

    for (const shortcut of shortcutsRef.current) {
      // Skip disabled shortcuts
      if (shortcut.enabled === false) continue

      // Check if key matches
      if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) continue

      // Check modifiers
      const modifiers = shortcut.modifiers || {}
      const ctrlMatch = !!modifiers.ctrl === (event.ctrlKey || event.metaKey)
      const altMatch = !!modifiers.alt === event.altKey
      const shiftMatch = !!modifiers.shift === event.shiftKey

      if (ctrlMatch && altMatch && shiftMatch) {
        event.preventDefault()
        shortcut.action()
        return
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

/**
 * Hook for a single Escape key handler
 *
 * @example
 * useEscapeKey(() => setIsOpen(false))
 */
export function useEscapeKey(callback: () => void, enabled = true) {
  useKeyboardShortcuts([
    { key: 'Escape', action: callback, enabled },
  ])
}

/**
 * Hook for Enter key to submit
 *
 * @example
 * useEnterKey(() => handleSubmit(), !isLoading)
 */
export function useEnterKey(callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger when typing in textarea
      const target = event.target as HTMLElement
      if (target.tagName === 'TEXTAREA') return

      if (event.key === 'Enter' && !event.shiftKey) {
        // Only trigger if not in a form with a submit button
        const form = (event.target as HTMLElement).closest('form')
        if (form) return

        event.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [callback, enabled])
}

/**
 * Get formatted shortcut string for display
 *
 * @example
 * formatShortcut({ key: 's', modifiers: { ctrl: true } }) // "Ctrl+S" or "⌘S"
 */
export function formatShortcut(shortcut: Pick<KeyboardShortcut, 'key' | 'modifiers'>): string {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  const parts: string[] = []

  if (shortcut.modifiers?.ctrl) {
    parts.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.modifiers?.alt) {
    parts.push(isMac ? '⌥' : 'Alt')
  }
  if (shortcut.modifiers?.shift) {
    parts.push(isMac ? '⇧' : 'Shift')
  }

  // Format special keys
  const keyDisplay: Record<string, string> = {
    escape: 'Esc',
    enter: '↵',
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
    backspace: '⌫',
    delete: '⌦',
    tab: '⇥',
    ' ': 'Space',
  }

  const displayKey = keyDisplay[shortcut.key.toLowerCase()] || shortcut.key.toUpperCase()
  parts.push(displayKey)

  return isMac ? parts.join('') : parts.join('+')
}

/**
 * Component to display a keyboard shortcut hint
 */
export function ShortcutHint({
  shortcut,
  className = '',
}: {
  shortcut: Pick<KeyboardShortcut, 'key' | 'modifiers'>
  className?: string
}) {
  return (
    <kbd
      className={`inline-flex items-center gap-0.5 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs font-mono text-mid-gray ${className}`}
    >
      {formatShortcut(shortcut)}
    </kbd>
  )
}
