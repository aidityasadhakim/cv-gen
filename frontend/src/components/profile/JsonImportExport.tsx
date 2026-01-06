import { useState, useRef } from 'react'

import { useUpdateProfile } from '../../hooks/useProfile'

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
      // Fallback for older browsers
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
      {/* Export Dropdown */}
      <div className="relative">
        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-l-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
          <button
            type="button"
            onClick={handleCopyToClipboard}
            className="inline-flex items-center px-2 py-2 border border-l-0 border-gray-300 shadow-sm text-sm font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50"
            title="Copy to clipboard"
          >
            {copyStatus === 'copied' ? (
              <svg
                className="h-4 w-4 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Import Button */}
      <button
        type="button"
        onClick={() => setIsImportOpen(true)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <svg
          className="h-4 w-4 mr-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        Import
      </button>

      {/* Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsImportOpen(false)}
            />

            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Import JSON Resume
                </h3>

                <div className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Upload JSON File
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">
                        or paste JSON
                      </span>
                    </div>
                  </div>

                  {/* Text Area */}
                  <textarea
                    value={importText}
                    onChange={(e) => {
                      setImportText(e.target.value)
                      setImportError(null)
                    }}
                    rows={10}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                    placeholder='{"basics": {"name": "John Doe", ...}}'
                  />

                  {importError && (
                    <p className="text-sm text-red-600">{importError}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={!importText.trim() || updateProfile.isPending}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                >
                  {updateProfile.isPending ? 'Importing...' : 'Import'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsImportOpen(false)
                    setImportText('')
                    setImportError(null)
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
