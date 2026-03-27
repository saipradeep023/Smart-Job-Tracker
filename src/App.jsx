import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ApplicationProvider } from './context'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import AddApplication from './pages/AddApplication'
import Analytics from './pages/Analytics'

// Optional: minimal custom CSS for dark theme toasts
import './toast.css'

const App = () => (
  <ApplicationProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Root → /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Main pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/new" element={<AddApplication />} />
          <Route path="applications/:id" element={<AddApplication />} />
          <Route path="analytics" element={<Analytics />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer 
      position="bottom-right" 
      theme="light"
      autoClose={3000}
      hideProgressBar={true}
    />
  </ApplicationProvider>
)

export default App
