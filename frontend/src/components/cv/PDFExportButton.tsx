import { useCallback } from 'react'

import { Button } from '../ui/button'

interface PDFExportButtonProps {
  filename?: string
  disabled?: boolean
  className?: string
}

/**
 * PDF Export Button
 * 
 * Uses the browser's native print-to-PDF functionality for reliable,
 * high-quality PDF generation. The CV editor page includes print-specific
 * styles that hide the UI and format the CV for A4/Letter paper.
 * 
 * For more advanced PDF generation (e.g., direct download without print dialog),
 * consider libraries like:
 * - react-to-pdf: Simple DOM to PDF
 * - html2canvas + jsPDF: More control over output
 * - @react-pdf/renderer: React components to PDF (requires rewriting themes)
 */
export function PDFExportButton({
  filename = 'cv',
  disabled = false,
  className,
}: PDFExportButtonProps) {
  const handleExport = useCallback(() => {
    // Set document title temporarily for PDF filename
    const originalTitle = document.title
    document.title = filename

    // Trigger print dialog (user can select "Save as PDF")
    window.print()

    // Restore original title after a brief delay
    setTimeout(() => {
      document.title = originalTitle
    }, 100)
  }, [filename])

  return (
    <Button
      variant="default"
      onClick={handleExport}
      disabled={disabled}
      className={className}
    >
      <svg
        className="w-4 h-4 mr-2"
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
      Download PDF
    </Button>
  )
}

/**
 * Hook for programmatic PDF export
 */
export function usePDFExport() {
  const triggerPrint = useCallback((filename?: string) => {
    if (filename) {
      const originalTitle = document.title
      document.title = filename
      window.print()
      setTimeout(() => {
        document.title = originalTitle
      }, 100)
    } else {
      window.print()
    }
  }, [])

  return { triggerPrint }
}
