import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [agentStatus, setAgentStatus] = useState({
    status: 'idle',
    current_task: null,
    message_count: 0,
    last_activity: null
  })

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5001', {
      transports: ['websocket', 'polling']
    })

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to server')
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setConnected(false)
    })

    newSocket.on('connected', (data) => {
      console.log('Server confirmed connection:', data)
    })

    // Message events
    newSocket.on('message_response', (message) => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('chat_history', (data) => {
      setMessages(data.history || [])
    })

    // Agent status events
    newSocket.on('agent_status', (status) => {
      setAgentStatus(status)
    })

    newSocket.on('agent_status_update', (status) => {
      setAgentStatus(prev => ({ ...prev, ...status }))
    })

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [])

  const sendMessage = (message) => {
    if (socket && connected) {
      // Add user message immediately to UI
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, userMessage])
      
      // Send to server
      socket.emit('send_message', { message })
    }
  }

  const getHistory = () => {
    if (socket && connected) {
      socket.emit('get_history')
    }
  }

  const getStatus = () => {
    if (socket && connected) {
      socket.emit('get_status')
    }
  }

  const clearHistory = () => {
    if (socket && connected) {
      socket.emit('clear_history')
      setMessages([])
    }
  }

  const value = {
    socket,
    connected,
    messages,
    agentStatus,
    sendMessage,
    getHistory,
    getStatus,
    clearHistory
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

