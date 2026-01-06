/**
 * PDF Generation Utilities
 * 
 * Currently uses browser's native print-to-PDF functionality.
 * This provides the best quality output with minimal dependencies.
 * 
 * Future enhancements could include:
 * - Direct PDF generation using libraries like jsPDF or pdfmake
 * - Server-side PDF generation for consistent output across browsers
 * - Multiple page size support (A4, Letter, etc.)
 */

export interface PDFOptions {
  filename?: string
  pageSize?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
  margin?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
}

/**
 * Triggers the browser's print dialog for PDF export
 * The print styles in the CV editor ensure proper formatting
 */
export function printToPDF(options: PDFOptions = {}) {
  const { filename = 'cv' } = options

  // Set document title for PDF filename
  const originalTitle = document.title
  document.title = filename

  // Trigger print
  window.print()

  // Restore title
  setTimeout(() => {
    document.title = originalTitle
  }, 100)
}

/**
 * Check if the browser supports print-to-PDF
 * (All modern browsers do)
 */
export function isPrintToPDFSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.print === 'function'
}

/**
 * Generate print-specific CSS for CV export
 * This is included inline in the CV editor component
 */
export function getPrintStyles(): string {
  return `
    @media print {
      @page {
        size: letter;
        margin: 0;
      }
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .print\\:hidden {
        display: none !important;
      }
    }
  `
}
