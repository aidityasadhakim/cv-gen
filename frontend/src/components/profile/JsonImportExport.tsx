import { useState, useRef } from 'react'

import { useUpdateProfile } from '../../hooks/useProfile'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Card } from '../ui/card'
import { H3, Small } from '../ui/typography'

import type { JSONResume } from '../../types/json-resume'

interface JsonImportExportProps {
  resumeData: JSONResume
}

export function JsonImportExport({ resumeData }: JsonImportExportProps) {
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const updateProfile = useUpdateProfile()

  const handleExport = () => {
    const jsonString = JSON.stringify(resumeData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(resumeData, null, 2))
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = JSON.stringify(resumeData, null, 2)
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  const handleImport = async () => {
    setImportError(null)
    try {
      const parsed = JSON.parse(importText) as JSONResume
      await updateProfile.mutateAsync(parsed)
      setIsImportOpen(false)
      setImportText('')
    } catch (err) {
      if (err instanceof SyntaxError) {
        setImportError('Invalid JSON format')
      } else if (err instanceof Error) {
        setImportError(err.message)
      } else {
        setImportError('Failed to import profile')
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        setImportText(text)
        setImportError(null)
      }
    }
    reader.onerror = () => {
      setImportError('Failed to read file')
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="flex rounded-full shadow-sm">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleExport}
            className="rounded-r-none border-r-0"
          >
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopyToClipboard}
            className="rounded-l-none"
            title="Copy to clipboard"
          >
            {copyStatus === 'copied' ? (
              <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setIsImportOpen(true)}
      >
        <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Import
      </Button>

      {isImportOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-charcoal/40 transition-opacity"
              onClick={() => setIsImportOpen(false)}
            />

            <Card variant="default" className="w-full max-w-lg transform">
              <div className="p-6">
                <H3 className="mb-4">Import JSON Resume</H3>

                <div className="space-y-4">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload JSON File
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-warm-white px-2 text-mid-gray">
                        or paste JSON
                      </span>
                    </div>
                  </div>

                  <Textarea
                    value={importText}
                    onChange={(e) => {
                      setImportText(e.target.value)
                      setImportError(null)
                    }}
                    rows={10}
                    className="font-mono text-sm"
                    placeholder='{"basics": {"name": "John Doe", ...}}'
                  />

                  {importError && (
                    <Small className="text-coral block">{importError}</Small>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
                <Button
                  type="button"
                  onClick={handleImport}
                  disabled={!importText.trim() || updateProfile.isPending}
                  className="flex-1"
                >
                  {updateProfile.isPending ? 'Importing...' : 'Import'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsImportOpen(false)
                    setImportText('')
                    setImportError(null)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
