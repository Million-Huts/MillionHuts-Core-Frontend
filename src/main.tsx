import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { PGProvider } from './context/PGContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { initApiBase } from './lib/api.ts'
import { SubscriptionProvider } from './context/SubscriptionContext.tsx'

initApiBase().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <PGProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </PGProvider>
      </BrowserRouter>
    </StrictMode>,
  )
});
