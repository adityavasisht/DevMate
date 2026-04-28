import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const useSocket = (onNewMatch?: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null)
  const { token, user } = useAuth()

  useEffect(() => {
    if (!token || !user) return

    socketRef.current = io('http://localhost:8000', {
      auth: {
        token: token
      }
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected')
    })

    socket.on('new_match', (data) => {
      console.log('🎯 New match received:', data)
      if (onNewMatch) {
        onNewMatch(data)
      }
    })

    return () => {
      socket.disconnect()
    }

  }, [token, user])

  return socketRef.current
}

export default useSocket
