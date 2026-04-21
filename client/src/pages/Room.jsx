import { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSocket } from '@/context/SocketContext.jsx'
import JoinModal from '@/components/room/JoinModal.jsx'
import CodeEditor from '@/components/editor/CodeEditor.jsx'
import OutputPanel from '@/components/editor/OutputPanel.jsx'
import { Button } from '@/components/ui/button.jsx'

function Room() {
  const { roomId } = useParams()
  const location = useLocation()
  const socket = useSocket()

  const [username, setUsername] = useState(location.state?.username || '')
  const [joined, setJoined] = useState(false)
  const [users, setUsers] = useState([])
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRemoteChange = useRef(false)

  useEffect(() => {
    if (username && socket) joinRoom(username)
  }, [socket])

  const joinRoom = (name) => {
    setUsername(name)
    socket.emit('join-room', { roomId, username: name })
    setJoined(true)
  }

  useEffect(() => {
    if (!socket) return

    socket.on('room-joined', ({ users }) => setUsers(users))
    socket.on('user-joined', ({ username, color }) => setUsers(prev => [...prev, { username, color }]))
    socket.on('user-left', ({ username }) => setUsers(prev => prev.filter(u => u.username !== username)))

    socket.on('code-update', ({ code }) => {
      isRemoteChange.current = true
      setCode(code)
    })

    socket.on('language-changed', ({ language }) => setLanguage(language))

    socket.on('run-loading', () => {
      setLoading(true)
      setOutput('')
      setError('')
    })

    socket.on('run-result', ({ output, error }) => {
      setLoading(false)
      setOutput(output)
      setError(error)
    })

    return () => {
      socket.off('room-joined')
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('code-update')
      socket.off('language-changed')
      socket.off('run-loading')
      socket.off('run-result')
    }
  }, [socket])

  const handleCodeChange = (value) => {
    if (isRemoteChange.current) {
      isRemoteChange.current = false
      return
    }
    setCode(value)
    socket.emit('code-change', { roomId, code: value })
  }

    const handleRun = () => {
        // console.log('run clicked', { code, language, roomId, socket: socket?.id })
        socket.emit('run-code', { roomId, code, language })
    }   

  return (
    <>
      <JoinModal open={!joined} onJoin={joinRoom} />

      <div className="h-screen flex flex-col bg-background">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h1 className="font-bold">CodeSync</h1>
          <span className="text-sm text-muted-foreground">Room: {roomId}</span>
          <div className="flex items-center gap-3">
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
            <Button size="sm" onClick={handleRun} disabled={loading}>
              {loading ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>

        {/* editor + output split */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              language={language}
              onChange={handleCodeChange}
            />
          </div>
          <div className="h-48 border-t">
            <OutputPanel output={output} error={error} loading={loading} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Room