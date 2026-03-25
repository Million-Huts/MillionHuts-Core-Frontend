import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { PGProvider } from './context/PGContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { initApiBase } from './lib/api.ts'

initApiBase().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <PGProvider>
          <AuthProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </AuthProvider>
        </PGProvider>
      </BrowserRouter>
    </StrictMode>,
  )
});
