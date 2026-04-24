import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
      <DialogContent
        showCloseButton={false}
        className="max-w-md rounded-[30px] border-white/10 bg-slate-950/[0.92] p-0 text-white"
      >
        <div className="relative overflow-hidden rounded-[30px]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.24),transparent_55%)]" />
          <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-cyan-400/[0.15] blur-3xl" />

          <div className="relative px-6 pb-6 pt-6">
            <DialogHeader className="space-y-4">
              <div className="section-pill w-fit">
                <Sparkles className="size-3.5 text-primary" />
                Enter the room
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-3xl font-semibold text-white">Choose your username</DialogTitle>
                <DialogDescription className="max-w-sm text-sm leading-6 text-slate-300">
                  Your name is shown to everyone in the session while you code, chat, and run output together.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="mt-6 flex flex-col gap-4">
              <Input
                className="h-12 rounded-2xl border-white/10 bg-white/[0.06] px-4 text-base text-white placeholder:text-slate-400"
                placeholder="e.g. john"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
              <Button
                onClick={handleSubmit}
                className="h-12 rounded-2xl bg-primary text-primary-foreground shadow-[0_16px_34px_-18px_rgba(251,191,36,0.9)] hover:bg-primary/90"
              >
                Join room
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JoinModal
