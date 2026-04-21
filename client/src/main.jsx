import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { Toaster } from '@/components/ui/sonner.jsx'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
  </SocketProvider>
)