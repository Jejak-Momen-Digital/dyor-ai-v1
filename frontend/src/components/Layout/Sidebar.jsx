import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  MessageSquare, 
  History, 
  FileText, 
  Code, 
  Image, 
  Globe, 
  Settings, 
  Plus,
  Trash2,
  Menu,
  X
} from 'lucide-react'

export const Sidebar = ({ isOpen, onToggle, onOpenSettings, onOpenHistory, onOpenTemplates, onNewChat, onClearHistory }) => {
  const { clearHistory, messages } = useSocket()

  const menuItems = [
    { icon: MessageSquare, label: 'Chat', active: true },
    { icon: History, label: 'History', badge: messages.length },
    { icon: FileText, label: 'Files' },
    { icon: Code, label: 'Code' },
    { icon: Image, label: 'Images' },
    { icon: Globe, label: 'Web' },
    { icon: Settings, label: 'Settings' }
  ]

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      clearHistory()
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <Button className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className="w-full justify-start"
              size="sm"
              onClick={() => {
                if (item.label === 'Settings') onOpenSettings?.()
                else if (item.label === 'History') onOpenHistory?.()
                else if (item.label === 'New Chat') onNewChat?.()
              }}
            >
                <item.icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Button>
            ))}
          </nav>

                  {/* Clear History Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              size="sm"
              onClick={onClearHistory}
            > >
              <Trash2 className="h-4 w-4 mr-3" />
              Clear History
            </Button>
            
            <div className="text-xs text-gray-500 pt-2">
              <p>Dyor AI v1.0</p>
              <p>Built with OpenManus</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

