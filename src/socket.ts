// src/socket.ts
import { Server } from 'socket.io'

export const initSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join-poll', (pollId) => {
      socket.join(pollId)
    })

    socket.on('new-vote', (pollId, data) => {
      // Send vote update to all clients in that poll room
      io.to(pollId).emit('vote-updated', data)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}
