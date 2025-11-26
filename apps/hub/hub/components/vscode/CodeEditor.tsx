'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Save, Play, Bug, FileText } from 'lucide-react'
import { vscodeIntegration } from '@/lib/vscode-integration'

interface CodeEditorProps {
  filePath?: string
  language?: string
  initialContent?: string
}

export function CodeEditor({ filePath, language = 'typescript', initialContent = '' }: CodeEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isModified, setIsModified] = useState(false)
  const [currentFile, setCurrentFile] = useState(filePath || 'untitled.ts')

  useEffect(() => {
    if (vscodeIntegration.isRunningInVSCode()) {
      vscodeIntegration.onMessage((message) => {
        if (message.command === 'fileContent') {
          setContent(message.data.content)
          setCurrentFile(message.data.filePath)
          setIsModified(false)
        }
      })
    }
  }, [])

  const handleContentChange = (value: string) => {
    setContent(value)
    setIsModified(true)
  }

  const handleSave = () => {
    if (vscodeIntegration.isRunningInVSCode()) {
      vscodeIntegration.sendMessage('saveFile', { filePath: currentFile, content })
    }
    setIsModified(false)
  }

  const handleRun = () => {
    vscodeIntegration.executeCommand('workbench.action.debug.start')
  }

  const handleDebug = () => {
    vscodeIntegration.executeCommand('workbench.action.debug.run')
  }

  const getLanguageBadge = () => {
    const colors = {
      typescript: 'bg-blue-100 text-blue-800',
      javascript: 'bg-yellow-100 text-yellow-800',
      python: 'bg-green-100 text-green-800',
      json: 'bg-gray-100 text-gray-800'
    }
    return colors[language as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <CardTitle className="text-lg">{currentFile}</CardTitle>
            {isModified && <Badge variant="destructive">Modified</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getLanguageBadge()}>{language}</Badge>
            <Button size="sm" onClick={handleSave} disabled={!isModified}>
              <Save className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleRun}>
              <Play className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleDebug}>
              <Bug className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="min-h-[400px] font-mono text-sm border-0 resize-none"
          placeholder="Start coding..."
        />
      </CardContent>
    </Card>
  )
}