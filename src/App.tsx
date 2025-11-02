import { Routes, Route } from 'react-router-dom'
import PDFViewer from './components/PDFViewer'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PDFViewer />} />
    </Routes>
  )
}

export default App

