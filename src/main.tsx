import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { PGProvider } from './context/PGContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PGProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PGProvider>
    </BrowserRouter>
  </StrictMode>,
)
