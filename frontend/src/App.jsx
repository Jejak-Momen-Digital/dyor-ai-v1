import { useState, useEffect } from 'react'
import { ChatInterface } from './components/Chat/ChatInterface'
import { ChatHistory } from './components/Chat/ChatHistory'
import { ChatTemplates } from './components/Chat/ChatTemplates'
import { AgentStatus } from './components/Agent/AgentStatus'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { SettingsPanel } from './components/Settings/SettingsPanel'
import { SocketProvider } from './context/SocketContext'
import axios from 'axios'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [currentView, setCurrentView] = useState('chat') // 'chat', 'history', 'templates', 'settings'

  const handleNewChat = async () => {
    try {
      const response = await axios.post('/api/chat/sessions', {
        title: 'New Chat'
      })
      if (response.data.success) {
        setCurrentSessionId(response.data.session.id)
        setCurrentView('chat')
      }
    } catch (error) {
      console.error('Failed to create new chat:', error)
    }
  }

  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId)
    setCurrentView('chat')
  }

  const handleSelectTemplate = async (template) => {
    try {
      const response = await axios.post('/api/chat/sessions', {
        title: `Chat with ${template.name}`,
        template_id: template.is_default ? null : template.id
      })
      if (response.data.success) {
        setCurrentSessionId(response.data.session.id)
        setCurrentView('chat')
      }
    } catch (error) {
      console.error('Failed to create chat from template:', error)
    }
  }

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all chat history?')) return
    
    try {
      // This would need to be implemented in the backend
      // For now, just refresh the current session
      if (currentSessionId) {
        await axios.post(`/api/chat/sessions/${currentSessionId}/clear`)
      }
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'history':
        return (
          <ChatHistory
            onSelectSession={handleSelectSession}
            currentSessionId={currentSessionId}
            onNewChat={handleNewChat}
          />
        )
      case 'templates':
        return (
          <ChatTemplates
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setCurrentView('chat')}
          />
        )
      case 'settings':
        return (
          <SettingsPanel onClose={() => setCurrentView('chat')} />
        )
      default:
        return (
          <div className="flex-1 flex">
            {/* Chat Interface */}
            <div className="flex-1 flex flex-col">
              <ChatInterface sessionId={currentSessionId} />
            </div>
            
            {/* Agent Status Panel */}
            <div className="w-80 border-l border-gray-200 bg-white">
              <AgentStatus />
            </div>
          </div>
        )
    }
  }

  return (
    <SocketProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => setCurrentView('settings')}
          onOpenHistory={() => setCurrentView('history')}
          onOpenTemplates={() => setCurrentView('templates')}
          onNewChat={handleNewChat}
          onClearHistory={handleClearHistory}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </SocketProvider>
  )
}

export default App

