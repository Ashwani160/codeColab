import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function JoinModal({ open, onJoin }) {
  const [username, setUsername] = useState('')

  const handleSubmit = () => {
    if (!username.trim()) return
    onJoin(username.trim())
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm" >
        <DialogHeader>
          <DialogTitle>Enter your username</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <Input
            placeholder="e.g. john"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
          <Button onClick={handleSubmit}>Join Room</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JoinModal