import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

// This hook creates and manages a Socket.IO connection
// It automatically connects when the user is logged in
// and disconnects when they log out
const useSocket = (onNewMatch?: (data: any) => void) => {
  // useRef stores the socket instance without causing re-renders
  const socketRef = useRef<Socket | null>(null)
  const { token, user } = useAuth()

  useEffect(() => {
    // Only connect if user is logged in and has a token
    if (!token || !user) return

    // Create Socket.IO connection
    // auth.token is how our backend middleware reads the JWT
    socketRef.current = io('http://localhost:8000', {
      auth: {
        token: token
      }
    })

    const socket = socketRef.current

    // Log connection status
    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected')
    })

    // Listen for new match notifications from the server
    // This is the event our backend sends in match.service.ts
    socket.on('new_match', (data) => {
      console.log('🎯 New match received:', data)
      if (onNewMatch) {
        onNewMatch(data)
      }
    })

    // Cleanup — disconnect when component unmounts or user logs out
    return () => {
      socket.disconnect()
    }

  // Re-run this effect if token or user changes (login/logout)
  }, [token, user])

  return socketRef.current
}

export default useSocket