import React from 'react'
import { Button } from '@/components/ui/button'
import { Menu, Settings, User } from 'lucide-react'
import { useSocket } from '../../context/SocketContext'

export const Header = ({ onSidebarToggle }) => {
  const { connected, agentStatus } = useSocket()

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dyor AI</h1>
              <p className="text-sm text-gray-500">Your Personal AI Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Agent Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              agentStatus.status === 'idle' ? 'bg-gray-400' :
              agentStatus.status === 'thinking' ? 'bg-yellow-500' :
              agentStatus.status === 'acting' ? 'bg-blue-500' :
              'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600 capitalize">
              {agentStatus.status}
            </span>
          </div>

          {/* Settings Button */}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Button */}
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

