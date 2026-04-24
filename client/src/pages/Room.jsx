import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Copy, Play, Users2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSocket } from '@/context/useSocket.js'
import JoinModal from '@/components/room/JoinModal.jsx'
import CodeEditor from '@/components/editor/CodeEditor.jsx'
import OutputPanel from '@/components/editor/OutputPanel.jsx'
import { Button } from '@/components/ui/button.jsx'
import LanguageSelect from '@/components/editor/LanguageSelect.jsx'
import ChatPanel from '@/components/room/ChatPanel.jsx'

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

    socket.on('user-joined', (user) => setUsers((prev) => [...prev, user]))
    socket.on('user-left', ({ socketId }) => setUsers((prev) => prev.filter((user) => user.socketId !== socketId)))

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

  const handleRun = (stdin = '') => {
    socket.emit('run-code', { roomId, code, language, stdin })
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    socket.emit('language-change', { roomId, language: lang })
  }

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
      toast.success('Room ID copied')
    } catch {
      toast.error('Could not copy room ID')
    }
  }

  return (
    <>
      <JoinModal open={!joined} onJoin={joinRoom} />

      <div className="relative min-h-screen overflow-hidden px-3 py-3 sm:px-4 sm:py-4">
        <div className="absolute inset-0 surface-grid opacity-20" />
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-400/[0.15] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-300/[0.12] blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1600px] flex-col gap-3">
          <header className="glass-panel px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-3">
                <div className="section-pill w-fit">
                  Collaborative room
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-white sm:text-3xl">CodeSync workspace</h1>
                    <p className="text-sm text-slate-300">
                      Live room for <span className="font-medium text-white">{username || 'guest'}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyRoomId}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    <Copy className="size-4 text-primary" />
                    Room {roomId}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 xl:items-end">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-slate-200">
                    <Users2 className="size-4 text-accent" />
                    {users.length} collaborator{users.length === 1 ? '' : 's'}
                  </div>
                  {users.map((user) => (
                    <div
                      key={user.socketId}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.username}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <LanguageSelect language={language} onChange={handleLanguageChange} />
                  <Button
                    size="lg"
                    onClick={() => handleRun()}
                    disabled={loading}
                    className="h-11 rounded-2xl bg-primary text-primary-foreground shadow-[0_16px_34px_-18px_rgba(251,191,36,0.9)] hover:bg-primary/90"
                  >
                    <Play className="size-4" />
                    {loading ? 'Running...' : 'Run code'}
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="grid flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="grid min-h-0 gap-3 lg:grid-rows-[minmax(0,1fr)_280px]">
              <section className="glass-panel-strong min-h-[420px] overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                  <div>
                    <h2 className="text-sm font-medium text-white">Live editor</h2>
                    <p className="text-xs text-slate-400">Every change syncs across the room in real time.</p>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                    synced
                  </div>
                </div>
                <div className="h-[calc(100%-69px)]">
                  <CodeEditor code={code} language={language} onChange={handleCodeChange} />
                </div>
              </section>

              <section className="glass-panel-strong min-h-[280px] overflow-hidden">
                <OutputPanel output={output} error={error} loading={loading} onRun={handleRun} />
              </section>
            </div>

            <div className="min-h-[360px] xl:min-h-0">
              <ChatPanel roomId={roomId} username={username} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Room
