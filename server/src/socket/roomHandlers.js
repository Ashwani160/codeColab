import executeCode from '../services/execute.service.js'
import Room from '../models/Room.js'

const rooms = new Map()
const roomStates = new Map()
// rooms structure: roomId → [{ socketId, username, color }]

const COLORS = ['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899','#14b8a6','#f97316']

const getUserColor = (index) => COLORS[index % COLORS.length]
const getDefaultRoomState = () => ({ code: '', language: 'javascript' })

const getRoomState = async (roomId) => {
  if (roomStates.has(roomId)) return roomStates.get(roomId)

  const room = await Room.findOne({ roomId }).select('code language').lean()
  const state = {
    code: room?.code || '',
    language: room?.language || 'javascript'
  }

  roomStates.set(roomId, state)
  return state
}

const updateRoomState = (roomId, patch, persist = false) => {
  const state = roomStates.get(roomId) || getDefaultRoomState()
  const nextState = { ...state, ...patch }
  roomStates.set(roomId, nextState)

  if (!persist) return

  Room.updateOne({ roomId }, { $set: patch }).catch(error => {
    console.error('Failed to persist room state:', error.message)
  })
}

const roomHandlers = (io, socket) => {

  socket.on('join-room', async ({ roomId, username }) => {
    socket.join(roomId)
    const roomState = await getRoomState(roomId)

    if (!rooms.has(roomId)) rooms.set(roomId, [])
    const users = rooms.get(roomId)

    const user = { socketId: socket.id, username, color: getUserColor(users.length) }
    users.push(user)

    // send current room state to the joining user only
    socket.emit('room-joined', { users, ...roomState })

    // tell everyone else a new user arrived
    socket.to(roomId).emit('user-joined', user)

    socket.data.roomId = roomId
    socket.data.username = username
  })

  socket.on('code-change', ({ roomId, code }) => {
    updateRoomState(roomId, { code })
    socket.to(roomId).emit('code-update', { code })
  })

  socket.on('language-change', ({ roomId, language }) => {
    updateRoomState(roomId, { language }, true)
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
  socket.on('disconnect', async () => {
    const { roomId, username } = socket.data
    if (!roomId) return

    const users = rooms.get(roomId) || []
    const updated = users.filter(u => u.socketId !== socket.id)

    if (updated.length === 0) {
      rooms.delete(roomId)

      // last user left — save final code to MongoDB
      const state = roomStates.get(roomId)
      if (state) {
        await Room.updateOne({ roomId }, { $set: { code: state.code, language: state.language } })
          .catch(err => console.error('Failed to save room on disconnect:', err.message))
        roomStates.delete(roomId)
      }
    } else {
      rooms.set(roomId, updated)
    }

    socket.to(roomId).emit('user-left', { socketId: socket.id, username })
  })

}

export default roomHandlers
