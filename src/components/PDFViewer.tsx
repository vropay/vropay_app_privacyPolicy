import { useState, useEffect } from 'react'
import { pdfjs } from 'react-pdf'
import './PDFViewer.css'

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

function PDFViewer() {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [textContent, setTextContent] = useState<string[]>([])

  useEffect(() => {
    async function loadAndExtractText() {
      try {
        setLoading(true)
        setError(null)
        
        // Load PDF directly using pdfjs
        const loadingTask = pdfjs.getDocument('/pdf/App Policies as on 14.03.2025 - VRoPay.pdf')
        const pdf = await loadingTask.promise
        
        const pageCount = pdf.numPages
        
        // Extract text from all pages
        const allText: string[] = []
        
        for (let i = 1; i <= pageCount; i++) {
          try {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
              .map((item) => ('str' in item ? item.str : ''))
              .join(' ')
            allText.push(pageText)
          } catch (err) {
            console.error(`Error extracting text from page ${i}:`, err)
            allText.push('')
          }
        }
        
        setTextContent(allText)
        setLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError('Failed to load PDF. ' + errorMessage)
        setLoading(false)
      }
    }

    loadAndExtractText()
  }, [])

  return (
    <div className="pdf-content-container">
      <div className="pdf-header">
        <h1>VRoPay App Policies</h1>
      </div>

      {loading && (
        <div className="loading">
          <p>Loading PDF content... Please wait.</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && textContent.length > 0 && (
        <div className="content-wrapper">
          {textContent.map((pageText, index) => (
            <div key={index} className="page-content">
              <div className="page-text">
                {pageText || '\u00A0'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PDFViewer

