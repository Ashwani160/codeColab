import { useCallback, useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSocket } from '@/context/useSocket.js'
import JoinModal from '@/components/room/JoinModal.jsx'
import CodeEditor from '@/components/editor/CodeEditor.jsx'
import OutputPanel from '@/components/editor/OutputPanel.jsx'
import { Button } from '@/components/ui/button.jsx'
import LanguageSelect from '@/components/editor/LanguageSelect.jsx'
function Room() {
  const { roomId } = useParams()
  const location = useLocation()
  const socket = useSocket()

  const initialUsername = location.state?.username || ''
  const [username, setUsername] = useState(initialUsername)
  const [joined, setJoined] = useState(Boolean(initialUsername))
  const [users, setUsers] = useState([])
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRemoteChange = useRef(false)

  const joinRoom = useCallback((name) => {
    setUsername(name)
    setJoined(true)
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('room-joined', ({ users, code, language }) => {
      setUsers(users)
      setCode(code || '')
      setLanguage(language || 'javascript')
    })
    socket.on('user-joined', (user) => setUsers(prev => [...prev, user]))
    socket.on('user-left', ({ socketId }) => setUsers(prev => prev.filter(u => u.socketId !== socketId)))

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

  useEffect(() => {
    if (joined && username && socket) {
      socket.emit('join-room', { roomId, username })
    }
  }, [joined, roomId, socket, username])

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
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    socket.emit('language-change', { roomId, language: lang })
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
            <LanguageSelect language={language} onChange={handleLanguageChange} />
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
