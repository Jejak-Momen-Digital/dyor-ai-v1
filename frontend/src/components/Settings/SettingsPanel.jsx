import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Bot, 
  Palette, 
  Shield, 
  TestTube,
  Save,
  RotateCcw,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import axios from 'axios'

export const SettingsPanel = ({ onClose }) => {
  const [settings, setSettings] = useState(null)
  const [availableModels, setAvailableModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    loadSettings()
    loadAvailableModels()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await axios.get('/api/settings/agent')
      setSettings(response.data.settings)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableModels = async () => {
    try {
      const response = await axios.get('/api/settings/models')
      setAvailableModels(response.data.models)
    } catch (error) {
      console.error('Failed to load models:', error)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await axios.post('/api/settings/agent', settings)
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const response = await axios.post('/api/settings/test-connection', {
        model_config: settings.model
      })
      setTestResult(response.data.result)
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection test failed'
      })
    } finally {
      setTesting(false)
    }
  }

  const resetSettings = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      try {
        const response = await axios.post('/api/settings/reset')
        setSettings(response.data.settings)
      } catch (error) {
        console.error('Failed to reset settings:', error)
      }
    }
  }

  const updateSetting = (path, value) => {
    const newSettings = { ...settings }
    const keys = path.split('.')
    let current = newSettings
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setSettings(newSettings)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Agent Settings</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="model" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="model">Model</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>AI Model Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Select 
                    value={settings?.model?.provider} 
                    onValueChange={(value) => updateSetting('model.provider', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Select 
                    value={settings?.model?.name} 
                    onValueChange={(value) => updateSetting('model.name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels
                        .filter(model => model.provider === settings?.model?.provider)
                        .map(model => (
                          <SelectItem key={model.name} value={model.name}>
                            {model.display_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={settings?.model?.api_key || ''}
                  onChange={(e) => updateSetting('model.api_key', e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings?.model?.temperature || 0.7}
                    onChange={(e) => updateSetting('model.temperature', parseFloat(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="max_tokens">Max Tokens</Label>
                  <Input
                    id="max_tokens"
                    type="number"
                    value={settings?.model?.max_tokens || 2048}
                    onChange={(e) => updateSetting('model.max_tokens', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="top_p">Top P</Label>
                  <Input
                    id="top_p"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings?.model?.top_p || 1.0}
                    onChange={(e) => updateSetting('model.top_p', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button onClick={testConnection} disabled={testing}>
                  {testing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
                
                {testResult && (
                  <div className="flex items-center space-x-2">
                    {testResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={testResult.success ? 'text-green-600' : 'text-red-600'}>
                      {testResult.message}
                    </span>
                    {testResult.latency && (
                      <Badge variant="secondary">{testResult.latency}</Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agent_name">Agent Name</Label>
                  <Input
                    id="agent_name"
                    value={settings?.agent?.name || ''}
                    onChange={(e) => updateSetting('agent.name', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="max_conversation">Max Conversation Length</Label>
                  <Input
                    id="max_conversation"
                    type="number"
                    value={settings?.agent?.max_conversation_length || 50}
                    onChange={(e) => updateSetting('agent.max_conversation_length', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={settings?.agent?.description || ''}
                  onChange={(e) => updateSetting('agent.description', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="system_prompt">System Prompt</Label>
                <Textarea
                  id="system_prompt"
                  rows={4}
                  value={settings?.agent?.system_prompt || ''}
                  onChange={(e) => updateSetting('agent.system_prompt', e.target.value)}
                  placeholder="Enter the system prompt for your agent..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto_save"
                  checked={settings?.agent?.auto_save_conversations || false}
                  onCheckedChange={(checked) => updateSetting('agent.auto_save_conversations', checked)}
                />
                <Label htmlFor="auto_save">Auto-save conversations</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Agent Capabilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings?.capabilities && Object.entries(settings.capabilities).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key} className="capitalize">
                    {key.replace('_', ' ')}
                  </Label>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => updateSetting(`capabilities.${key}`, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="timeout">Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={settings?.advanced?.timeout || 30}
                    onChange={(e) => updateSetting('advanced.timeout', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="retry_attempts">Retry Attempts</Label>
                  <Input
                    id="retry_attempts"
                    type="number"
                    value={settings?.advanced?.retry_attempts || 3}
                    onChange={(e) => updateSetting('advanced.retry_attempts', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="log_level">Log Level</Label>
                  <Select 
                    value={settings?.advanced?.log_level} 
                    onValueChange={(value) => updateSetting('advanced.log_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="debug_mode"
                  checked={settings?.advanced?.debug_mode || false}
                  onCheckedChange={(checked) => updateSetting('advanced.debug_mode', checked)}
                />
                <Label htmlFor="debug_mode">Debug Mode</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

