import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSocket } from '@/context/SocketContext'
import JoinModal from '@/components/room/JoinModal'

function Room() {
  const { roomId } = useParams()
  const location = useLocation()
  const socket = useSocket()

  const [username, setUsername] = useState(location.state?.username || '')
  const [joined, setJoined] = useState(false)
  const [users, setUsers] = useState([])

  // if came from Home with username, join immediately
  useEffect(() => {
    if (username && socket) {
      joinRoom(username)
    }
  }, [socket])

  const joinRoom = (name) => {
    setUsername(name)
    socket.emit('join-room', { roomId, username: name })
    setJoined(true)
  }

  useEffect(() => {
    if (!socket) return

    socket.on('room-joined', ({ users }) => {
      setUsers(users)
    })

    socket.on('user-joined', ({ username, color }) => {
      setUsers(prev => [...prev, { username, color }])
    })

    socket.on('user-left', ({ username }) => {
      setUsers(prev => prev.filter(u => u.username !== username))
    })

    return () => {
      socket.off('room-joined')
      socket.off('user-joined')
      socket.off('user-left')
    }
  }, [socket])

  return (
    <>
      <JoinModal open={!joined} onJoin={joinRoom} />

      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">CodeSync</h1>
          <span className="text-sm text-muted-foreground">Room: {roomId}</span>
        </div>

        {/* temp user list to verify socket works */}
        <div className="flex gap-2">
          {users.map(u => (
            <div
              key={u.socketId}
              className="text-xs px-2 py-1 rounded-full text-white"
              style={{ backgroundColor: u.color }}
            >
              {u.username}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Room