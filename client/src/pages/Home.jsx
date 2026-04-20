import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/axios'

function Home() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!username.trim()) return setError('Enter a username first')
    setLoading(true)
    try {
      const res = await api.post('/rooms')
      navigate(`/room/${res.data.data.roomId}`, { state: { username } })
    } catch {
      setError('Failed to create room')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!username.trim()) return setError('Enter a username')
    if (!roomId.trim()) return setError('Enter a room ID')
    navigate(`/room/${roomId}`, { state: { username } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-center">CodeSync</CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Collaborative coding in real time
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Your username</label>
            <Input
              placeholder="e.g. john"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
            />
          </div>

          <Button onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create new room'}
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or join existing</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Room ID</label>
            <Input
              placeholder="e.g. x7k2p1"
              value={roomId}
              onChange={e => { setRoomId(e.target.value); setError('') }}
            />
          </div>

          <Button variant="outline" onClick={handleJoin}>
            Join room
          </Button>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

        </CardContent>
      </Card>
    </div>
  )
}

export default Home