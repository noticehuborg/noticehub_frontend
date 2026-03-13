import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { NoticeProvider } from './context/NoticeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NoticeProvider>
        <App />
      </NoticeProvider>
    </AuthProvider>
  </StrictMode>,
)
