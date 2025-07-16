import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Brain, 
  Clock, 
  MessageSquare, 
  Zap,
  Globe,
  Code,
  FileText,
  Image,
  RotateCcw
} from 'lucide-react'
import { useSocket } from '../../context/SocketContext'

export const AgentStatus = () => {
  const { agentStatus, messages, getStatus } = useSocket()

  const getStatusColor = (status) => {
    switch (status) {
      case 'idle': return 'bg-gray-500'
      case 'thinking': return 'bg-yellow-500'
      case 'acting': return 'bg-blue-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'idle': return 'Ready'
      case 'thinking': return 'Thinking'
      case 'acting': return 'Working'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  const capabilities = [
    { icon: Globe, label: 'Web Browsing', enabled: true },
    { icon: Code, label: 'Code Execution', enabled: true },
    { icon: FileText, label: 'File Management', enabled: true },
    { icon: Image, label: 'Image Generation', enabled: true },
    { icon: Brain, label: 'Data Analysis', enabled: true },
    { icon: MessageSquare, label: 'Chat Interface', enabled: true }
  ]

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Agent Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Agent Status
            <Button variant="ghost" size="sm" onClick={getStatus}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(agentStatus.status)}`} />
            <span className="font-medium">{getStatusText(agentStatus.status)}</span>
          </div>
          
          {agentStatus.current_task && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Current Task</span>
              </div>
              <p className="text-sm text-blue-700">{agentStatus.current_task}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Messages</span>
            </div>
            <Badge variant="secondary">{messages.length}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Last Activity</span>
            </div>
            <span className="text-xs text-gray-500">
              {agentStatus.last_activity 
                ? new Date(agentStatus.last_activity).toLocaleTimeString()
                : 'Never'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Capabilities Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Capabilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {capabilities.map((capability, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <capability.icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{capability.label}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${capability.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Response Time</span>
              <span className="text-green-600">Fast</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Accuracy</span>
              <span className="text-blue-600">High</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">System Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Version</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Engine</span>
            <span>OpenManus</span>
          </div>
          <div className="flex justify-between">
            <span>Model</span>
            <span>GPT-4</span>
          </div>
          <div className="flex justify-between">
            <span>Uptime</span>
            <span>2h 34m</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

