import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, Mic } from 'lucide-react'
import { useSocket } from '../../context/SocketContext'
import { MessageBubble } from './MessageBubble'

export const ChatInterface = () => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const { sendMessage, messages, agentStatus } = useSocket()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setIsTyping(agentStatus.status === 'thinking')
  }, [agentStatus.status])

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chat with Dyor AI</h2>
            <p className="text-sm text-gray-500">
              {agentStatus.status === 'thinking' ? 'AI is thinking...' :
               agentStatus.status === 'acting' ? 'AI is working...' :
               'Ready to help you'}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {messages.length} messages
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Dyor AI</h3>
            <p className="text-gray-500 max-w-md">
              I'm your personal AI assistant powered by OpenManus. I can help you with web browsing, 
              coding, file management, image generation, and much more. What would you like to do today?
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => sendMessage("Help me write some code")}
              >
                Write Code
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => sendMessage("Search the web for information")}
              >
                Web Search
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => sendMessage("Generate an image")}
              >
                Create Image
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => sendMessage("Analyze some data")}
              >
                Data Analysis
              </Button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AI</span>
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="pr-12"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="sm">
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}

