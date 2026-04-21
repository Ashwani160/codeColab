import { useState, useEffect, useRef } from 'react'
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
      setMessages(prev => [...prev, msg])
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
    <div className="flex flex-col h-full border-l">
      {/* messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            No messages yet
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium">{msg.username}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm break-words">{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="p-2 border-t flex gap-2">
        <Input
          className="text-sm h-8"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <Button size="sm" onClick={sendMessage}>Send</Button>
      </div>
    </div>
  )
}

export default ChatPanel