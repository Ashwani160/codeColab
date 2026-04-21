import executeCode from '../services/execute.service.js'

const rooms = new Map()
// rooms structure: roomId → [{ socketId, username, color }]

const COLORS = ['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899','#14b8a6','#f97316']

const getUserColor = (index) => COLORS[index % COLORS.length]

const roomHandlers = (io, socket) => {

  socket.on('join-room', async ({ roomId, username }) => {
    socket.join(roomId)

    if (!rooms.has(roomId)) rooms.set(roomId, [])
    const users = rooms.get(roomId)

    const user = { socketId: socket.id, username, color: getUserColor(users.length) }
    users.push(user)

    // send current room state to the joining user only
    socket.emit('room-joined', { users })

    // tell everyone else a new user arrived
    socket.to(roomId).emit('user-joined', { username: user.username, color: user.color })

    socket.data.roomId = roomId
    socket.data.username = username
  })

  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-update', { code })
  })

  socket.on('language-change', ({ roomId, language }) => {
    socket.to(roomId).emit('language-changed', { language })
  })

  socket.on('cursor-move', ({ roomId, line, col }) => {
    socket.to(roomId).emit('cursor-update', {
      username: socket.data.username,
      color: rooms.get(roomId)?.find(u => u.socketId === socket.id)?.color,
      line,
      col
    })
  })

  socket.on('chat-message', ({ roomId, text }) => {
    io.to(roomId).emit('chat-message', {
      username: socket.data.username,
      text,
      time: new Date().toISOString()
    })
  })


socket.on('run-code', async ({ roomId, code, language, stdin }) => {
  io.to(roomId).emit('run-loading')

  try {
    // Pass stdin to the new executeCode function
    const result = await executeCode(code, language, stdin || "") 
    io.to(roomId).emit('run-result', result)
  } catch (error) {
    io.to(roomId).emit('run-result', { 
      output: '', 
      error: error.message 
    })
  }
  })
  socket.on('disconnect', () => {
    const { roomId, username } = socket.data
    if (!roomId) return

    const users = rooms.get(roomId) || []
    const updated = users.filter(u => u.socketId !== socket.id)

    if (updated.length === 0) {
      rooms.delete(roomId)
    } else {
      rooms.set(roomId, updated)
    }

    socket.to(roomId).emit('user-left', { username })
  })

}

export default roomHandlers