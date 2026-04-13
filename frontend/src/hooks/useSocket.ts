import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

// Callback type for when a match notification arrives
type MatchNotification = {
  message: string
  jobTitle: string
  score: number
  reasoning: string
  jobId: string
}

export const useSocket = (onMatch?: (data: MatchNotification) => void) => {
  const { token } = useAuth()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Only connect if user is logged in
    if (!token) return

    // Create socket connection with JWT token in handshake
    socketRef.current = io('http://localhost:8000', {
      auth: {
        token: token
      }
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('🔌 Socket connected')
    })

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected')
    })

    // Listen for match notifications from backend
    socket.on('new_match', (data: MatchNotification) => {
      console.log('🎯 New match received:', data)
      if (onMatch) {
        onMatch(data)
      }
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message)
    })

    // Cleanup — disconnect when component unmounts
    return () => {
      socket.disconnect()
    }
  }, [token])

  return socketRef.current
}