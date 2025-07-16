import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar,
  Clock,
  Hash
} from 'lucide-react'
import axios from 'axios'

export const ChatHistory = ({ onSelectSession, currentSessionId, onNewChat }) => {
  const [sessions, setSessions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/chat/sessions')
      if (response.data.success) {
        setSessions(response.data.sessions)
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchSessions = async (query) => {
    if (!query.trim()) {
      loadSessions()
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(`/api/chat/search?q=${encodeURIComponent(query)}`)
      if (response.data.success) {
        setSessions(response.data.sessions)
      }
    } catch (error) {
      console.error('Failed to search sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Debounce search
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => {
      searchSessions(query)
    }, 300)
  }

  const deleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this chat?')) return

    try {
      const response = await axios.delete(`/api/chat/sessions/${sessionId}`)
      if (response.data.success) {
        setSessions(sessions.filter(s => s.id !== sessionId))
        if (currentSessionId === sessionId) {
          onNewChat()
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  const startEdit = (session) => {
    setEditingId(session.id)
    setEditTitle(session.title)
  }

  const saveEdit = async (sessionId) => {
    try {
      const response = await axios.put(`/api/chat/sessions/${sessionId}`, {
        title: editTitle
      })
      if (response.data.success) {
        setSessions(sessions.map(s => 
          s.id === sessionId ? { ...s, title: editTitle } : s
        ))
        setEditingId(null)
        setEditTitle('')
      }
    } catch (error) {
      console.error('Failed to update session:', error)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
          <Button 
            onClick={onNewChat}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                    currentSessionId === session.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  {/* Session Content */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {editingId === session.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(session.id)
                              if (e.key === 'Escape') cancelEdit()
                            }}
                            className="text-sm"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              saveEdit(session.id)
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {session.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {session.message_count} messages
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(session.updated_at)}
                            </div>
                          </div>

                          {session.last_message && (
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {session.last_message.content}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    {editingId !== session.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEdit(session)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSession(session.id)
                          }}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

