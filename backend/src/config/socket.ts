import { Server as HTTPServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { env } from './env'
import { JWTPayload } from '../types/auth.types'

// Store socket id for each user
// Key: userId, Value: socketId
const userSockets = new Map<string, string>()

let io: SocketServer

export const initializeSocket = (httpServer: HTTPServer) => {
  // Create Socket.IO server attached to HTTP server
  io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  // Middleware — authenticate socket connections using JWT
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('No token provided'))
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload
      // Attach user data to socket
      socket.data.user = decoded
      next()
    } catch (error) {
      next(new Error('Invalid token'))
    }
  })

  // Handle connections
  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as JWTPayload
    console.log(`🔌 User connected: ${user.userId}`)

    // Store this user's socket id
    userSockets.set(user.userId, socket.id)

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${user.userId}`)
      userSockets.delete(user.userId)
    })
  })

  return io
}

// Send notification to a specific user
export const notifyUser = (userId: string, event: string, data: any) => {
  const socketId = userSockets.get(userId)

  if (socketId) {
    io.to(socketId).emit(event, data)
    console.log(`📨 Notification sent to user: ${userId}`)
  } else {
    console.log(`⚠️ User ${userId} is not connected, notification not sent`)
  }
}

export { io }