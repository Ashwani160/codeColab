import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import SocketContext from './socketContext.js'

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    let active = true
    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket'],
    })

    queueMicrotask(() => {
      if (active) setSocket(s)
    })

    return () => {
      active = false
      s.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
