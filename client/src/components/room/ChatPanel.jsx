import { useEffect, useRef, useState } from 'react'
import { MessageSquareText, SendHorizonal } from 'lucide-react'
import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { useSocket } from '@/context/useSocket.js'

function ChatPanel({ roomId, username }) {
  const socket = useSocket()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!socket) return

    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => socket.off('chat-message')
  }, [socket])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!text.trim()) return
    socket.emit('chat-message', { roomId, text: text.trim() })
    setText('')
  }

  return (
    <div className="glass-panel-strong flex h-full min-h-full flex-col overflow-hidden">
      <div className="border-b border-white/[0.08] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-accent">
            <MessageSquareText className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">Room chat</h2>
            <p className="text-xs text-slate-400">{messages.length} message{messages.length === 1 ? '' : 's'} in this session</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-black/[0.15] p-6 text-center text-sm leading-6 text-slate-400">
            Start the conversation. Notes, debugging hints, and quick decisions stay inside the room.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, index) => {
              const isOwnMessage = msg.username === username

              return (
                <div
                  key={`${msg.time}-${index}`}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-[22px] border px-4 py-3 ${
                      isOwnMessage
                        ? 'border-amber-300/20 bg-amber-300/[0.12] text-amber-50'
                        : 'border-white/10 bg-white/[0.05] text-slate-100'
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs">
                      <span className="font-medium">{msg.username}</span>
                      <span className="text-slate-400">
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="break-words text-sm leading-6">{msg.text}</p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.08] p-3">
        <div className="flex gap-2">
          <Input
            className="h-11 rounded-2xl border-white/10 bg-white/[0.06] px-4 text-white placeholder:text-slate-400"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button
            size="lg"
            onClick={sendMessage}
            disabled={!text.trim()}
            className="h-11 rounded-2xl bg-white/[0.08] px-4 text-white hover:bg-white/[0.14]"
          >
            <SendHorizonal className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
