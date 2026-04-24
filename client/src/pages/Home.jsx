import { createElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Motion from 'motion/react'
import {
  ArrowRight,
  Clipboard,
  DoorOpen,
  Keyboard,
  Plus,
  Sparkles,
  Users2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/axios'

const MotionSection = Motion.motion.section
const MotionDiv = Motion.motion.div

const MODES = {
  create: {
    title: 'Create a fresh room',
    description: 'Generate a room instantly and jump straight into the editor.',
    buttonLabel: 'Create new room',
    icon: Plus,
    buttonClass:
      'bg-cyan-300 text-slate-950 shadow-[0_18px_40px_-18px_rgba(103,232,249,0.82)] hover:bg-cyan-200',
    badgeClass: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
  },
  join: {
    title: 'Join with a room ID',
    description: 'Paste an invite code and continue with your team immediately.',
    buttonLabel: 'Join room',
    icon: DoorOpen,
    buttonClass:
      'bg-emerald-300 text-slate-950 shadow-[0_18px_40px_-18px_rgba(110,231,183,0.82)] hover:bg-emerald-200',
    badgeClass: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
  },
}

const QUICK_CARDS = [
  {
    title: 'Create instantly',
    description: 'Start a new room without extra setup.',
    icon: Plus,
    accent: 'text-cyan-200',
  },
  {
    title: 'Invite by ID',
    description: 'Share a simple room code and jump in.',
    icon: Users2,
    accent: 'text-emerald-200',
  },
  {
    title: 'Keyboard friendly',
    description: 'Paste or press Enter to move faster.',
    icon: Keyboard,
    accent: 'text-sky-200',
  },
]

function Home() {
  const navigate = useNavigate()
  const pointerX = Motion.useMotionValue(880)
  const pointerY = Motion.useMotionValue(320)
  const glowX = Motion.useSpring(pointerX, { stiffness: 120, damping: 24, mass: 0.5 })
  const glowY = Motion.useSpring(pointerY, { stiffness: 120, damping: 24, mass: 0.5 })
  const backgroundGlow = Motion.useMotionTemplate`
    radial-gradient(260px circle at ${glowX}px ${glowY}px, rgba(125,211,252,0.07), transparent 34%)
  `

  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('create')

  const handleCreate = async () => {
    if (!username.trim()) return setError('Enter a username first')
    setLoading(true)

    try {
      const res = await api.post('/rooms')
      const nextRoomId = res.data.data.roomId.trim()
      navigate(`/room/${nextRoomId}`, { state: { username: username.trim() } })
    } catch {
      setError('Failed to create room')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = () => {
    if (!username.trim()) return setError('Enter a username')
    if (!roomId.trim()) return setError('Enter a room ID')
    navigate(`/room/${roomId.trim()}`, { state: { username: username.trim() } })
  }

  const handleSubmit = () => {
    if (mode === 'create') {
      handleCreate()
      return
    }

    handleJoin()
  }

  const handlePasteRoomId = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (!text.trim()) {
        toast.error('Clipboard is empty')
        return
      }

      setRoomId(text.trim())
      setError('')
      toast.success('Room ID pasted')
    } catch {
      toast.error('Could not read clipboard')
    }
  }

  const activeMode = MODES[mode]
  const ActiveIcon = activeMode.icon

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(event.clientX - bounds.left)
    pointerY.set(event.clientY - bounds.top)
  }

  const handlePointerLeave = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(bounds.width * 0.72)
    pointerY.set(bounds.height * 0.28)
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.06),transparent_24%),linear-gradient(180deg,#040914_0%,#06101a_52%,#030712_100%)]" />
      <MotionDiv className="absolute inset-0" style={{ background: backgroundGlow }} />
      <div className="glitter-field absolute inset-0" />
      <MotionDiv
        className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-3xl"
        animate={{ x: [0, 18, -10, 0], y: [0, 24, 10, 0], scale: [1, 1.08, 0.98, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MotionDiv
        className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-emerald-400/[0.08] blur-3xl"
        animate={{ x: [0, -22, 12, 0], y: [0, -20, 16, 0], scale: [1, 1.05, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MotionDiv
        className="absolute bottom-[-5rem] left-1/3 h-56 w-56 rounded-full bg-sky-300/[0.05] blur-3xl"
        animate={{ x: [0, 16, -12, 0], y: [0, -18, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 lg:px-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <MotionSection
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="max-w-xl space-y-7"
          >
            <div className="section-pill border-cyan-300/15 bg-white/[0.04] text-slate-300">
              <Sparkles className="size-3.5 text-cyan-200" />
              CodeSync
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Create or join a room without the clutter.
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300">
                A cleaner entry flow with softer colors, quick actions, and direct access to your shared
                workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {QUICK_CARDS.map(({ title, description, icon: Icon, accent }, index) => (
                <MotionDiv
                  key={title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: 0.08 + index * 0.06 }}
                  className="hover-sheen group relative overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-md transition duration-300 hover:border-white/14 hover:bg-white/[0.07]"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <div className="absolute -right-8 top-8 h-24 w-24 rounded-full bg-white/[0.06] blur-2xl" />
                  </div>
                  <div className={`mb-3 inline-flex rounded-2xl border border-white/8 bg-slate-950/40 p-2.5 transition duration-300 group-hover:scale-110 group-hover:border-white/16 ${accent}`}>
                    {createElement(Icon, { className: 'size-4' })}
                  </div>
                  <h2 className="mb-1 text-sm font-medium text-white transition duration-300 group-hover:translate-x-0.5">{title}</h2>
                  <p className="text-sm leading-6 text-slate-400 transition duration-300 group-hover:text-slate-300">{description}</p>
                </MotionDiv>
              ))}
            </div>
          </MotionSection>

          <MotionSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
            className="relative"
          >
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[34px] bg-gradient-to-br from-cyan-300/[0.10] via-transparent to-emerald-300/[0.10] blur-2xl" />
            <Card className="hover-sheen glass-panel-strong relative overflow-hidden border-white/[0.1] bg-slate-950/[0.72] py-0 transition duration-300 hover:border-white/[0.14]">
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />
              <CardHeader className="gap-3 border-b border-white/[0.08] px-6 py-6">
                <div className="flex items-center justify-between gap-4">
                  <MotionDiv
                    whileHover={{ scale: 1.04 }}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase ${activeMode.badgeClass}`}
                  >
                    <ActiveIcon className="size-3.5" />
                    {mode === 'create' ? 'Create mode' : 'Join mode'}
                  </MotionDiv>
                </div>
                <div>
                  <CardTitle className="text-3xl font-semibold text-white">{activeMode.title}</CardTitle>
                  <CardDescription className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                    {activeMode.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 px-6 py-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-100">Your username</label>
                  <Input
                    className="h-12 rounded-2xl border-white/10 bg-white/[0.05] px-4 text-base text-white placeholder:text-slate-400"
                    placeholder="e.g. aarya"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-[24px] border border-white/[0.08] bg-black/20 p-2">
                  {Object.entries(MODES).map(([key, value]) => {
                    const ModeIcon = value.icon
                    const isActive = mode === key

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setMode(key)
                          setError('')
                        }}
                        className={`rounded-[18px] border px-4 py-3 text-left transition duration-300 ${
                          isActive
                            ? 'border-white/[0.12] bg-white/[0.10] text-white shadow-[0_14px_24px_-18px_rgba(148,163,184,0.75)]'
                            : 'border-transparent bg-transparent text-slate-300 hover:-translate-y-0.5 hover:border-white/[0.08] hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                          <ModeIcon className={`size-4 transition duration-300 ${key === 'create' ? 'text-cyan-200' : 'text-emerald-200'} ${isActive ? 'scale-110' : ''}`} />
                          {key === 'create' ? 'Create' : 'Join'}
                        </div>
                        <p className="text-xs leading-5 text-slate-400">
                          {key === 'create' ? 'New room' : 'Existing room'}
                        </p>
                      </button>
                    )
                  })}
                </div>

                {mode === 'join' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-medium text-slate-100">Room ID</label>
                      <button
                        type="button"
                        onClick={handlePasteRoomId}
                        className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-cyan-300/[0.08] hover:text-cyan-100"
                      >
                        <Clipboard className="size-3.5" />
                        Paste
                      </button>
                    </div>
                    <Input
                      className="h-12 rounded-2xl border-white/10 bg-white/[0.05] px-4 text-base text-white placeholder:text-slate-400"
                      placeholder="e.g. x7k2p1"
                      value={roomId}
                      onChange={(e) => {
                        setRoomId(e.target.value)
                        setError('')
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`h-12 w-full rounded-2xl transition duration-300 hover:-translate-y-0.5 ${activeMode.buttonClass}`}
                >
                  {loading && mode === 'create' ? 'Creating...' : activeMode.buttonLabel}
                  {!(loading && mode === 'create') && <ArrowRight className="size-4" />}
                </Button>

                <p className="text-xs leading-5 text-slate-400">
                  {mode === 'create'
                    ? 'A room ID is generated automatically after you continue.'
                    : 'Paste the room ID or type it manually, then press Enter or click join.'}
                </p>

                {error && (
                  <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </MotionSection>
        </div>
      </div>
    </div>
  )
}

export default Home
