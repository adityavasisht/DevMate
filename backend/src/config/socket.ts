import { Server as HTTPServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { env } from './env'
import { JWTPayload } from '../types/auth.types'



const userSockets = new Map<string, string>()

let io: SocketServer

export const initializeSocket = (httpServer: HTTPServer) => {

  io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })


  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('No token provided'))
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload

      socket.data.user = decoded
      next()
    } catch (error) {
      next(new Error('Invalid token'))
    }
  })


  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as JWTPayload



    userSockets.set(user.userId, socket.id)


    socket.on('disconnect', () => {

      userSockets.delete(user.userId)
    })
  })

  return io
}


export const notifyUser = (userId: string, event: string, data: any) => {
  const socketId = userSockets.get(userId)

  if (socketId) {
    io.to(socketId).emit(event, data)

  } 
}

export { io }
