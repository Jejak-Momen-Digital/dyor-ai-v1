import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { 
  Template, 
  Plus, 
  Search, 
  Sparkles,
  Code,
  FileText,
  MessageCircle,
  Brain
} from 'lucide-react'
import axios from 'axios'

export const ChatTemplates = ({ onSelectTemplate, onClose }) => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    system_prompt: '',
    tags: []
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/chat/templates')
      if (response.data.success) {
        setTemplates(response.data.templates)
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = async () => {
    try {
      const response = await axios.post('/api/chat/templates', newTemplate)
      if (response.data.success) {
        setTemplates([response.data.template, ...templates])
        setNewTemplate({ name: '', description: '', system_prompt: '', tags: [] })
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Failed to create template:', error)
    }
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getTemplateIcon = (tags) => {
    if (tags.includes('coding') || tags.includes('development')) return Code
    if (tags.includes('writing') || tags.includes('content')) return FileText
    if (tags.includes('creative') || tags.includes('brainstorm')) return Sparkles
    if (tags.includes('analysis') || tags.includes('research')) return Brain
    return MessageCircle
  }

  const defaultTemplates = [
    {
      id: 'general',
      name: 'General Assistant',
      description: 'A helpful AI assistant for general questions and tasks',
      system_prompt: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions.',
      tags: ['general', 'helpful'],
      is_default: true
    },
    {
      id: 'coding',
      name: 'Coding Assistant',
      description: 'Specialized in programming, debugging, and code review',
      system_prompt: 'You are an expert programming assistant. Help with coding questions, debugging, code review, and best practices. Provide clear explanations and working code examples.',
      tags: ['coding', 'programming', 'development'],
      is_default: true
    },
    {
      id: 'writing',
      name: 'Writing Assistant',
      description: 'Help with writing, editing, and content creation',
      system_prompt: 'You are a professional writing assistant. Help with writing, editing, proofreading, and content creation. Focus on clarity, style, and engagement.',
      tags: ['writing', 'content', 'editing'],
      is_default: true
    },
    {
      id: 'research',
      name: 'Research Assistant',
      description: 'Specialized in research, analysis, and fact-checking',
      system_prompt: 'You are a research assistant. Help with research tasks, data analysis, fact-checking, and providing well-sourced information. Be thorough and accurate.',
      tags: ['research', 'analysis', 'facts'],
      is_default: true
    }
  ]

  const allTemplates = [...defaultTemplates, ...filteredTemplates]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Chat Templates</h2>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create
            </Button>
            <Button onClick={onClose} size="sm" variant="ghost">
              Close
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium mb-3">Create New Template</h3>
          <div className="space-y-3">
            <Input
              placeholder="Template name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
            />
            <Input
              placeholder="Description"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
            />
            <Textarea
              placeholder="System prompt"
              value={newTemplate.system_prompt}
              onChange={(e) => setNewTemplate({...newTemplate, system_prompt: e.target.value})}
              rows={3}
            />
            <Input
              placeholder="Tags (comma separated)"
              onChange={(e) => setNewTemplate({
                ...newTemplate, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              })}
            />
            <div className="flex gap-2">
              <Button onClick={createTemplate} size="sm">
                Create Template
              </Button>
              <Button onClick={() => setShowCreateForm(false)} size="sm" variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Templates List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : allTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No templates found
            </div>
          ) : (
            <div className="grid gap-4">
              {allTemplates.map((template) => {
                const IconComponent = getTemplateIcon(template.tags)
                return (
                  <div
                    key={template.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {template.name}
                          </h3>
                          {template.is_default && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {template.description}
                        </p>
                        
                        {template.tags && template.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

